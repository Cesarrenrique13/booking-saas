import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Service } from '../entities/service.entity';
import { Repository, DeleteResult } from 'typeorm';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class ServiceRepository {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepo: Repository<Service>,
  ) {}

  async createService(data: Partial<Service>): Promise<Service> {
    const service = this.serviceRepo.create(data);
    return this.serviceRepo.save(service);
  }

  async findServices(skip: number, take: number): Promise<[Service[], number]> {
    return this.serviceRepo.findAndCount({
      skip,
      take,
      relations: { business: true },
      where: { isActive: true },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findService(term: string): Promise<Service | null> {
    if (uuidValidate(term)) {
      return this.serviceRepo.findOne({
        where: { id: term, isActive: true },
        relations: { business: true },
      });
    }
    const queryBuilder = this.serviceRepo.createQueryBuilder('service');
    return await queryBuilder
      .leftJoinAndSelect('service.business', 'business')
      .where('service.name ILIKE :name', { name: `%${term}%` })
      .andWhere('service.isActive  = :isActive', { isActive: true })
      .getOne();
  }

  async updateService(id: string, data: Partial<Service>): Promise<Service> {
    const service = await this.serviceRepo.preload({
      id,
      ...data,
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return await this.serviceRepo.save(service);
  }

  async deleteService(id: string): Promise<DeleteResult> {
    const result = await this.serviceRepo.softDelete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Service with ID ${id} not found`);
    }

    return result;
  }
}
