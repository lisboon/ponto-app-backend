import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateDraftBodyDto {
  @ApiProperty({ example: 'Reunião geral' })
  @IsString()
  @Length(3, 200)
  title: string;

  @ApiProperty({ example: 'Haverá uma reunião na sexta às 15h.' })
  @IsString()
  @Length(1, 10000)
  content: string;
}
