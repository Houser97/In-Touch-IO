import express, { Router } from 'express';
import fileUpload from 'express-fileupload';
import http from 'http';
import path from 'path';
import { Server as SocketIOServer } from 'socket.io';
import { Sockets } from '../config/sockets';
import { MessageService } from './services/message.service';
import { ChatService } from './services/chat.service';

interface Options {
    port: number;
    routes: Router;
    publicPath?: string;
}

export class Server {
    public readonly app = express();
    private readonly port: number;
    private serverListener?: any;
    private readonly routes: Router;
    private readonly publicPath: string;

    //* Http server y Socket.IO en el mismo servidor
    private readonly httpServer = http.createServer(this.app);
    private readonly io = new SocketIOServer(this.httpServer, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true
        }
    });

    constructor(options: Options) {
        const { port, routes, publicPath = 'public' } = options;
        this.port = port;
        this.routes = routes;
        this.publicPath = publicPath;
    }

    async start() {
        if (process.env.NODE_ENV !== 'production') {
            require('dotenv').config();
            const cors = require('cors');
            this.app.use(cors({
                origin: "http://localhost:5173",
                credentials: true,
            }));
        }

        //* Middlewares
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(fileUpload({
            limits: { fileSize: 50 * 4096 * 4096 }
        }));

        //* Public Folder
        this.app.use(express.static(this.publicPath));

        //* Routes
        this.app.use(this.routes);

        //* SPA (Single Page Application)
        this.app.get('*', (req, res) => {
            const indexPath = path.join(__dirname + `../../../${this.publicPath}/index.html`);
            res.sendFile(indexPath);
        });

        //* Socket initialization
        this.initializeSockets();

        //* Start server
        this.serverListener = this.httpServer.listen(this.port, () => {
            console.log(`Server running on port ${this.port}`);
        });
    }

    public close() {
        this.serverListener?.close();
    }

    private initializeSockets() {
        const messageService = new MessageService();
        const chatService = new ChatService(messageService);
        new Sockets(this.io, messageService, chatService);
    }
}
