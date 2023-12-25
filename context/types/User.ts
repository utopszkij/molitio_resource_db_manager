type User = {
  id: string;  // 2023.12.13 updates Utopszkij number --> string
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
  accessToken: string;
  //+ 2023.12.13 Uopszkij
  nick: string,
  avatar: string;
  roles: Array<String>; 
  //- 2023.12.13 Uopszkij
  
};

export type UserRegister = Omit<User, "id" | "accessToken">;

export type UserLogin = Omit<
  User,
  "confirmPassword" | "fullname" | "id" | "accessToken"
>;

export type AuthenticatedUser = Omit<User, "confirmPassword" | "password">;
