import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { User } from './entities/user.entity';
import { PaginationInterface } from 'src/common/pagination/pagination.interface';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
  ): Promise<PaginationInterface<User>> {
    return this.usersService.findAll(pagination);
  }

  @Get(':term')
  findOne(@Param('term') term: string): Promise<User> {
    return this.usersService.findOne(term);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.usersService.delete(id);
    return { message: 'User deleted successfully' };
  }
}
