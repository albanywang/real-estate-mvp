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
  let email, password, fullName;
  try {
    console.log('📝 Registration attempt:', req.body.email);
        // Now assign the values
    ({ email, password, fullName } = req.body);
    
    // Validation
    if (!email || !password || !fullName) {
      console.log('❌ Server: Validation failed!');
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
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Generate email verification token
    const email_verification_token = crypto.randomBytes(32).toString('hex');

    // Create user
    const userData = {
      email,
      password_hash,
      full_name: fullName,  // Map fullName to full_name,
      email_verification_token,
      preferred_language: 'ja'
    };

    const userId = await userDbService.createUser(userData);

    // TODO: Send verification email
    // await emailService.sendVerificationEmail(email, email_verification_token);

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
    console.log('🔐 Login attempt received');
    console.log('📧 Email:', req.body.email);
    console.log('🔒 Password provided:', req.body.password);
    
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'メールアドレスとパスワードを入力してください。'
      });
    }
    
    // Find user - FIXED: Handle the result object
    const userResult = await req.userDbService.findUserByEmail(email);
    console.log('👤 User lookup result:', userResult.success);
    
    if (!userResult.success || !userResult.user) {
      console.log('❌ No user found');
      return res.status(401).json({
        success: false,
        error: 'メールアドレスまたはパスワードが正しくありません。'
      });
    }
    
    const user = userResult.user; // Extract the actual user object
    
    console.log('🔒 User password hash:', user.password_hash);
    console.log('🔒 Input password:', password);
    console.log('🔒 Hash length:', user.password_hash?.length);
    console.log('🔒 Password length:', password?.length);
    
    // Check account status - FIXED: Use snake_case field name
    if (user.account_status !== 'active') {
      console.log('❌ Account not active:', user.account_status);
      return res.status(401).json({
        success: false,
        error: 'このアカウントは無効になっています。'
      });
    }
    
    // Verify password
    console.log('🔍 About to compare passwords...');
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    console.log('🔒 bcrypt.compare result:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('❌ Password mismatch');
      return res.status(401).json({
        success: false,
        error: 'メールアドレスまたはパスワードが正しくありません。'
      });
    }
    
    console.log('✅ Password verified successfully!');
    
    // Update last login
    await req.userDbService.updateLastLogin(user.id);
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        preferred_language: user.preferred_language,
        email_verified: user.email_verified
      },
      token: 'temp-token-' + user.id
    });
    
  } catch (error) {
    console.error('❌ Login error details:', error);
    res.status(500).json({
      success: false,
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

// Add this temporary route to test the password hash
router.post('/verify-password', async (req, res) => {
  try {
    const { email, testPassword } = req.body;
    
    // Get user from database
    const userResult = await req.userDbService.findUserByEmail(email);
    
    if (!userResult.success || !userResult.user) {
      return res.json({ success: false, error: 'User not found' });
    }
    
    const user = userResult.user;
    console.log('🔍 Testing password for user:', email);
    console.log('🔍 Stored hash:', user.password_hash);
    console.log('🔍 Testing password:', testPassword);
    
    // Test the password
    const isValid = await bcrypt.compare(testPassword, user.password_hash);
    console.log('🔍 Password match result:', isValid);
    
    return res.json({
      success: true,
      email: email,
      testPassword: testPassword,
      hashMatch: isValid,
      storedHash: user.password_hash
    });
    
  } catch (error) {
    console.error('Verify password error:', error);
    return res.json({ success: false, error: error.message });
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
    const { full_name, email, preferred_language } = req.body;

    // Validation
    if (!full_name || !email) {
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
      full_name,
      email,
      preferred_language: preferred_language || 'ja'
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
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        error: '現在のパスワードが正しくありません。'
      });
    }

    // Hash new password
    const saltRounds = 12;
    const newpassword_hash = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await userDbService.updateUserPassword(req.user.id, newpassword_hash);

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

router.post('/reset-password', async (req, res) => {
  try {
    const newPassword = 'test123';
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    console.log('🔄 Resetting password for test@example.com');
    console.log('🔒 New password will be:', newPassword);
    console.log('🔒 New hash will be:', hashedPassword);
    
    // Update password using Supabase
    const { data, error } = await req.userDbService.supabase
      .from('users')
      .update({ password_hash: hashedPassword })
      .eq('email', 'test@example.com')
      .select();
    
    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }
    
    console.log('✅ Password updated successfully');
    
    res.json({
      success: true,
      message: 'Password reset successfully!',
      newCredentials: {
        email: 'test@example.com',
        password: 'test123'
      },
      updatedUser: data[0]
    });
    
  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/reset-password', async (req, res) => {
  try {
    const newPassword = 'test123';
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    console.log('🔄 Resetting password for test@example.com');
    console.log('🔒 New password will be:', newPassword);
    console.log('🔒 New hash will be:', hashedPassword);
    
    // Update password using Supabase directly
    const supabase = req.userDbService.supabase;
    const { data, error } = await supabase
      .from('users')
      .update({ password_hash: hashedPassword })
      .eq('email', 'test@example.com')
      .select();
    
    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }
    
    console.log('✅ Password updated successfully');
    
    res.json({
      success: true,
      message: 'Password reset successfully!',
      newCredentials: {
        email: 'test@example.com',
        password: 'test123'
      },
      updatedUser: data[0]
    });
    
  } catch (error) {
    console.error('❌ Reset password error:', error);
    res.status(500).json({
      success: false,
      error: error.message
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