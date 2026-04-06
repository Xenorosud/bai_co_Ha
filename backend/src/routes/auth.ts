/**
 * Authentication Routes
 */

import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import {
  hashPassword,
  verifyPassword,
  generateTokens,
  verifyRefreshToken
} from '../utils/auth';
import { authenticateToken } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Login endpoint
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Email và mật khẩu là bắt buộc',
        error: 'MISSING_FIELDS'
      });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        employee: true
      }
    });

    if (!user) {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Email hoặc mật khẩu không đúng',
        error: 'INVALID_CREDENTIALS'
      });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Tài khoản đã bị vô hiệu hóa',
        error: 'ACCOUNT_INACTIVE'
      });
    }

    // For existing users with default hash, check if password is '123456'
    let isValidPassword = false;

    console.log('🔍 Login Debug Info:');
    console.log('  - Email:', email);
    console.log('  - Password received:', password);
    console.log('  - User found:', !!user);
    console.log('  - Stored hash:', user.passwordHash?.substring(0, 20) + '...');
    console.log('  - Hash length:', user.passwordHash?.length);

    if (user.passwordHash === 'default_hash') {
      // Default password is '123456' for demo
      console.log('  - Using default hash logic');
      isValidPassword = (password === '123456');

      // Update to proper hashed password on first login
      if (isValidPassword) {
        const hashedPassword = await hashPassword(password);
        await prisma.user.update({
          where: { id: user.id },
          data: { passwordHash: hashedPassword }
        });
      }
    } else {
      // Verify hashed password
      console.log('  - Using bcrypt verification');
      isValidPassword = await verifyPassword(password, user.passwordHash);
      console.log('  - Password verification result:', isValidPassword);
    }

    if (!isValidPassword) {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Email hoặc mật khẩu không đúng',
        error: 'INVALID_CREDENTIALS'
      });
    }

    // Generate tokens
    const tokens = generateTokens(user.id, user.email, user.role);

    // Store refresh token in database (optional, for logout functionality)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        updatedAt: new Date()
        // You could store refresh token here if needed
      }
    });

    // Prepare user response data
    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      employee: user.employee ? {
        id: user.employee.id,
        name: user.employee.name,
        permissions: user.employee.permissions
      } : null
    };

    res.json({
      status: 'OK',
      message: 'Đăng nhập thành công',
      data: {
        user: userData,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi server khi đăng nhập',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Refresh token endpoint
router.post('/refresh-token', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Refresh token là bắt buộc',
        error: 'MISSING_REFRESH_TOKEN'
      });
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(refreshToken);

    // Check if user still exists and is active
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: { employee: true }
    });

    if (!user || user.status !== 'ACTIVE') {
      return res.status(401).json({
        status: 'ERROR',
        message: 'User không tồn tại hoặc đã bị vô hiệu hóa',
        error: 'USER_INACTIVE'
      });
    }

    // Generate new tokens
    const tokens = generateTokens(user.id, user.email, user.role);

    res.json({
      status: 'OK',
      message: 'Refresh token thành công',
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresIn: tokens.expiresIn
      }
    });

  } catch (error: any) {
    if (error.message === 'REFRESH_TOKEN_EXPIRED') {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Refresh token đã hết hạn',
        error: 'REFRESH_TOKEN_EXPIRED'
      });
    } else if (error.message === 'INVALID_REFRESH_TOKEN') {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Refresh token không hợp lệ',
        error: 'INVALID_REFRESH_TOKEN'
      });
    } else {
      return res.status(500).json({
        status: 'ERROR',
        message: 'Lỗi server khi refresh token',
        error: error.message
      });
    }
  }
});

// Get current user info
router.get('/me', authenticateToken, async (req: Request, res: Response) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: {
        employee: true
      }
    });

    if (!user) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'User không tìm thấy',
        error: 'USER_NOT_FOUND'
      });
    }

    const userData = {
      id: user.id,
      email: user.email,
      role: user.role,
      employee: user.employee ? {
        id: user.employee.id,
        name: user.employee.name,
        permissions: user.employee.permissions,
        status: user.employee.status
      } : null
    };

    res.json({
      status: 'OK',
      message: 'Lấy thông tin user thành công',
      data: userData
    });

  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi server khi lấy thông tin user',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Change password
router.post('/change-password', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Mật khẩu hiện tại và mật khẩu mới là bắt buộc',
        error: 'MISSING_FIELDS'
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Mật khẩu mới phải có ít nhất 8 ký tự',
        error: 'PASSWORD_TOO_SHORT'
      });
    }

    // Get current user
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId }
    });

    if (!user) {
      return res.status(404).json({
        status: 'ERROR',
        message: 'User không tìm thấy',
        error: 'USER_NOT_FOUND'
      });
    }

    // Verify current password
    let isCurrentPasswordValid = false;

    if (user.passwordHash === 'default_hash') {
      isCurrentPasswordValid = (currentPassword === '123456');
    } else {
      isCurrentPasswordValid = await verifyPassword(currentPassword, user.passwordHash);
    }

    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        status: 'ERROR',
        message: 'Mật khẩu hiện tại không đúng',
        error: 'INVALID_CURRENT_PASSWORD'
      });
    }

    // Hash new password
    const hashedNewPassword = await hashPassword(newPassword);

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashedNewPassword,
        updatedAt: new Date()
      }
    });

    res.json({
      status: 'OK',
      message: 'Đổi mật khẩu thành công'
    });

  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi server khi đổi mật khẩu',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Logout endpoint
router.post('/logout', authenticateToken, async (req: Request, res: Response) => {
  try {
    // In a more complex system, you might invalidate the refresh token here
    // For now, we just return success since JWT tokens are stateless

    res.json({
      status: 'OK',
      message: 'Đăng xuất thành công'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Lỗi server khi đăng xuất',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;