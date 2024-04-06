import { UserNotification, UserType } from '@project/shared-core';
import { Expose } from 'class-transformer';

export class UserRdo {
  @Expose()
  public id: string;

  @Expose()
  public email: string;

  @Expose()
  public firstname: string;

  @Expose()
  public lastname: string;

  @Expose()
  public dateOfBirth: Date;

  @Expose()
  public type: UserType;

  @Expose()
  public avatarId: string;

  @Expose()
  public registeredAt: Date;

  @Expose()
  public subscriptions: string[];

  @Expose()
  public notification: UserNotification;
}
