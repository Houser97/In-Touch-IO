import { UsersDbDatasource } from "../../../infrastructure/datasources/users-db.datasource";
import { UserRepositoryImpl } from "../../../infrastructure/repositories/user-db.repository.impl";

export const userRepositoryProvider = new UserRepositoryImpl(new UsersDbDatasource());