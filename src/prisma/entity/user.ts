import { GenderEnum } from '@modules/user/enums/gender.enum';
import { UserPrefixEnum } from '@modules/user/enums/user.prefix.enum';
import { $Enums } from '@prisma/client';

export type UserEntity = {
  id: string;
  prefix: string | UserPrefixEnum | $Enums.UserRoleEnum;
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  gender: string | GenderEnum;
  dateOfBirth: Date;
  createdAt: Date;
  updatedAt: Date;
  deleted: Date;
};
