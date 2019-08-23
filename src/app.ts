/**
 * Libraries/Frameworks
 * @private
 */
import express, { Application } from 'express'
import socket from 'socket.io'
import morgan from 'morgan'

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
  // private socket: Socket
  private port: number
  private server: any

  constructor() {
    this.app = express()
    this.port = 8000
    this.appConfig()
  }

  /**
   * Kickstart server
   * @public
   */
  public listen() {
    this.app.listen(this.port, (): void => {
      console.log(`Server is fucking listening to port ${this.port} . . .`)
    })
  }

  /**
   * Parent Routes
   * @pirvate
   */
  private mainRouter() {
    this.app.use('/api', indexRouter)
  }

  /**
   * Initialize server configurations
   * @private
   */
  private appConfig() {
    this.app.use(morgan('dev'))
    this.app.use(express.json())
    this.app.use(express.urlencoded({extended: false}))
    this.mainRouter()
  }

}

//initialize server
const main = new Main()
main.listen()
