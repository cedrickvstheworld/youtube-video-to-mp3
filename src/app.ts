/**
 * Libraries/Frameworks
 * @private
 */
import express, { Application } from 'express'
import SocketIO from 'socket.io'
import morgan from 'morgan'
// @ts-ignore
import fingerprint from 'express-fingerprint'
import nunjucks from 'nunjucks'

/**
 * routers
 * @private
 */
import indexRouter from './routes/index'

/**
 * Types
 * @private
 */
import {Request, Response, NextFunction} from 'express'
import {Socket} from 'socket.io'


class Main {
  // type declarations
  private app: Application
  private port: number
  private server: any
  private io: any

  constructor() {
    this.app = express()
    // @ts-ignore
    this.port = process.env.PORT || 8090
    this.appConfig()
  }

  /**
   * Kickstart server
   * @public
   */
  public listen() {
    const server = this.app.listen(this.port, (): void => {
      console.log(`Server is fucking listening to port ${this.port} . . .`)
    })
    this.io = SocketIO(server)
    this.loadWebSocketConfig()
  }

  /**
   * Parent Routes
   * @pirvate
   */
  private mainRouter() {
    this.app.use('', indexRouter)
  }

  // WebSocket Init and Config
 private loadWebSocketConfig() {
   let webSocketClients: Array<any> = []
   this.app.set("ws", this.io)
   this.app.set("ws_clients", webSocketClients)
   // listen to web sockets connection
   this.io.on("connection", (socket: any) => {
     // push socket id to memory Array
     webSocketClients.push(socket.id)
     // log client connections
     console.log(
       `*** ${webSocketClients.length} web socket client/s connected`
     )
     // listen to web sockets disconnect, remove socket id to memory Array
     socket.on("disconnect", (socket: any) => {
       webSocketClients.splice(webSocketClients.indexOf(socket.id), 1)
     })
   })
 }


  /**
   * Initialize server configurations
   * @private
   */
  private appConfig() {
    this.app.use(morgan('dev'))
    this.app.use(express.json())
    this.app.use(express.urlencoded({extended: false}))
    this.app.use('/static', express.static('static'))
    nunjucks.configure('views', {
      express: this.app,
      autoescape: true
    })
    this.app.set('view engine', 'html')
    this.app.use(fingerprint({
      parameters: [
        fingerprint.useragent,
        fingerprint.acceptHeaders,
        fingerprint.geoip
      ]
    }))
    this.mainRouter()
  }

}

//initialize server
const main = new Main()
main.listen()
