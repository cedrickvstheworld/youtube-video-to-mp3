"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Libraries/Frameworks
 * @private
 */
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
/**
 * utils
 * @private
 */
const youtube_dl_1 = __importDefault(require("../utils/youtube_dl"));
class Router {
    constructor() {
        this.router = express_1.default.Router();
        this.requestQueue = [];
    }
    /**
     * routes handler
     * @public
     */
    routeHandler() {
        /**
         * render html view
         */
        this.router.get('/', (request, response) => {
            response.render('frame.html');
        });
        /**
         * receive youtube video url and convert
         * @public
         */
        this.router.get('/ytdlmp3', (request, response) => __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            const fingerprint = request.fingerprint.hash;
            if (this.requestQueue.indexOf(fingerprint) !== -1) {
                return response.status(401).json({ error: 'you cannot convert two videos at a time. I did not fucking own a powerful server' });
            }
            this.requestQueue.push(fingerprint);
            const ws = request.app.get('ws');
            const { videoUrl, socketId } = request.query;
            if (!videoUrl) {
                return response.status(400).json({ "error": 'fuck you asshole' });
            }
            const ytmp3 = new youtube_dl_1.default(videoUrl);
            ytmp3.verifyUrl(videoUrl)
                .then(() => {
                ytmp3.downloadOneFile(ws, socketId)
                    .then((mp3File) => {
                    const file = `./mp3/${mp3File}`;
                    // @ts-ignore
                    ws.to(`${socketId}`).emit('emitTitle', { title: mp3File });
                    response.download(file, () => {
                        this.requestQueue.splice(this.requestQueue.indexOf(fingerprint), 1);
                        fs_1.default.unlink(file, (error) => {
                            if (error) {
                                console.log(error);
                            }
                        });
                    });
                })
                    .catch(error => {
                    this.requestQueue.splice(this.requestQueue.indexOf(fingerprint), 1);
                    console.log(error);
                    response.status(400).json(error);
                });
            })
                .catch((error) => {
                this.requestQueue.splice(this.requestQueue.indexOf(fingerprint), 1);
                console.log(error);
                return response.status(400).json({ "error": error });
            });
        }));
        return this.router;
    }
}
exports.default = new Router().routeHandler();
