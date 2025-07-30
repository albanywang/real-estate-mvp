// server/routes/users.js - Fixed Supabase Version
import express from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { authenticateToken, generateToken } from '../middleware/auth.js';
import userDbService from '../services/userDbService.js'; // Import the singleton instance

const router = express.Router();

// =======================
// REGISTRATION
// =======================
router.post('/register', async (req, res) => {
  try {
    console.log('📝 Registration attempt:', req.body.email);
    
    const { email, password, fullName } = req.body;

    // Validation
    if (!email || !password || !fullName) {
      return res.status(400).json({
        success: false,
        error: 'メールアドレス、パスワード、氏名は必須です。'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'パスワードは8文字以上で入力してください。'
      });
    }

    // Check if user already exists
    const existingUserResult = await userDbService.findUserByEmail(email);
    if (existingUserResult.success) {
      return res.status(400).json({
        success: false,
        error: 'このメールアドレスは既に登録されています。'
      });
    }

    // Hash password
    const saltRounds = 12;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Generate email verification token
    const email_verification_token = crypto.randomBytes(32).toString('hex');

    // Create user data object
    const userData = {
      email,
      password_hash,
      full_name: fullName,
      email_verification_token,
      preferred_language: 'ja'
    };

    console.log('🔧 Creating user with data:', { ...userData, password_hash: '[HIDDEN]' });

    // Create user using the fixed service
    const result = await userDbService.createUser(userData);

    if (result.success) {
      console.log('✅ User created successfully:', result.user.id);
      
      // TODO: Send verification email
      // await emailService.sendVerificationEmail(email, email_verification_token);

      res.status(201).json({
        success: true,
        user: result.user,
        message: result.message
      });
    } else {
      console.log('❌ User creation failed:', result.error);
      res.status(400).json({
        success: false,
        error: result.error
      });
    }

  } catch (error) {
    console.error('❌ Registration error:', error);
    res.status(500).json({
      success: false,
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
    
    const { email, password } = req.body;
    
    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'メールアドレスとパスワードを入力してください。'
      });
    }
    
    // Find user
    const userResult = await userDbService.findUserByEmail(email);
    console.log('👤 User lookup result:', userResult.success);
    
    if (!userResult.success || !userResult.user) {
      console.log('❌ No user found');
      return res.status(401).json({
        success: false,
        error: 'メールアドレスまたはパスワードが正しくありません。'
      });
    }
    
    const user = userResult.user;
    console.log('🔒 User found with ID:', user.id);
    
    // Check account status
    if (user.account_status !== 'active') {
      console.log('❌ Account not active:', user.account_status);
      return res.status(401).json({
        success: false,
        error: 'このアカウントは無効になっています。'
      });
    }
    
    // Verify password
    console.log('🔍 Verifying password...');
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    console.log('🔒 Password verification result:', isValidPassword);
    
    if (!isValidPassword) {
      console.log('❌ Password mismatch');
      return res.status(401).json({
        success: false,
        error: 'メールアドレスまたはパスワードが正しくありません。'
      });
    }
    
    console.log('✅ Password verified successfully!');
    
    // Update last login
    await userDbService.updateLastLogin(user.id);
    
    // Generate JWT token (you can implement this properly later)
    const token = generateToken ? generateToken(user) : `temp-token-${user.id}`;
    
    res.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        preferred_language: user.preferred_language,
        email_verified: user.email_verified
      },
      token: token
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
      success: false,
      error: 'ログアウト中にエラーが発生しました。'
    });
  }
});

// =======================
// GET PROFILE
// =======================
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const result = await userDbService.findUserById(req.user.id);
    
    if (!result.success || !result.user) {
      return res.status(404).json({
        success: false,
        error: 'ユーザーが見つかりません。'
      });
    }

    res.json({
      success: true,
      user: {
        id: result.user.id,
        email: result.user.email,
        full_name: result.user.full_name,
        preferred_language: result.user.preferred_language,
        email_verified: result.user.email_verified,
        account_status: result.user.account_status,
        created_at: result.user.created_at
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
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
        success: false,
        error: '氏名とメールアドレスは必須です。'
      });
    }

    // Check if email is already taken by another user
    if (email !== req.user.email) {
      const existingUserResult = await userDbService.findUserByEmail(email);
      if (existingUserResult.success && existingUserResult.user.id !== req.user.id) {
        return res.status(400).json({
          success: false,
          error: 'このメールアドレスは既に使用されています。'
        });
      }
    }

    const updateData = {
      full_name,
      email,
      preferred_language: preferred_language || 'ja'
    };

    const result = await userDbService.updateUser(req.user.id, updateData);

    if (result.success) {
      res.json({
        success: true,
        user: result.user
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }

  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'プロフィール更新中にエラーが発生しました。'
    });
  }
});

