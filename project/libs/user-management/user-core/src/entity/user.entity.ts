import { AuthUser, Entity, StorableEntity, UserNotification, UserType } from '@project/shared-core';

export class UserEntity extends Entity implements StorableEntity<AuthUser> {
  public email: string;
  public firstname: string;
  public lastname: string;
  public dateOfBirth: Date;
  public type: UserType;
  private passwordHash: string;
  public avatarId: string;
  public registeredAt: Date;
  public subscriptions: UserEntity[];
  public notification: UserNotification;

  constructor(user?: AuthUser) {
    super();
    this.populate(user);
  }

  public populate(user?: AuthUser): void {
    if (!user) {
      return;
    }

    this.id = this.id ?? '';
    this.email = user.email;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.dateOfBirth = user.dateOfBirth ?? new Date(0);
    this.type = user.type ?? UserType.USER;
    this.passwordHash = user.passwordHash;
    this.avatarId = user.avatarId ?? '';
    this.registeredAt = user.registeredAt ?? new Date();
    this.notification = user.notification ?? UserNotification.EMAIL;
  }

  public toPOJO() {
    return {
      id: this.id,
      email: this.email,
      firstname: this.firstname,
      lastname: this.lastname,
      dateOfBirth: this.dateOfBirth,
      type: this.type,
      passwordHash: '',
      avatarId: this.avatarId,
      registeredAt: this.registeredAt,
      notification: this.notification,
      subscriptions: [],
    };
  }

  public setPassword(passwordHash: string): void {
    this.passwordHash = passwordHash;
  }

  public emptyPasswordHash(): void {
    this.passwordHash = '';
  }
}
