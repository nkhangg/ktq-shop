import { UserRoleType } from "../enums/user-role-type.enum";
import { BackListType } from "../enums/back-list-type.enum";

export default class GeneralKtqUserBlackListDto {
  user_id_app: number;
  user_role_type: UserRoleType;
  back_list_type: BackListType;
  start_at?: Date;
  end_at?: Date;
  reason: string;
}
