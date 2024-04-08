import { UserNotificationType } from './notification-type.enum';
import { UserType } from './user-type.enum';

export interface User {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date;
  userType?: UserType;
  avatarUrl?: string;
  registeredAt?: Date;
  notificationType?: UserNotificationType;
  subscriptions?: string[];
}
