import User from '../database/models/User';
import { UserDB } from '../interfaces/UserInterfaces';

export default class LoginService {
  User = User;

  public static async findByEmailPassword(email: string) {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return null;
    }
    return user as unknown as UserDB;
  }
}
