import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import { SeedService } from './seed.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const seedService = app.get(SeedService);

  console.log('SEED START');
  await seedService.runSeed();
  console.log('SEED DONE');

  await app.close();
}

void bootstrap();
