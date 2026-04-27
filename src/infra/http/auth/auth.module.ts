import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { StringValue } from 'ms';
import { AuthGuard } from './auth-guard';
import { RolesGuard } from './roles-guard';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: (() => {
        if (!process.env.JWT_SECRET) {
          throw new Error(
            'A variável de ambiente JWT_SECRET não está definida.',
          );
        }
        return process.env.JWT_SECRET;
      })(),
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN ?? '7d') as StringValue,
      },
    }),
  ],
  providers: [AuthGuard, RolesGuard],
  exports: [AuthGuard, RolesGuard],
})
export class AuthModule {}
