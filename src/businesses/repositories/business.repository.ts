import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Business } from '../entities/business.entity';
import { DeleteResult, Repository } from 'typeorm';
import { validate as uuidValidate } from 'uuid';

@Injectable()
export class BusinessRepository {
  constructor(
    @InjectRepository(Business)
    private readonly businessRepository: Repository<Business>,
  ) {}

  async createBusiness(data: Partial<Business>): Promise<Business> {
    const business = this.businessRepository.create(data);
    return this.businessRepository.save(business);
  }

  async findBusinesses(
    skip: number,
    take: number,
  ): Promise<[Business[], number]> {
    return this.businessRepository.findAndCount({
      skip,
      take,
      relations: { owner: true },
      where: { isActive: true },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findBusiness(term: string): Promise<Business | null> {
    let business: Business | null;

    if (uuidValidate(term)) {
      business = await this.businessRepository.findOne({
        where: { id: term, isActive: true },
        relations: { owner: true },
      });
    } else {
      const queryBuilder =
        this.businessRepository.createQueryBuilder('business');
      business = await queryBuilder
        .leftJoinAndSelect('business.owner', 'owner')
        .where('business.slug ILIKE :slug', { slug: term })
        .andWhere('business.isActive = :isActive', { isActive: true })
        .getOne();
    }
    return business;
  }

  async updateBusiness(id: string, data: Partial<Business>): Promise<Business> {
    const business = await this.businessRepository.preload({ id, ...data });
    if (!business) {
      throw new NotFoundException('Business not found');
    }
    return this.businessRepository.save(business);
  }

  async deleteBusiness(id: string): Promise<DeleteResult> {
    const result = await this.businessRepository.softDelete(id)

    if (result.affected === 0) {
      throw new NotFoundException(`Business not found`)
    }
    return result
  }
}
