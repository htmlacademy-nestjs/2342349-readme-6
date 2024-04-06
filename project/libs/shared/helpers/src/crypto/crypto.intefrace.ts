export interface CryptoProtocol {
  hashPassword(password: string): Promise<string>;

  verifyPassword(storedHash: string, inputPassword: string): Promise<boolean>;
}
