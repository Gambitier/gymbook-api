import { UserRoleEnum } from '@modules/auth/common';

export type UserRoleDomainModel = {
  id: string;
  role: string | UserRoleEnum;
  userId: string;
  createdAt: Date;
};
