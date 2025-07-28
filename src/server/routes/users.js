// server/routes/users.js - ES Modules Version
import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { authenticateToken, generateToken } from '../middleware/auth.js';
import UserDbService from '../services/userDbService.js';

const router = express.Router();
// Create an instance of the service
const userDbService = new UserDbService();

// =======================
// REGISTRATION
// =======================
router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, phone, dateOfBirth, gender } = req.body;

    // Validation
    if (!email || !password || !fullName) {
      return res.status(400).json({
        error: 'メールアドレス、パスワード、氏名は必須です。'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        error: 'パスワードは8文字以上で入力してください。'
      });
    }

    // Check if user already exists
    const existingUser = await userDbService.findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        error: 'このメールアドレスは既に登録されています。'
      });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Generate email verification token
    const emailVerificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const userData = {
      email,
      passwordHash,
      fullName,
      phone,
      dateOfBirth,
      gender,
      emailVerificationToken,
      preferredLanguage: 'ja'
    };

    const userId = await userDbService.createUser(userData);

    // TODO: Send verification email
    // await emailService.sendVerificationEmail(email, emailVerificationToken);

    res.status(201).json({
      success: true,
      userId,
      message: 'アカウントが作成されました。確認メールをご確認ください。'
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      error: 'アカウント作成中にエラーが発生しました。'
    });
  }
});

// =======================
// LOGIN
// =======================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        error: 'メールアドレスとパスワードを入力してください。'
      });
    }

    // Find user
    const user = await userDbService.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({
        error: 'メールアドレスまたはパスワードが正しくありません。'
      });
    }

    // Check account status
    if (user.accountStatus !== 'active') {
      return res.status(401).json({
        error: 'このアカウントは無効になっています。'
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: 'メールアドレスまたはパスワードが正しくありません。'
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);

    // Create session
    await userDbService.createUserSession({
      userId: user.id,
      sessionId: crypto.randomBytes(32).toString('hex'),
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Update login statistics
    await userDbService.updateLoginStats(user.id);

    // Remove sensitive data
    const userResponse = user.toSafeFormat();

    res.json({
      success: true,
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      error: 'ログイン中にエラーが発生しました。'
    });
  }
});

// =======================
// LOGOUT
// =======================
router.post('/logout', authenticateToken, async (req, res) => {
  try {
    // Delete user session
    await userDbService.deleteUserSession(req.user.id);

    res.json({
      success: true,
      message: 'ログアウトしました。'
    });

  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'ログアウト中にエラーが発生しました。'
    });
  }
});

// =======================
// GET PROFILE
// =======================
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await userDbService.findUserById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        error: 'ユーザーが見つかりません。'
      });
    }

    res.json({
      success: true,
      user: user.toSafeFormat()
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      error: 'プロフィール取得中にエラーが発生しました。'
    });
  }
});

// =======================
// UPDATE PROFILE
// =======================
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { fullName, email, phone, dateOfBirth, gender, preferredLanguage } = req.body;

    // Validation
    if (!fullName || !email) {
      return res.status(400).json({
        error: '氏名とメールアドレスは必須です。'
      });
    }

    // Check if email is already taken by another user
    if (email !== req.user.email) {
      const existingUser = await userDbService.findUserByEmail(email);
      if (existingUser && existingUser.id !== req.user.id) {
        return res.status(400).json({
          error: 'このメールアドレスは既に使用されています。'
        });
      }
    }

    const updateData = {
      fullName,
      email,
      phone,
      dateOfBirth,
      gender,
      preferredLanguage: preferredLanguage || 'ja'
    };

    const updatedUser = await userDbService.updateUser(req.user.id, updateData);

    res.json({
      success: true,
      user: updatedUser.toSafeFormat()
    });

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      error: 'プロフィール更新中にエラーが発生しました。'
    });
  }
});

// =======================
// CHANGE PASSWORD
// =======================
router.post('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validation
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: '現在のパスワードと新しいパスワードを入力してください。'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        error: '新しいパスワードは8文字以上で入力してください。'
      });
    }

    // Get user with password
    const user = await userDbService.findUserById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: 'ユーザーが見つかりません。'
      });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: '現在のパスワードが正しくありません。'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await userDbService.updateUserPassword(req.user.id, newPasswordHash);

    res.json({
      success: true,
      message: 'パスワードが変更されました。'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      error: 'パスワード変更中にエラーが発生しました。'
    });
  }
});

// =======================
// FAVORITES
// =======================
router.get('/favorites', authenticateToken, async (req, res) => {
  try {
    const favorites = await userDbService.getUserFavorites(req.user.id);

    res.json({
      success: true,
      favorites
    });

  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      error: 'お気に入り取得中にエラーが発生しました。'
    });
  }
});

router.post('/favorites', authenticateToken, async (req, res) => {
  try {
    const { propertyId } = req.body;

    if (!propertyId) {
      return res.status(400).json({
        error: '物件IDが必要です。'
      });
    }

    // Check if already in favorites
    const existing = await userDbService.checkFavorite(req.user.id, propertyId);
    if (existing) {
      return res.status(400).json({
        error: 'この物件は既にお気に入りに追加されています。'
      });
    }

    await userDbService.addToFavorites(req.user.id, propertyId);

    res.json({
      success: true,
      message: 'お気に入りに追加しました。'
    });

  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({
      error: 'お気に入り追加中にエラーが発生しました。'
    });
  }
});

router.delete('/favorites/:propertyId', authenticateToken, async (req, res) => {
  try {
    const { propertyId } = req.params;

    await userDbService.removeFromFavorites(req.user.id, propertyId);

    res.json({
      success: true,
      message: 'お気に入りから削除しました。'
    });

  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({
      error: 'お気に入り削除中にエラーが発生しました。'
    });
  }
});

// =======================
// SEARCH HISTORY
// =======================
router.get('/search-history', authenticateToken, async (req, res) => {
  try {
    const searchHistory = await userDbService.getUserSearchHistory(req.user.id);

    res.json({
      success: true,
      searchHistory
    });

  } catch (error) {
    console.error('Get search history error:', error);
    res.status(500).json({
      error: '検索履歴取得中にエラーが発生しました。'
    });
  }
});

router.post('/search-history', authenticateToken, async (req, res) => {
  try {
    const { searchQuery, searchFilters, resultsCount } = req.body;

    await userDbService.saveSearchHistory(req.user.id, {
      searchQuery,
      searchFilters,
      resultsCount
    });

    res.json({
      success: true
    });

  } catch (error) {
    console.error('Save search history error:', error);
    res.status(500).json({
      error: '検索履歴保存中にエラーが発生しました。'
    });
  }
});

// =======================
// SOCIAL LOGIN PLACEHOLDERS
// =======================
router.post('/auth/google', async (req, res) => {
  res.status(501).json({
    error: 'Google ログインは現在開発中です。'
  });
});

router.post('/auth/line', async (req, res) => {
  res.status(501).json({
    error: 'LINE ログインは現在開発中です。'
  });
});

router.post('/auth/yahoo', async (req, res) => {
  res.status(501).json({
    error: 'Yahoo ログインは現在開発中です。'
  });
});

export default router;