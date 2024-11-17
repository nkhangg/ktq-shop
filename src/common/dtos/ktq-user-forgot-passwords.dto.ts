import { UserRoleType } from "../enums/user-role-type.enum";

export default class GeneralKtqUserForgotPasswordDto {
  user_role_type: UserRoleType;
  email: string;
  send_at: Date;
  code: string;
}
