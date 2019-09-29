/**
 * Libraries/Frameworks
 * @private
 */
import express from 'express'
import fs from 'fs'

/**
 * utils
 * @private
 */
import youtubeToMp3 from '../utils/youtube_dl';

/**
 * Types
 * @private
 */
import {Request, Response, NextFunction} from 'express'


class Router {
  // type declarations
  router: any

  constructor() {
    this.router = express.Router()
  }

  /**
   * routes handler
   * @public
   */
  public routeHandler() {
    /**
     * render html view
     */
    this.router.get('/', (request: Request, response: Response) => {
      response.render('frame.html')
    })
    /**
     * receive youtube video url and convert
     * @public
     */
    this.router.get('/ytdlmp3', async (request: Request, response: Response) => {
      const ws = request.app.get('ws')
      const {videoUrl} = request.query
      if (!videoUrl) {
        return response.status(400).json({"error": 'fuck you asshole'})
      }
      const ytmp3 = new youtubeToMp3(videoUrl)
      ytmp3.verifyUrl(videoUrl)
      .then(() => {
        ytmp3.downloadOneFile(ws)
        .then((mp3File) => {
          const file = `./mp3/${mp3File}`
          // @ts-ignore
          ws.emit('emitTitle', {title: mp3File})
          response.download(file, () => {
            fs.unlink(file, (error) => {
              if (error) {
                console.log(error)
              }
            })
          })
        })
        .catch(error => {
          response.status(400).json(error)
        })
      })
      .catch((error) => {
        return response.status(400).json({"error": error})
      })
    })

    return this.router

  }

}


export default new Router().routeHandler()
