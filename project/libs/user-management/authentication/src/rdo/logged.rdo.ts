import { Expose } from 'class-transformer';

export class LoggedRdo {
  @Expose()
  public id: string;

  @Expose()
  public email: string;

  @Expose()
  public accessToken: string;
}
