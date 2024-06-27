import { BaseUser } from "src/app/base/authentication/models/base-user.model";

export interface AuthenticatedUser extends BaseUser {
  sub: string;
  authorities: string[];
  authentication: string;
}
