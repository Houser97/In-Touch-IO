import { ChatDbDatasource } from "../../../infrastructure/datasources/chats-db.datasource";
import { ChatRepositoryImpl } from "../../../infrastructure/repositories/chat-db.repository.impl";

export const chatRepositoryProvider = new ChatRepositoryImpl(new ChatDbDatasource());