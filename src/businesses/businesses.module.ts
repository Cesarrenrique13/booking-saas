import { Module } from '@nestjs/common';
import { BusinessesService } from './businesses.service';
import { BusinessesController } from './businesses.controller';
import { BusinessRepository } from './repositories/business.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Business } from './entities/business.entity';
import { AuthModule } from '@/auth/auth.module';

@Module({
  controllers: [BusinessesController],
  providers: [BusinessesService, BusinessRepository],
  imports: [TypeOrmModule.forFeature([Business]), AuthModule],
  exports: [BusinessesService],
})
export class BusinessesModule {}
