import BaseEntity from '@/modules/@shared/domain/entity/base.entity';
import { EntityValidationError } from '@/modules/@shared/domain/errors/validation.error';
import { HolidayType } from '@/modules/@shared/domain/enums';
import HolidayValidatorFactory from './validators/holiday.validator';

export interface HolidayProps {
  id?: string;
  name: string;
  date: Date;
  type: HolidayType;
  description?: string;
  isRecurring?: boolean;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class Holiday extends BaseEntity {
  private _name: string;
  private _date: Date;
  private _type: HolidayType;
  private _description?: string;
  private _isRecurring: boolean;

  constructor(props: HolidayProps) {
    super(
      props.id,
      props.createdAt,
      props.updatedAt,
      props.active,
      props.deletedAt,
    );
    this._name = props.name;
    this._date = props.date;
    this._type = props.type;
    this._description = props.description;
    this._isRecurring = props.isRecurring ?? false;
  }

  get name(): string {
    return this._name;
  }

  get date(): Date {
    return this._date;
  }

  get type(): HolidayType {
    return this._type;
  }

  get description(): string | undefined {
    return this._description;
  }

  get isRecurring(): boolean {
    return this._isRecurring;
  }

  updateHoliday(
    props: Partial<
      Pick<
        HolidayProps,
        'name' | 'date' | 'type' | 'description' | 'isRecurring'
      >
    >,
  ) {
    if (props.name !== undefined) this._name = props.name;
    if (props.date !== undefined) this._date = props.date;
    if (props.type !== undefined) this._type = props.type;
    if (props.description !== undefined) this._description = props.description;
    if (props.isRecurring !== undefined) this._isRecurring = props.isRecurring;

    this.update();
    this.validate(['update']);

    if (this.notification.hasErrors()) {
      throw new EntityValidationError(this.notification.toJSON());
    }
  }

  validate(fields?: string[]): void {
    const validator = HolidayValidatorFactory.create();
    validator.validate(this._notification, this, fields ?? ['create']);
  }

  static create(props: HolidayProps): Holiday {
    const holiday = new Holiday(props);
    holiday.validate();

    if (holiday.notification.hasErrors()) {
      throw new EntityValidationError(holiday.notification.toJSON());
    }

    return holiday;
  }

  toJSON() {
    return {
      id: this._id,
      name: this._name,
      date: this._date,
      type: this._type,
      description: this._description,
      isRecurring: this._isRecurring,
      active: this._active,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
    };
  }
}