// =======================
// DEBUGGING ROUTES (REMOVE IN PRODUCTION)
// =======================
router.post('/reset-password', async (req, res) => {
  try {
    const { email = 'test@example.com', newPassword = 'test123' } = req.body;
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    console.log('🔄 Resetting password for:', email);
    console.log('🔒 New password will be:', newPassword);
    
    // Update password using Supabase
    const { data, error } = await userDbService.supabase
      .from('users')
      .update({ password_hash: hashedPassword })
      .eq('email', email)
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
        email: email,
        password: newPassword
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

router.get('/debug-user/:email', async (req, res) => {
  try {
    const email = req.params.email;
    console.log('🔍 Debug lookup for email:', email);
    
    const { data, error } = await userDbService.supabase
      .from('users')
      .select('id, email, full_name, account_status, email_verified, created_at')
      .eq('email', email)
      .single();
    
    if (error) {
      console.log('❌ Debug error:', error);
      return res.json({
        success: false,
        error: error.message,
        code: error.code
      });
    }
    
    console.log('✅ Debug found user:', data);
    res.json({
      success: true,
      user: data,
      message: 'User found successfully'
    });
    
  } catch (error) {
    console.error('❌ Debug error:', error);
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
    const result = await userDbService.getUserFavorites(req.user.id);

    if (result.success) {
      res.json({
        success: true,
        favorites: result.favorites
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }

  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      error: 'お気に入り取得中にエラーが発生しました。'
    });
  }
});

router.post('/favorites', authenticateToken, async (req, res) => {
  try {
    const { propertyId } = req.body;

    if (!propertyId) {
      return res.status(400).json({
        success: false,
        error: '物件IDが必要です。'
      });
    }

    const result = await userDbService.addToFavorites(req.user.id, propertyId);

    if (result.success) {
      res.json({
        success: true,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }

  } catch (error) {
    console.error('Add to favorites error:', error);
    res.status(500).json({
      success: false,
      error: 'お気に入り追加中にエラーが発生しました。'
    });
  }
});

router.delete('/favorites/:propertyId', authenticateToken, async (req, res) => {
  try {
    const { propertyId } = req.params;

    const result = await userDbService.removeFromFavorites(req.user.id, propertyId);

    if (result.success) {
      res.json({
        success: true,
        message: result.message
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }

  } catch (error) {
    console.error('Remove from favorites error:', error);
    res.status(500).json({
      success: false,
      error: 'お気に入り削除中にエラーが発生しました。'
    });
  }
});

// =======================
// SEARCH HISTORY
// =======================
router.get('/search-history', authenticateToken, async (req, res) => {
  try {
    const result = await userDbService.getUserSearchHistory(req.user.id);

    if (result.success) {
      res.json({
        success: true,
        searchHistory: result.history
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }

  } catch (error) {
    console.error('Get search history error:', error);
    res.status(500).json({
      success: false,
      error: '検索履歴取得中にエラーが発生しました。'
    });
  }
});

router.post('/search-history', authenticateToken, async (req, res) => {
  try {
    const { searchQuery, searchFilters, resultsCount } = req.body;

    const result = await userDbService.saveSearchHistory(req.user.id, {
      searchQuery,
      searchFilters,
      resultsCount
    });

    if (result.success) {
      res.json({
        success: true
      });
    } else {
      res.status(400).json({
        success: false,
        error: result.error
      });
    }

  } catch (error) {
    console.error('Save search history error:', error);
    res.status(500).json({
      success: false,
      error: '検索履歴保存中にエラーが発生しました。'
    });
  }
});

// =======================
// SOCIAL LOGIN PLACEHOLDERS
// =======================
router.post('/auth/google', async (req, res) => {
  res.status(501).json({
    success: false,
    error: 'Google ログインは現在開発中です。'
  });
});

router.post('/auth/line', async (req, res) => {
  res.status(501).json({
    success: false,
    error: 'LINE ログインは現在開発中です。'
  });
});

router.post('/auth/yahoo', async (req, res) => {
  res.status(501).json({
    success: false,
    error: 'Yahoo ログインは現在開発中です。'
  });
});

export default router;