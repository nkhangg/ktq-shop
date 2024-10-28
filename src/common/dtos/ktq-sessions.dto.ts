import { UserRoleType } from "../enums/user-role-type.enum";

export default interface GeneralKtqSessionDto {
  user_id: number;
  user_role_type: UserRoleType;
  session_token: string;
  payload?: string;
  expires_at?: Date;
  live?: boolean;
}
