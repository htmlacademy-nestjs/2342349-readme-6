import { Expose } from 'class-transformer';

export class SubscriptionRdo {
  @Expose()
  public subscriptions: string[];
}
