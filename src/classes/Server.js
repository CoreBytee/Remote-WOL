import express from 'express'
import expressBasicAuth from 'express-basic-auth'
import path from "path"
import fs from 'fs-extra'
import indexFile from '../assets/index.html'

const indexFilePath = fs.existsSync(indexFile) ? indexFile : path.join(process.argv[1], "..", indexFile)

export default class Server {
    constructor(remoteWol) {
        this.remoteWol = remoteWol
        this.app = express()
       
        this.app.use(
            expressBasicAuth(
                {
                    challenge: true,
                    users: { [process.env.LOGIN_NAME]: process.env.LOGIN_PASSWORD }
                }
            )
        )

        this.app.get(
            "/",
            (request, response) => {
                response.header("Content-Type", "text/html")
                response.send(fs.readFileSync(indexFilePath))
            }
        )

        this.app.get(
            "/ping",
            async (request, response) => {
                response.json(await this.remoteWol.pingTarget())
            }
        )

        this.app.post(
            "/wake",
            async (request, response) => {
                await this.remoteWol.wakeTarget()
                response.json(true)
            }
        )

        this.app.listen(process.env.SERVER_PORT)
    }
}