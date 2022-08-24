import { ClubDB } from '../interfaces/ClubInterfaces';
import Club from '../database/models/Club';

export default class ClubService {
  Club = Club;

  public static async getAll() {
    const clubs = await Club.findAll();
    return clubs as ClubDB[];
  }

  public static async getById(id: number) {
    const club = await Club.findByPk(id);
    return club as ClubDB;
  }
}
