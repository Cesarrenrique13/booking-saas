import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { Auth, GetUser } from '@/auth/decorators';
import { User } from '@/users/entities/user.entity';
import { PaginationDto } from '@/common/pagination/pagination.dto';
import { Service } from './entities/service.entity';
import { PaginationInterface } from '@/common/pagination/pagination.interface';

@ApiTags('Services')
@ApiBearerAuth()
@Controller('services')
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @Auth()
  create(
    @Body() createServiceDto: CreateServiceDto,
    @GetUser() user: User,
  ): Promise<Service> {
    return this.servicesService.create(createServiceDto, user);
  }

  @Get()
  findAll(
    @Query() pagination: PaginationDto,
  ): Promise<PaginationInterface<Service>> {
    return this.servicesService.findAll(pagination);
  }

  @Get(':term')
  findOne(@Param('term') term: string): Promise<Service> {
    return this.servicesService.findOne(term);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @GetUser() user: User,
  ): Promise<Service> {
    return this.servicesService.update(id, updateServiceDto, user);
  }

  @Delete(':id')
  @Auth()
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ): Promise<{ message: string }> {
    await this.servicesService.delete(id, user);
    return { message: 'Service deleted successfully' };
  }
}
