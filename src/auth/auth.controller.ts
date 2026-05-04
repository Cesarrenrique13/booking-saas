import { Controller, Post, Body, Get, UseGuards,Headers, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '@/users/dto/create-user.dto';
import { User } from '@/users/entities/user.entity';
import { LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { RawHeaders } from '@/common/decorators/raw-headers.decorator';
import type { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './enums/valid_roles.interface';
import { Auth } from './decorators/auth.decorator';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("register")
  register(@Body() createAuthDto: CreateUserDto) {
    return this.authService.create(createAuthDto);
  }

  @Post("login")
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get("private")
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') userEmail: string,
    @
    RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders = {},
  ) {
    return {
      ok: true,
      message: "Hello private world",
      user,
      userEmail,
      rawHeaders,
      headers
    }
  }

  @Get("private2")
  @RoleProtected(ValidRoles.super_user, ValidRoles.admin, ValidRoles.user)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(
    @GetUser() user:User
  ) {
    return {
      ok:true,
      user
    }
  }

  @Get("private3")
  @Auth(ValidRoles.admin, ValidRoles.super_user)
  privateRoute3(
    @GetUser() user:User
  ) {
    return {
      ok:true,
      user
    }
  }
}
