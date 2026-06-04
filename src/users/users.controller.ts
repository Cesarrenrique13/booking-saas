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
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiOperation({ summary: 'Get all users (paginated)' })
  @ApiResponse({ status: 200, description: 'Returns paginated users' })
  findAll(
    @Query() pagination: PaginationDto,
  ): Promise<PaginationInterface<User>> {
    return this.usersService.findAll(pagination);
  }

  @Get(':term')
  @ApiOperation({ summary: 'Get a user by ID or email' })
  @ApiResponse({ status: 200, description: 'Returns user' })
  findOne(@Param('term') term: string): Promise<User> {
    return this.usersService.findOne(term);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.update(id, data);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  async delete(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<{ message: string }> {
    await this.usersService.delete(id);
    return { message: 'User deleted successfully' };
  }
}
