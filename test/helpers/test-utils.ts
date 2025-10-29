// test/helpers/test-utils.ts
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { testDbConfig } from './test-db.config';

export async function createTestingModule(
  imports: any[],
  providers: any[] = [],
  controllers: any[] = [],
  overrides?: { guard?: any; guardMock?: any }, // AGREGAR ESTE PARÁMETRO
): Promise<INestApplication> {
  let testModuleBuilder = Test.createTestingModule({
    imports: [TypeOrmModule.forRoot(testDbConfig), ...imports],
    providers,
    controllers,
  });

  // Si se proporciona un guard para mockear, lo reemplazamos
  if (overrides?.guard && overrides?.guardMock) {
    testModuleBuilder = testModuleBuilder
      .overrideGuard(overrides.guard)
      .useValue(overrides.guardMock);
  }

  const moduleFixture: TestingModule = await testModuleBuilder.compile();

  const app = moduleFixture.createNestApplication();

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