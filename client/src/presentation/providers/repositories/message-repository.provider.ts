import { MessagesDbDatasource } from "../../../infrastructure/datasources/messages-db.datasource";
import { MessageRepositoryImpl } from "../../../infrastructure/repositories/message-db.repository.impl";

export const messageRepositoryProvider = new MessageRepositoryImpl(new MessagesDbDatasource);