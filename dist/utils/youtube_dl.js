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
 * Libraries
 * @private
 */
const youtube_mp3_downloader_1 = __importDefault(require("youtube-mp3-downloader"));
class YoutubeDl {
    constructor(url) {
        this.url = url;
        this.file = new youtube_mp3_downloader_1.default({
            "ffmpegPath": "./ffmpeg/ffmpeg",
            "outputPath": "./mp3",
            "youtubeVideoQuality": "highest",
            "queueParallelism": 2,
            "progressTimeout": 200 // How long should be the interval of the progress reports
        });
    }
    /**
     * get video url and pipe to download stream
     * main method
     * @public
     * @param url : video url
     */
    downloadOneFile(webSocket, socketId) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.file.download(this.getVideoId(this.url));
                this.file.on('progress', (progress) => {
                    webSocket.to(`${socketId}`).emit('progress', progress);
                });
                this.file.on("finished", (error, data) => {
                    resolve(`${data.videoTitle}.mp3`);
                });
                this.file.on("error", (error) => {
                    return reject(error);
                });
            });
        });
    }
    /**
     * get video Id from video url
     * @private
     */
    getVideoId(url) {
        let getId = url.split('=')[1] || url.split('/')[-1];
        let videoUrl = getId !== 'undefined' ? getId : url.split('/')[url.split('/').length - 1];
        return videoUrl;
    }
    /**
     * verify is url is valid
     * @public
     */
    verifyUrl(url) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                let validLong = /^https\:\/\/www\.youtube\.com\/watch\?v\=+[a-zA-Z0-9-._]+$/;
                let validShort = /^https:\/\/youtu.be\/+[a-zA-Z0-9-._]+$/;
                if (validShort.test(url) || validLong.test(url)) {
                    resolve(true);
                }
                reject(false);
            });
        });
    }
}
exports.default = YoutubeDl;
// video tutorial reference for regex(very nice) = https://www.youtube.com/watch?v=sa-TUpSx1JA
/**
 * use this regexs
 * https\:\/\/www\.youtube\.com\/watch\?v\=+[a-zA-Z0-9-._]*
 * ^https://youtu.be/+
 *
 */
