import { UserEntity } from '../entity/user.entity';

declare module 'express' {
  export interface Request {
    user?: UserEntity;
  }
}
