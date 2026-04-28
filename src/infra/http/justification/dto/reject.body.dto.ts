import { Length } from 'class-validator';

export class RejectJustificationBodyDto {
  @Length(3, 500, {
    message: 'A nota de rejeição deve ter entre 3 e 500 caracteres',
  })
  reviewNote: string;
}
