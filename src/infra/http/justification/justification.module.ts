import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { JustificationController } from './justification.controller';
import { JustificationService } from './justification.service';
import JustificationFacade from '@/modules/justification/facade/justification.facade';
import JustificationFacadeFactory from '@/modules/justification/factory/facade.factory';

@Module({
  imports: [AuthModule],
  controllers: [JustificationController],
  providers: [
    JustificationService,
    {
      provide: JustificationFacade,
      useFactory: () => JustificationFacadeFactory.create(),
    },
  ],
  exports: [JustificationService, JustificationFacade],
})
export class JustificationModule {}
