import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { MedicalLeaveController } from './medical-leave.controller';
import { MedicalLeaveService } from './medical-leave.service';
import MedicalLeaveFacade from '@/modules/medical-leave/facade/medical-leave.facade';
import MedicalLeaveFacadeFactory from '@/modules/medical-leave/factory/facade.factory';

@Module({
  imports: [AuthModule],
  controllers: [MedicalLeaveController],
  providers: [
    MedicalLeaveService,
    {
      provide: MedicalLeaveFacade,
      useFactory: () => MedicalLeaveFacadeFactory.create(),
    },
  ],
  exports: [MedicalLeaveService, MedicalLeaveFacade],
})
export class MedicalLeaveModule {}
