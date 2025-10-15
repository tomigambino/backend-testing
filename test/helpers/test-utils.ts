// test/helpers/test-utils.ts
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testDbConfig } from './test-db.config';

export async function createTestingModule(
  imports: any[],
  providers: any[] = [],
  controllers: any[] = [],
): Promise<INestApplication> {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [TypeOrmModule.forRoot(testDbConfig), ...imports],
    providers,
    controllers,
  }).compile();

  const app = moduleFixture.createNestApplication();

  // Aplicamos los mismos pipes que en la app real
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  await app.init();
  return app;
}

export async function closeTestingApp(app: INestApplication): Promise<void> {
  await app.close();
}