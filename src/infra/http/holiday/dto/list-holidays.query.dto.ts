import { Transform } from 'class-transformer';
import { IsInt, Max, Min } from 'class-validator';

export class ListHolidaysQueryDto {
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt({ message: 'Ano inválido' })
  @Min(1900, { message: 'Ano deve ser >= 1900' })
  @Max(2100, { message: 'Ano deve ser <= 2100' })
  year: number;
}
