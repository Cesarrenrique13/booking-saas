import { applyDecorators, UseGuards } from '@nestjs/common';
import { RoleProtected } from './index';
import { ValidRoles } from '../enums/valid_roles.interface';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(
    RoleProtected(...roles),
    UseGuards(AuthGuard(), UserRoleGuard),
    ApiBearerAuth(),
  );
}
