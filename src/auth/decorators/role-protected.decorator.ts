import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '../enums/valid_roles.interface';

export const META_ROLES = 'roles';

export const RoleProtected = (...args: ValidRoles[]) =>
  SetMetadata(META_ROLES, args);
