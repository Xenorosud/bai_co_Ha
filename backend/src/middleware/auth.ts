/**
 * Authentication Middleware
 */

import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, extractTokenFromHeader } from '../utils/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: string;
        employee?: any;
      };
    }
  }
}

// Authentication middleware
export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = extractTokenFromHeader(req.headers.authorization);

    if (!token) {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Access token is required',
        error: 'NO_TOKEN'
      });
    }

    // Verify token
    const decoded = verifyAccessToken(token);

    // Check if user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        employee: true
      }
    });

    if (!user || user.status !== 'ACTIVE') {
      return res.status(401).json({
        status: 'ERROR',
        message: 'User not found or inactive',
        error: 'USER_INACTIVE'
      });
    }

    // Add user info to request
    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
      employee: user.employee
    };

    next();
  } catch (error: any) {
    if (error.message === 'TOKEN_EXPIRED') {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Access token expired',
        error: 'TOKEN_EXPIRED'
      });
    } else if (error.message === 'INVALID_TOKEN') {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Invalid access token',
        error: 'INVALID_TOKEN'
      });
    } else {
      return res.status(500).json({
        status: 'ERROR',
        message: 'Authentication error',
        error: error.message
      });
    }
  }
};

// Role-based authorization middleware
export const requireRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Authentication required',
        error: 'NOT_AUTHENTICATED'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'ERROR',
        message: 'Insufficient permissions',
        error: 'FORBIDDEN',
        requiredRoles: allowedRoles,
        userRole: req.user.role
      });
    }

    next();
  };
};

// Permission-based authorization middleware
export const requirePermission = (permission: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.employee) {
      return res.status(401).json({
        status: 'ERROR',
        message: 'Employee authentication required',
        error: 'NOT_AUTHENTICATED'
      });
    }

    const employee = req.user.employee;
    const permissions = employee.permissions || {};

    if (!permissions[permission]) {
      return res.status(403).json({
        status: 'ERROR',
        message: `Permission '${permission}' required`,
        error: 'INSUFFICIENT_PERMISSION',
        requiredPermission: permission
      });
    }

    next();
  };
};