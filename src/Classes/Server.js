import express from 'express'
import expressBasicAuth from 'express-basic-auth'
import FS from 'fs-extra'

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
                response.send(FS.readFileSync("./src/Assets/index.html"))
            }
        )

        this.app.get(
            "/ping",
            async (request, response) => {
                response.json(await this.remoteWol.pingTarget())
            }
        )

        this.app.listen(process.env.SERVER_PORT)
    }
}