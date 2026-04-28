import BaseEntity from '@/modules/@shared/domain/entity/base.entity';
import { EntityValidationError } from '@/modules/@shared/domain/errors/validation.error';
import HourBankValidatorFactory from './validators/hour-bank.validator';

export interface HourBankProps {
  id?: string;
  userId: string;
  balanceMinutes?: number;
  lastRecalculatedAt?: Date;
  updatedAt?: Date;
}

export class HourBank extends BaseEntity {
  private _userId: string;
  private _balanceMinutes: number;
  private _lastRecalculatedAt?: Date;

  constructor(props: HourBankProps) {
    super(props.id, undefined, props.updatedAt, true, undefined);
    this._userId = props.userId;
    this._balanceMinutes = props.balanceMinutes ?? 0;
    this._lastRecalculatedAt = props.lastRecalculatedAt;
    this.validate();
  }

  static create(userId: string): HourBank {
    return new HourBank({ userId, balanceMinutes: 0 });
  }

  private validate(fields?: string[]): void {
    const factory = HourBankValidatorFactory.create();
    factory.validate(this._notification, this, fields ?? ['create']);
    if (this._notification.hasErrors()) {
      throw new EntityValidationError(this._notification.toJSON());
    }
  }

  get userId(): string {
    return this._userId;
  }

  get balanceMinutes(): number {
    return this._balanceMinutes;
  }

  get lastRecalculatedAt(): Date | undefined {
    return this._lastRecalculatedAt;
  }

  applyDelta(delta: number): void {
    this._balanceMinutes += delta;
    this.update();
  }

  setBalance(totalMinutes: number): void {
    this._balanceMinutes = totalMinutes;
    this._lastRecalculatedAt = new Date();
    this.update();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      userId: this._userId,
      balanceMinutes: this._balanceMinutes,
      lastRecalculatedAt: this._lastRecalculatedAt,
    };
  }
}
