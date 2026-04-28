import { Length } from 'class-validator';
import { Notification } from '@/modules/@shared/domain/entity/validators/notification';
import { ClassValidatorFields } from '@/modules/@shared/domain/entity/validators/class-validator-fields';
import { Announcement } from '../announcement.entity';

export class AnnouncementRules {
  @Length(3, 200, {
    message: 'O título deve ter entre 3 e 200 caracteres',
    groups: ['create', 'update'],
  })
  title: string;

  @Length(1, 10000, {
    message: 'O conteúdo não pode ser vazio nem exceder 10.000 caracteres',
    groups: ['create', 'update'],
  })
  content: string;

  constructor(data: Announcement) {
    this.title = data.title;
    this.content = data.content;
  }
}

export class AnnouncementValidator extends ClassValidatorFields {
  validate(
    notification: Notification,
    data: Announcement,
    fields: string[],
  ): boolean {
    const rules = new AnnouncementRules(data);
    const newFields = fields?.length ? fields : ['create'];
    return super.validate(notification, rules, newFields);
  }
}

export default class AnnouncementValidatorFactory {
  static create(): AnnouncementValidator {
    return new AnnouncementValidator();
  }
}
