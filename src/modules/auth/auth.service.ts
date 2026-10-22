
import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';
import { authMessages } from '../../common/enums/messages.enum';
import type { SignOptions } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const email = loginDto.email.trim().toLowerCase();

    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.email = :email', { email })
      .getOne();

    if (
      !user ||
      !(await bcrypt.compare(loginDto.password, user.passwordHash))
    ) {
      throw new UnauthorizedException(
        authMessages.INVALID_CREDENTIALS,
      );
    }

    if (!user.isActive) {
      throw new UnauthorizedException(
        authMessages.ACCOUNT_INACTIVE,
      );
    }

    const accessToken = await this.jwtService.signAsync({
      sub: user.id,
      email: user.email,
    });

    const { passwordHash, ...publicUser } = user;

    return {
      message: authMessages.LOGIN_SUCCESSFUL,
      data: {
        accessToken,
        user: publicUser,
      },
    };
  }
}
