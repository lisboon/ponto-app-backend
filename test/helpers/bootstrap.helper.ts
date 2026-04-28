import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import helmet from 'helmet';
import { AppModule } from '@/infra/http/app.module';
import { EntityValidationErrorFilter } from '@/infra/http/shared/errors/entity-validation.filter';
import { NotFoundErrorFilter } from '@/infra/http/shared/errors/not-found.filter';
import { UnauthorizedErrorFilter } from '@/infra/http/shared/errors/unauthorized.filter';
import { ForbiddenErrorFilter } from '@/infra/http/shared/errors/forbidden.filter';
import { BadLoginErrorFilter } from '@/infra/http/shared/errors/bad-login.filter';
import { TokenExpiredErrorFilter } from '@/infra/http/shared/errors/token-expired.filter';
import exceptionFactory from '@/infra/http/shared/errors/exception-factory';
import { UserRole } from '@/modules/@shared/domain/enums';

process.env.JWT_SECRET = 'test-secret-at-least-16-chars';
process.env.DATABASE_URL = 'postgresql://x:x@localhost:5432/x';

export async function createTestApp(
  override?: (builder: TestingModuleBuilder) => TestingModuleBuilder,
): Promise<INestApplication> {
  let builder = Test.createTestingModule({ imports: [AppModule] });
  if (override) builder = override(builder);

  const moduleFixture = await builder.compile();
  const app = moduleFixture.createNestApplication();

  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      exceptionFactory,
      errorHttpStatusCode: 422,
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );
  app.useGlobalFilters(
    new EntityValidationErrorFilter(),
    new NotFoundErrorFilter(),
    new UnauthorizedErrorFilter(),
    new ForbiddenErrorFilter(),
    new BadLoginErrorFilter(),
    new TokenExpiredErrorFilter(),
  );

  await app.init();
  return app;
}

export function makeToken(
  app: INestApplication,
  role: UserRole = UserRole.EMPLOYEE,
): string {
  const jwt = app.get(JwtService);
  return jwt.sign(
    { userId: '00000000-0000-4000-8000-000000000001', role },
    { secret: process.env.JWT_SECRET, expiresIn: '1h' },
  );
}
