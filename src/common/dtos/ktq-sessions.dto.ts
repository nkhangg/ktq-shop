import KtqSession from '@/entities/ktq-sessions.entity';
import { UserRoleType } from '../enums/user-role-type.enum';
import { IsNumber } from 'class-validator';
import { HasExisted } from '../systems/validators/decorators/has-existed';

export default interface GeneralKtqSessionDto {
    user_id: number;
    user_role_type: UserRoleType;
    session_token: string;
    payload?: string;
    expires_at?: Date;
    live?: boolean;
}

export class SessionLogoutDto {
    @IsNumber()
    @HasExisted({ tableName: 'ktq_sessions', column: 'id' })
    id_session: KtqSession['id'];
}

export class SessionLogoutsDto {
    @IsNumber({}, { each: true })
    ids_session: KtqSession['id'][];
}
