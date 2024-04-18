import { Elysia } from 'elysia'
import Index from "../Assets/index.html"
import BasicAuthentication from '../Helpers/BasicAuthentication'

export default class Server {
    constructor(RemoteWol) {
        this.RemoteWol = RemoteWol
        this.App = new Elysia()
       
        this.App.use(
            BasicAuthentication(
                [
                    { Username: process.env.LOGIN_NAME, Password: process.env.LOGIN_PASSWORD }
                ],
                "Protected"
            )
        )

        this.App.get(
            "/",
            (Context) => { return new Response(Bun.file(Index)) }
        )

        this.App.get(
            "/ping",
            async (Context) => {
                return await this.RemoteWol.PingTarget()
            }
        )

        this.App.listen(process.env.SERVER_PORT)
    }
}