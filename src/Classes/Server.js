import express from 'express'
import expressBasicAuth from 'express-basic-auth'
import FS from 'fs'

export default class Server {
    constructor(RemoteWol) {
        this.RemoteWol = RemoteWol
        this.App = express()
       
        this.App.use(
            expressBasicAuth(
                {
                    users: { [process.env.LOGIN_NAME]: process.env.LOGIN_PASSWORD }
                }
            )
        )

        this.App.get(
            "/",
            (Request, Response) => {
                Response.header("Content-Type", "text/html")
                Response.send(FS.readFileSync("./src/Assets/index.html"))
            }
        )

        this.App.get(
            "/ping",
            async (Request, Response) => {
                Response.json(await this.RemoteWol.PingTarget())
            }
        )

        this.App.listen(process.env.SERVER_PORT)
    }
}