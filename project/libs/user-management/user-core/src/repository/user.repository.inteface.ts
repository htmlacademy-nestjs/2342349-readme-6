import { Repository } from '@project/data-access';
import { UpdateUserDto } from '@project/user';
import { UserEntity } from '../entity/user.entity';

export interface UserRepository extends Repository<UserEntity> {
  findByEmail(email: string): Promise<UserEntity | null>;

  update(userId: string, entity: UpdateUserDto): Promise<UserEntity>;
}
