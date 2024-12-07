import express from 'express'
import expressBasicAuth from 'express-basic-auth'
import path from "path"
import fs from 'fs-extra'
import indexFile from '../assets/index.html'
import burtleFile from '../assets/burtle.gif'
import chance from '../util/chance'

const indexFilePath = path.join(import.meta.dirname, indexFile)
const burtleFilePath = path.join(import.meta.dirname, burtleFile)

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
            "/burtle.gif",
            (request, response) => {
                response.header("Content-Type", "image/gif")
                response.header("Cache-Control", "no-store")
                response.header("Pragma", "no-cache")
                response.header("Expires", "0")
                if (!chance(100)) { return response.send("") }
                response.send(fs.readFileSync(burtleFilePath))
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

        this.app.listen(
            process.env.SERVER_PORT,
            () => {
                console.log(`Server running on port ${process.env.SERVER_PORT}`)
            }
        )
    }
}