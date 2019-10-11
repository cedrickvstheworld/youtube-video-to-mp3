/**
 * Libraries
 * @private
 */
// @ts-ignore
import youtubeToMp3 from 'youtube-mp3-downloader'


export default class YoutubeDl {
  // type declarations
  private url: string
  private file: any

  constructor(url: string) {
    this.url = url
    this.file = new youtubeToMp3(
      {
        "ffmpegPath": "./ffmpeg/ffmpeg",        // Where is the FFmpeg binary located?
        "outputPath": "./mp3",    // Where should the downloaded and encoded files be stored?
        "youtubeVideoQuality": "highest",       // What video quality should be used?
        "queueParallelism": 2,                  // How many parallel downloads/encodes should be started?
        "progressTimeout": 200                 // How long should be the interval of the progress reports
      }
    )
  }

  /**
   * get video url and pipe to download stream
   * main method
   * @public
   * @param url : video url
   */
  public async downloadOneFile(webSocket: any, socketId: string) {
    return new Promise((resolve, reject) => {
      let url = this.getVideoId(this.url)
      console.log(url)
      this.file.download(url)
      this.file.on('progress', (progress: any) => {
        webSocket.to(`${socketId}`).emit('progress', progress)
      })
      this.file.on("finished", (error: any, data: any) => {
        resolve(`${data.videoTitle}.mp3`)
      })
      this.file.on("error", (error: any) => {
        return reject(error)
      })
    })
  }

  /**
   * get video Id from video url
   * @private
   */
  private getVideoId(url: string) {
    // @ts-ignore
    url = url.split(/(vi\/|v=|\/v\/|youtu\.be\/|\/embed\/)/);
    let x = (url[2] !== undefined) ? url[2].split(/[^0-9a-z_\-]/i)[0] : url[0];
    return x
  }

  /**
   * verify is url is valid
   * @public
   */
  public async verifyUrl(url: string) {
    return new Promise((resolve, reject) => {
      let valid = /^(http:\/\/|https:\/\/)(vimeo\.com|youtu\.be|www\.youtube\.com)\/([\w\/]+)([\?].*)?$/
      if (valid.test(url)) {
        resolve(true)
      }
      reject(false)
    })
  }

}


// video tutorial reference for regex(very nice) = https://www.youtube.com/watch?v=sa-TUpSx1JA
/**
 * use this regexs
 * https\:\/\/www\.youtube\.com\/watch\?v\=+[a-zA-Z0-9-._]*
 * ^https://youtu.be/+
 *
 */
