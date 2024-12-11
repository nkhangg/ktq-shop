import { BackListType } from "../enums/back-list-type.enum";

export default class GeneralKtqUserBlackListLogDto {
  black_list_id: number;
  back_list_type: BackListType;
  start_at?: Date;
  end_at?: Date;
  reason: string;
}
