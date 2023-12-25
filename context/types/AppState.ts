import { AuthenticatedUser } from "./User";

export type AuthStoreState = {
  user: {
    loggedIn: boolean;
    authenticatedUser?: AuthenticatedUser;
  };
};
