import BaseEntity from '@/modules/@shared/domain/entity/base.entity';
import { EntityValidationError } from '@/modules/@shared/domain/errors/validation.error';
import { normalizeEmail } from '@/modules/@shared/domain/utils/email';
import { ContractType, UserRole } from '@/modules/@shared/domain/enums';
import UserValidatorFactory from './validators/user.validator';

export interface UserProps {
  id?: string;
  email: string;
  name: string;
  password: string;
  avatarUrl?: string;
  role?: UserRole;
  position?: string;
  contractType?: ContractType;
  weeklyMinutes?: number;
  hourlyRate?: number;
  workScheduleId?: string;
  hireDate?: Date;
  active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}

export class User extends BaseEntity {
  private _email: string;
  private _name: string;
  private _password: string;
  private _avatarUrl?: string;
  private _role: UserRole;
  private _position?: string;
  private _contractType?: ContractType;
  private _weeklyMinutes?: number;
  private _hourlyRate?: number;
  private _workScheduleId?: string;
  private _hireDate?: Date;

  constructor(props: UserProps) {
    super(
      props.id,
      props.createdAt,
      props.updatedAt,
      props.active,
      props.deletedAt,
    );
    this._email = normalizeEmail(props.email);
    this._name = props.name;
    this._password = props.password;
    this._avatarUrl = props.avatarUrl;
    this._role = props.role ?? UserRole.EMPLOYEE;
    this._position = props.position;
    this._contractType = props.contractType;
    this._weeklyMinutes = props.weeklyMinutes;
    this._hourlyRate = props.hourlyRate;
    this._workScheduleId = props.workScheduleId;
    this._hireDate = props.hireDate;
  }

  get email(): string {
    return this._email;
  }

  get name(): string {
    return this._name;
  }

  get password(): string {
    return this._password;
  }

  get avatarUrl(): string | undefined {
    return this._avatarUrl;
  }

  get role(): UserRole {
    return this._role;
  }

  get position(): string | undefined {
    return this._position;
  }

  get contractType(): ContractType | undefined {
    return this._contractType;
  }

  get weeklyMinutes(): number | undefined {
    return this._weeklyMinutes;
  }

  get hourlyRate(): number | undefined {
    return this._hourlyRate;
  }

  get workScheduleId(): string | undefined {
    return this._workScheduleId;
  }

  get hireDate(): Date | undefined {
    return this._hireDate;
  }

  changeName(name: string) {
    this._name = name;
  }

  changeEmail(email: string) {
    this._email = normalizeEmail(email);
  }

  changePassword(hashedPassword: string) {
    this._password = hashedPassword;
    this.update();
  }

  changeAvatar(avatarUrl: string | undefined) {
    this._avatarUrl = avatarUrl;
    this.update();
  }

  changeRole(role: UserRole) {
    this._role = role;
    this.update();
    this.validate(['role']);
    if (this.notification.hasErrors()) {
      throw new EntityValidationError(this.notification.toJSON());
    }
  }

  assignWorkSchedule(workScheduleId: string) {
    this._workScheduleId = workScheduleId;
    this.update();
  }

  unassignWorkSchedule() {
    this._workScheduleId = undefined;
    this.update();
  }

  updateProfile(
    props: Partial<
      Pick<
        UserProps,
        | 'name'
        | 'email'
        | 'avatarUrl'
        | 'position'
        | 'contractType'
        | 'weeklyMinutes'
        | 'hourlyRate'
        | 'hireDate'
      >
    >,
  ) {
    if (props.name !== undefined) this._name = props.name;
    if (props.email !== undefined) this._email = normalizeEmail(props.email);
    if (props.avatarUrl !== undefined) this._avatarUrl = props.avatarUrl;
    if (props.position !== undefined) this._position = props.position;
    if (props.contractType !== undefined)
      this._contractType = props.contractType;
    if (props.weeklyMinutes !== undefined)
      this._weeklyMinutes = props.weeklyMinutes;
    if (props.hourlyRate !== undefined) this._hourlyRate = props.hourlyRate;
    if (props.hireDate !== undefined) this._hireDate = props.hireDate;

    this.update();
    this.validate(['update']);

    if (this.notification.hasErrors()) {
      throw new EntityValidationError(this.notification.toJSON());
    }
  }

  validate(fields?: string[]): void {
    const validator = UserValidatorFactory.create();
    validator.validate(this._notification, this, fields ?? ['create']);
  }

  static create(props: UserProps): User {
    const user = new User(props);
    user.validate();

    if (user.notification.hasErrors()) {
      throw new EntityValidationError(user.notification.toJSON());
    }

    return user;
  }

  toJSON() {
    return {
      id: this._id,
      email: this._email,
      name: this._name,
      avatarUrl: this._avatarUrl,
      role: this._role,
      position: this._position,
      contractType: this._contractType,
      weeklyMinutes: this._weeklyMinutes,
      hourlyRate: this._hourlyRate,
      workScheduleId: this._workScheduleId,
      hireDate: this._hireDate,
      active: this._active,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
      deletedAt: this._deletedAt,
    };
  }
}
