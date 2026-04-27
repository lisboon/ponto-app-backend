import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  MinLength,
  validateSync,
} from 'class-validator';

export enum NodeEnv {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvSchema {
  @IsEnum(NodeEnv)
  @IsOptional()
  NODE_ENV: NodeEnv = NodeEnv.Development;

  @IsNumberString()
  @IsOptional()
  PORT: string = '3001';

  @IsString()
  @MinLength(1)
  DATABASE_URL: string;

  @IsString()
  @MinLength(16, {
    message: 'JWT_SECRET must be at least 16 characters long',
  })
  JWT_SECRET: string;

  @IsString()
  @IsOptional()
  JWT_EXPIRES_IN: string = '7d';

  @IsString()
  @IsOptional()
  CORS_ORIGINS: string = 'http://localhost:3000';

  @IsNumberString()
  @IsOptional()
  BCRYPT_SALT_ROUNDS: string = '10';

  @IsString()
  @IsOptional()
  TZ: string = 'America/Cuiaba';

  @IsString()
  @IsOptional()
  STUDIO_IP_RANGES?: string;

  @IsString()
  @IsOptional()
  SMTP_HOST?: string;

  @IsNumberString()
  @IsOptional()
  SMTP_PORT?: string;

  @IsString()
  @IsOptional()
  SMTP_USER?: string;

  @IsString()
  @IsOptional()
  SMTP_PASSWORD?: string;

  @IsString()
  @IsOptional()
  SMTP_FROM?: string;

  @IsString()
  @IsOptional()
  AVATAR_UPLOAD_DIR: string = 'uploads/avatars';
}

export function validateEnv(config: Record<string, unknown>): EnvSchema {
  const validated = plainToInstance(EnvSchema, config, {
    enableImplicitConversion: false,
  });

  const errors = validateSync(validated, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const messages = errors
      .flatMap((e) => Object.values(e.constraints ?? {}))
      .join('; ');
    throw new Error(`Invalid environment variables: ${messages}`);
  }

  return validated;
}
