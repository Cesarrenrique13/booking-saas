import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from '../entities/user.entity';
import { DeleteResult, Repository } from 'typeorm';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

  async createUser(data: Partial<User>): Promise<User> {
    const user = this.userRepository.create(data);
    return this.userRepository.save(user);
  }

  async findUsers(limit: number, offset: number): Promise<[User[], number]> {
    return this.userRepository.findAndCount({
      take: limit,
      skip: offset,
    });
  }

  async findUser(term: string): Promise<User | null> {
    let user: User | null;

    if (uuidValidate(term)) {
      user = await this.userRepository.findOneBy({
        id: term,
      });
    } else {
      const queryBulder = this.userRepository.createQueryBuilder('user');
      user = await queryBulder
        .where('user.email ILIKE :email OR user.phone = :phone', {
          email: term,
          phone: term,
        })
        .getOne();
    }
    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    const user = await this.userRepository.preload({
      id,
      ...data,
    });
    if (!user) throw new NotFoundException('User not found');;

    return this.userRepository.save(user);
  }

  async deleteUser(id: string): Promise<DeleteResult> {
    return this.userRepository.softDelete(id);
  }
}
