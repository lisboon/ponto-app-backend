import { IsOptional, IsUUID, ValidateIf } from 'class-validator';

export class AssignWorkScheduleBodyDto {
  @ValidateIf((o) => o.workScheduleId !== null)
  @IsUUID('4', { message: 'workScheduleId inválido' })
  @IsOptional()
  workScheduleId?: string | null;
}
