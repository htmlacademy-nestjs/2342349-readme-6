import { UserNotificationType, UserType } from '@project/shared-core';
import { Expose } from 'class-transformer';

export class UserRdo {
  @Expose()
  public id: string;

  @Expose()
  public email: string;

  @Expose()
  public firstName: string;

  @Expose()
  public lastName: string;

  @Expose()
  public dateOfBirth: Date;

  @Expose()
  public userType: UserType;

  @Expose()
  public avatarUrl: string;

  @Expose()
  public registeredAt: Date;

  @Expose()
  public subscriptions: string[];

  @Expose()
  public notificationType: UserNotificationType;
}
