"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Libraries/Frameworks
 * @private
 */
const express_1 = __importDefault(require("express"));
const socket_io_1 = __importDefault(require("socket.io"));
const morgan_1 = __importDefault(require("morgan"));
// @ts-ignore
const express_fingerprint_1 = __importDefault(require("express-fingerprint"));
const nunjucks_1 = __importDefault(require("nunjucks"));
/**
 * routers
 * @private
 */
const index_1 = __importDefault(require("./routes/index"));
class Main {
    constructor() {
        this.app = express_1.default();
        this.port = 8090;
        this.appConfig();
    }
    /**
     * Kickstart server
     * @public
     */
    listen() {
        const server = this.app.listen(this.port, () => {
            console.log(`Server is fucking listening to port ${this.port} . . .`);
        });
        this.io = socket_io_1.default(server);
        this.loadWebSocketConfig();
    }
    /**
     * Parent Routes
     * @pirvate
     */
    mainRouter() {
        this.app.use('', index_1.default);
    }
    // WebSocket Init and Config
    loadWebSocketConfig() {
        let webSocketClients = [];
        this.app.set("ws", this.io);
        this.app.set("ws_clients", webSocketClients);
        // listen to web sockets connection
        this.io.on("connection", (socket) => {
            // push socket id to memory Array
            webSocketClients.push(socket.id);
            // log client connections
            console.log(`*** ${webSocketClients.length} web socket client/s connected`);
            // listen to web sockets disconnect, remove socket id to memory Array
            socket.on("disconnect", (socket) => {
                webSocketClients.splice(webSocketClients.indexOf(socket.id), 1);
            });
        });
    }
    /**
     * Initialize server configurations
     * @private
     */
    appConfig() {
        this.app.use(morgan_1.default('dev'));
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use('/static', express_1.default.static('static'));
        nunjucks_1.default.configure('views', {
            express: this.app,
            autoescape: true
        });
        this.app.set('view engine', 'html');
        this.app.use(express_fingerprint_1.default({
            parameters: [
                express_fingerprint_1.default.useragent,
                express_fingerprint_1.default.acceptHeaders,
                express_fingerprint_1.default.geoip
            ]
        }));
        this.mainRouter();
    }
}
//initialize server
const main = new Main();
main.listen();
