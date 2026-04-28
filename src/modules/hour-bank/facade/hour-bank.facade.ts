import { FindByUserUseCaseInterface } from '../usecase/find-by-user/find-by-user.usecase.dto';
import { RecalculateByUserUseCaseInterface } from '../usecase/recalculate-by-user/recalculate-by-user.usecase.dto';
import {
  FindByUserHourBankFacadeInputDto,
  FindByUserHourBankFacadeOutputDto,
  HourBankFacadeInterface,
  RecalculateHourBankFacadeInputDto,
  RecalculateHourBankFacadeOutputDto,
} from './hour-bank.facade.dto';

export default class HourBankFacade implements HourBankFacadeInterface {
  constructor(
    private readonly findByUserUseCase: FindByUserUseCaseInterface,
    private readonly recalculateUseCase: RecalculateByUserUseCaseInterface,
  ) {}

  findByUser(
    data: FindByUserHourBankFacadeInputDto,
  ): Promise<FindByUserHourBankFacadeOutputDto> {
    return this.findByUserUseCase.execute(data);
  }

  recalculate(
    data: RecalculateHourBankFacadeInputDto,
  ): Promise<RecalculateHourBankFacadeOutputDto> {
    return this.recalculateUseCase.execute(data);
  }
}
