import { validateSync, ValidationError } from 'class-validator';
import { IValidatorFields } from './validator-fields-interface';
import { Notification } from './notification';

export abstract class ClassValidatorFields implements IValidatorFields {
  validate(
    notification: Notification,
    entityData: unknown,
    validationGroups: string[],
  ): boolean {
    const errors = validateSync(entityData as object, {
      groups: validationGroups,
    });

    if (errors.length) {
      for (const error of errors) {
        this.collectErrors(error, error.property, notification);
      }
    }

    return !errors.length;
  }

  private collectErrors(
    error: ValidationError,
    fieldPath: string,
    notification: Notification,
  ): void {
    if (error.constraints) {
      for (const message of Object.values(error.constraints)) {
        notification.addError(message, fieldPath);
      }
    }
    if (error.children?.length) {
      for (const child of error.children) {
        const childPath = `${fieldPath}.${child.property}`;
        this.collectErrors(child, childPath, notification);
      }
    }
  }
}
