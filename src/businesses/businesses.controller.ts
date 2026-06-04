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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Auth, GetUser } from '@/auth/decorators';
import { User } from '@/users/entities/user.entity';
import { PaginationDto } from '@/common/pagination/pagination.dto';
import { Business } from './entities/business.entity';
import { PaginationInterface } from '@/common/pagination/pagination.interface';

@ApiTags('Businesses')
@ApiBearerAuth()
@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  @Auth()
  @ApiOperation({ summary: 'Create a new business' })
  @ApiResponse({ status: 201, description: 'Business created successfully' })
  async create(
    @Body() createBusinessDto: CreateBusinessDto,
    @GetUser() user: User,
  ): Promise<Business> {
    return this.businessesService.create(createBusinessDto, user);
  }

  @Get()
  @ApiOperation({ summary: 'Get all businesses (paginated)' })
  @ApiResponse({ status: 200, description: 'Returns paginated businesses' })
  findAll(
    @Query() pagination: PaginationDto,
  ): Promise<PaginationInterface<Business>> {
    return this.businessesService.findAll(pagination);
  }

  @Get(':term')
  @ApiOperation({ summary: 'Get a business by ID or slug' })
  @ApiResponse({ status: 200, description: 'Returns business' })
  findOne(@Param('term') term: string) {
    return this.businessesService.findOne(term);
  }

  @Patch(':id')
  @Auth()
  @ApiOperation({ summary: 'Update a business' })
  @ApiResponse({ status: 200, description: 'Business updated successfully' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
    @GetUser() user: User,
  ): Promise<Business> {
    return this.businessesService.update(id, updateBusinessDto, user);
  }

  @Delete(':id')
  @Auth()
  @ApiOperation({ summary: 'Delete a business' })
  @ApiResponse({ status: 200, description: 'Business deleted successfully' })
  async remove(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User,
  ): Promise<{ Message: string }> {
    await this.businessesService.remove(id, user);
    return { Message: 'Business deleted successfully' };
  }
}
