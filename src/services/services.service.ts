import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Logger,
  InternalServerErrorException,
  ConflictException,
} from '@nestjs/common';
// Importa tus DTOs, Entities, Repository y DBError helper
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { ServiceRepository } from './repositories/services.repository';
import { BusinessesService } from '@/businesses/businesses.service';
import { Service } from './entities/service.entity';
import { User } from '@/users/entities/user.entity';
import { PaginationDto } from '@/common/pagination/pagination.dto';
import { PaginationInterface } from '@/common/pagination/pagination.interface';
import { DBError, PostgresErrorCode } from '@/common/db/db-error.types';

@Injectable()
export class ServicesService {
  private readonly logger = new Logger('ServicesService');

  constructor(
    private readonly serviceRepository: ServiceRepository,
    private readonly businessesService: BusinessesService,
  ) {}

  async create(
    businessId: string,
    data: CreateServiceDto,
    user: User,
  ): Promise<Service> {
    const business = await this.businessesService.findOne(businessId);

    if (business.userId !== user.id) {
      throw new ForbiddenException('You do not own this business');
    }

    const serviceData = { ...data, businessId };

    try {
      return await this.serviceRepository.createService(serviceData);
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async findAll(
    pagination: PaginationDto,
  ): Promise<PaginationInterface<Service>> {
    const { limit = 10, page = 1 } = pagination;
    const skip = (page - 1) * limit;
    const [data, total] = await this.serviceRepository.findServices(
      skip,
      limit,
    );
    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(term: string): Promise<Service> {
    const service = await this.serviceRepository.findService(term);

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return service;
  }

  async update(
    id: string,
    updateServiceDto: UpdateServiceDto,
    user: User,
  ): Promise<Service> {
    const service = await this.findOne(id);

    if (service.business.userId !== user.id) {
      throw new ForbiddenException('You do not own this business');
    }

    try {
      return this.serviceRepository.updateService(id, updateServiceDto);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.handleDBExceptions(error);
    }
  }

  async delete(id: string, user: User): Promise<void> {
    const service = await this.findOne(id);

    if (service.business.userId !== user.id) {
      throw new ForbiddenException('You do not own this business');
    }

    try {
      await this.serviceRepository.deleteService(id);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.handleDBExceptions(error);
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
