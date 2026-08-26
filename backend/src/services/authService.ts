import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { env } from '../config/env.js';
import { userRepository, UserRepository } from '../repositories/userRepository.js';
import { RegisterInput, LoginInput } from '../validators/authValidators.js';
import { AuthResponseData, AuthUser, JwtUserPayload } from '../types/auth.js';
import { AppError } from '../middleware/errorHandler.js';

export class AuthService {
  constructor(private userRepo: UserRepository) {}

  async register(input: RegisterInput): Promise<AuthResponseData> {
    const existingUser = await this.userRepo.findByEmail(input.email);
    if (existingUser) {
      throw new AppError('Email đã được đăng ký trong hệ thống', 409, 'EMAIL_ALREADY_EXISTS');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(input.password, saltRounds);
    const userId = randomUUID();

    await this.userRepo.create({
      id: userId,
      name: input.name,
      email: input.email,
      password_hash: passwordHash,
    });

    const safeUser: AuthUser = {
      id: userId,
      name: input.name,
      email: input.email.toLowerCase(),
      avatarUrl: null,
    };

    return { user: safeUser };
  }

  async login(input: LoginInput): Promise<AuthResponseData> {
    const user = await this.userRepo.findByEmail(input.email);
    if (!user) {
      throw new AppError('Email hoặc mật khẩu không chính xác', 401, 'INVALID_CREDENTIALS');
    }

    const isMatch = await bcrypt.compare(input.password, user.password_hash);
    if (!isMatch) {
      throw new AppError('Email hoặc mật khẩu không chính xác', 401, 'INVALID_CREDENTIALS');
    }

    const payload: JwtUserPayload = { userId: user.id };
    const token = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
    });

    const safeUser: AuthUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatar_url,
    };

    return { token, user: safeUser };
  }

  async getCurrentUser(userId: string): Promise<AuthUser> {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new AppError('Người dùng không tồn tại', 404, 'USER_NOT_FOUND');
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      avatarUrl: user.avatar_url,
    };
  }
}

export const authService = new AuthService(userRepository);