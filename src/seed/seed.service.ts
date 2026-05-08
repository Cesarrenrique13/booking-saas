import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async runSeed() {
    await this.usersRepository.query(
      `TRUNCATE TABLE "${this.usersRepository.metadata.tableName}" RESTART IDENTITY CASCADE `,
    );
    await this.insertUsers();
  }

  private async insertUsers() {
    const passwordCrypt = bcrypt.hashSync('1234567', 10);

    const users = Array.from({ length: 300 }).map(() => {
      const fullName = faker.person.fullName();

      const email =
        fullName
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z ]/g, '')
          .trim()
          .replace(/\s+/g, '.') +
        faker.number.int({ min: 10000, max: 90000 }) +
        '@gmail.com';

      return {
        name: fullName,
        email,
        phone: '04' + faker.string.numeric(8),
        password: passwordCrypt,
      };
    });

    const adminUser = {
      name: 'Administrador',
      email: 'admin@booking.com',
      phone: '04' + faker.string.numeric(8),
      password: passwordCrypt,
    };

    const entities = [adminUser, ...users];

    await this.usersRepository.insert(entities);
  }
}
