/**
 * Libraries
 * @private
 */
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
  public async downloadOneFile(webSocket: any) {
    return new Promise((resolve, reject) => {
      this.file.download(this.getVideoId(this.url))
      this.file.on('progress', (progress: any) => {
        webSocket.emit('progress', progress)
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

    let getId = url.split('=')[1] || url.split('/')[-1]
    let videoUrl = getId !== 'undefined' ? getId : url.split('/')[url.split('/').length - 1]
    return videoUrl
  }

  /**
   * verify is url is valid
   * @public
   */
  public async verifyUrl(url: string) {
    return new Promise((resolve, reject) => {
      let validLong = /^https\:\/\/www\.youtube\.com\/watch\?v\=+[a-zA-Z0-9-._]+$/
      let validShort = /^https:\/\/youtu.be\/+[a-zA-Z0-9-._]+$/
      if (validShort.test(url) || validLong.test(url)) {
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
