import { compare, genSalt, hash } from 'bcrypt';
import { CryptoProtocol } from './crypto.intefrace';

export class BcryptCrypto implements CryptoProtocol {
  constructor(private readonly saltRounds: number) {
  }

  public async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(this.saltRounds);
    return hash(password, salt);
  }

  public async verifyPassword(inputPassword: string, storedHash: string): Promise<boolean> {
    return compare(inputPassword, storedHash);
  }
}
