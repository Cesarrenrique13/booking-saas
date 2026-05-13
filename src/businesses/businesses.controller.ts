import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { Auth, GetUser } from '@/auth/decorators';
import { User } from '@/users/entities/user.entity';
import { PaginationDto } from '@/common/pagination/pagination.dto';
import { Business } from './entities/business.entity';
import { PaginationInterface } from '@/common/pagination/pagination.interface';

@Controller('businesses')
export class BusinessesController {
  constructor(private readonly businessesService: BusinessesService) {}

  @Post()
  @Auth()
  async create(@Body() createBusinessDto: CreateBusinessDto,
  @GetUser() user:User
):Promise<Business> {
    return this.businessesService.create(createBusinessDto, user);
  }

  @Get()
  findAll(@Query() pagination:PaginationDto):Promise<PaginationInterface<Business>> {
    return this.businessesService.findAll(pagination);
  }

  @Get(':term')
  findOne(@Param('term') term: string) {
    return this.businessesService.findOne(term);
  }

  @Patch(':id')
  @Auth()
  update(
    @Param('id') id: string,
    @Body() updateBusinessDto: UpdateBusinessDto,
  ):Promise<Business> {
    return this.businessesService.update(id, updateBusinessDto);
  }

  @Delete(':id')
  @Auth()
  async remove(@Param('id') id: string):Promise<{Message:string}> {
    await this.businessesService.remove(id);
    return {Message: 'Business deleted sucessfully'}
  }
}
