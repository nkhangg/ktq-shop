import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { Exclude } from "class-transformer";
import { BackListType } from "@/common/enums/back-list-type.enum";

import KtqUserBlackList from "./ktq-user-black-lists.entity";

@Entity("ktq_user_black_list_logs")
export default class KtqUserBlackListLog {
  @PrimaryGeneratedColumn("increment")
  id: number;

  @Column({ type: "enum", enum: BackListType })
  back_list_type: BackListType;

  @Column({ type: "timestamp", default: null })
  start_at: Date;

  @Column({ type: "timestamp", default: null })
  end_at: Date;

  @Column({ type: "varchar" })
  reason: string;

  @ManyToOne(
    () => KtqUserBlackList,
    (userBlackList) => userBlackList.userBlackListLogs,
    { cascade: true, eager: true },
  )
  //@Exclude()
  userBlackList: KtqUserBlackList;
}
