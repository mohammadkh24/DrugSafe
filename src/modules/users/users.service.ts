
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { QueryUsersDto } from './dto/query-users.dto';
import { userMessages } from '../../common/enums/messages.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private toPublicUser(user: User) {
    const { passwordHash, ...publicUser } = user;
    return publicUser;
  }

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.userRepository.exist({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException(
        userMessages.USER_EMAIL_ALREADY_EXISTS,
      );
    }

    const { password, ...userData } = createUserDto;

    const user = this.userRepository.create({
      ...userData,
      passwordHash: await bcrypt.hash(password, 12),
    });

    try {
      const savedUser = await this.userRepository.save(user);

      return {
        message: userMessages.USER_CREATED,
        data: this.toPublicUser(savedUser),
      };
    } catch (error) {
      if (error?.code === '23505') {
        throw new ConflictException(
          userMessages.USER_EMAIL_ALREADY_EXISTS,
        );
      }

      throw error;
    }
  }

  async findAll(query: QueryUsersDto) {
    const {
      page = 1,
      limit = 10,
      search,
      isActive,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
    } = query;

    const where = search
      ? [
          { fullName: ILike(`%${search}%`), ...(isActive !== undefined && { isActive }) },
          { email: ILike(`%${search}%`), ...(isActive !== undefined && { isActive }) },
        ]
      : isActive !== undefined
        ? [{ isActive }]
        : {};

    const [users, total] = await this.userRepository.findAndCount({
      where,
      select: {
        id: true,
        fullName: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      order: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: users,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(userMessages.USER_NOT_FOUND);
    }

    return { data: user };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(userMessages.USER_NOT_FOUND);
    }

    if (
      updateUserDto.email &&
      updateUserDto.email !== user.email &&
      await this.userRepository.exist({
        where: { email: updateUserDto.email },
      })
    ) {
      throw new ConflictException(
        userMessages.USER_EMAIL_ALREADY_EXISTS,
      );
    }

    const { password, ...userData } = updateUserDto;

    Object.assign(user, userData);

    if (password) {
      user.passwordHash = await bcrypt.hash(password, 12);
    }

    try {
      const updatedUser = await this.userRepository.save(user);

      return {
        message: userMessages.USER_UPDATED,
        data: this.toPublicUser(updatedUser),
      };
    } catch (error) {
      if (error?.code === '23505') {
        throw new ConflictException(
          userMessages.USER_EMAIL_ALREADY_EXISTS,
        );
      }

      throw error;
    }
  }

  async remove(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException(userMessages.USER_NOT_FOUND);
    }

    await this.userRepository.remove(user);

    return {
      message: userMessages.USER_DELETED,
      data: user,
    };
  }
}
