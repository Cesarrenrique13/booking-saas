import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateBusinessDto } from './dto/create-business.dto';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { BusinessRepository } from './repositories/business.repository';
import { DBError, PostgresErrorCode } from '@/common/db/db-error.types';
import { User } from '@/users/entities/user.entity';
import { Business } from './entities/business.entity';
import { PaginationDto } from '@/common/pagination/pagination.dto';
import { PaginationInterface } from '@/common/pagination/pagination.interface';

@Injectable()
export class BusinessesService {
  private readonly logger = new Logger('BusinessService');

  constructor(private readonly businessRepo: BusinessRepository) {}

  async create(data: CreateBusinessDto, user: User): Promise<Business> {
    try {
      return await this.businessRepo.createBusiness({
        ...data,
        userId: user.id,
      });
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(
    pagination: PaginationDto,
  ): Promise<PaginationInterface<Business>> {
    const { limit = 10, page = 1 } = pagination;
    const skip = (page - 1) * limit;
    const [data, total] = await this.businessRepo.findBusinesses(skip, limit);
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(term: string): Promise<Business> {
    const business = await this.businessRepo.findBusiness(term);

    if (!business) {
      throw new NotFoundException(`Business with term: ${term} not found`);
    }
    return business;
  }

  async update(
    id: string,
    data: UpdateBusinessDto,
    user: User,
  ): Promise<Business> {
    const business = await this.findOne(id);

    if (business.owner.id !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to update this business',
      );
    }

    try {
      return await this.businessRepo.updateBusiness(id, data);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string, user: User): Promise<void> {
    const business = await this.findOne(id);

    if (business.owner.id !== user.id) {
      throw new ForbiddenException(
        'You do not have permission to delete this business',
      );
    }

    try {
      await this.businessRepo.deleteBusiness(id);
    } catch (err) {
      if (err instanceof NotFoundException) throw err;
      this.handleDBExceptions(err);
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
