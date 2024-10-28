import { IsEmail, IsNotEmpty, IsNumber, MinLength } from 'class-validator';
import { IsUnique } from '../systems/validators/decorators/is-unique';
import { HasExisted } from '../systems/validators/decorators/has-existed';

export default interface GeneralKtqAdminUserDto {
    username: string;
    email: string;
    password_hash: string;
    role_id: number;
}
