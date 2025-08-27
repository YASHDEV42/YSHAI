import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
@Injectable()
export class UsersService {
  constructor(private readonly em: EntityManager) {}
}
