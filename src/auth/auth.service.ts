import { Injectable, UnauthorizedException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { UsersService } from '@/users/users.service';
import { User } from '@/users/entities/user.entity';
import { LoginUserDto, RegisterUserDto } from './dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { AuthResponse } from './interfaces/auth-response.interfaces';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(User)
    private readonly authRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async create(createAuthDto: RegisterUserDto): Promise<AuthResponse> {
    const { password, ...userData } = createAuthDto;

    const user = await this.usersService.create({
      ...userData,
      password: bcrypt.hashSync(password, 10),
    });

    return {
      user,
      token: this.getJwtToken({ sub: user.id }),
    };
  }

  async login(loginUserDto: LoginUserDto): Promise<AuthResponse> {
    const { password, email } = loginUserDto;

    const user = await this.authRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true },
    });
    if (!user) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    if (!bcrypt.compareSync(password, user.password)) {
      throw new UnauthorizedException('Credentials are not valid');
    }

    return {
      user,
      token: this.getJwtToken({ sub: user.id }),
    };
  }

  checkAuthStatus(user: User): AuthResponse {
    return {
      user,
      token: this.getJwtToken({ sub: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
