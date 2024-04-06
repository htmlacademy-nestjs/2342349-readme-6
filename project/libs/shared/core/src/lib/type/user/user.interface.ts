import { UserNotification } from './user-notification.enum';
import { UserType } from './user-type.enum';

export interface User {
  id?: string;
  email: string;
  firstname: string;
  lastname: string;
  dateOfBirth?: Date;
  type?: UserType;
  avatarId?: string;
  registeredAt?: Date;
  notification?: UserNotification;
  subscriptions?: string[];
}
