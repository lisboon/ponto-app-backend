import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';

export class ListByUserMedicalLeaveQueryDto {
  @Transform(({ value }) =>
    value === 'true' ? true : value === 'false' ? false : value,
  )
  @IsBoolean({ message: 'activeOnly inválido' })
  @IsOptional()
  activeOnly?: boolean;
}
