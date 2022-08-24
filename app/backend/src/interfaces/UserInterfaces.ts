export type Indexable = {
  id?: number
};

export type UserData = Indexable & {
  username: string;
  role: string;
};

export type UserDB = UserData & {
  email: string;
  password: string;
};

export type UserWithoutPassword = Omit<UserDB, 'password'>;

export interface UserDBwithToken {
  user: UserWithoutPassword;
  token: string
}

export type LoginBody = Omit<UserDB, keyof UserData>;
