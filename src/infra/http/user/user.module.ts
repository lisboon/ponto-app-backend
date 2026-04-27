import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AuthController, UserController } from './user.controller';
import { UserService } from './user.service';
import UserFacade from '@/modules/user/facade/user.facade';
import UserFacadeFactory from '@/modules/user/factory/facade.factory';

@Module({
  imports: [AuthModule],
  controllers: [AuthController, UserController],
  providers: [
    UserService,
    {
      provide: UserFacade,
      useFactory: () => UserFacadeFactory.create(),
    },
  ],
  exports: [UserService, UserFacade],
})
export class UserModule {}
