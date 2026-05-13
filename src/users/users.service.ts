import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { UserRepository } from './repositories/users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { DBError, PostgresErrorCode } from 'src/common/db/db-error.types';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { PaginationInterface } from 'src/common/pagination/pagination.interface';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(private readonly userRepository: UserRepository) {}

  async create(data: CreateUserDto): Promise<User> {
    try {
      return await this.userRepository.createUser(data);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(pagination: PaginationDto): Promise<PaginationInterface<User>> {
    const { limit = 10, page = 1 } = pagination;
    const skip = (page - 1) * limit;
    const [data, total] = await this.userRepository.findUsers(limit, skip);
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(term: string): Promise<User> {
    const user = await this.userRepository.findUser(term);

    if (!user) {
      throw new NotFoundException(`User with term: ${term} not found`);
    }
    return user;
  }

  async update(id: string, data: UpdateUserDto): Promise<User> {
    try {
      return await this.userRepository.updateUser(id, data);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      return this.handleDBExceptions(error);
    }
  }

  async delete(id: string): Promise<void> {
    try {
      const result = await this.userRepository.deleteUser(id);

      if (result.affected === 0) {
        throw new NotFoundException(`User with id: ${id} not found`);
      }
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  handleDBExceptions(error: unknown): never {
    const err = error as DBError;

    if (err.code === PostgresErrorCode.UNIQUE_VIOLATION)
      throw new ConflictException(
        `Duplicate entry in table ${err.table}: ${err.detail}`,
      );

    if (err.code === PostgresErrorCode.FOREIGN_KEY_VIOLATION)
      throw new ConflictException(
        `Cannot create/update record: the related entity in table ${err.table} does not exist`,
      );

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }
}
