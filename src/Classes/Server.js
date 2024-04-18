import { Elysia } from 'elysia'
import Index from "../Assets/index.html"
import BasicAuthentication from '../Helpers/BasicAuthentication'
import ping from 'ping'

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
                const PingResult = await ping.promise.probe(
                    this.RemoteWol.TargetIP,
                    {}
                )
                return JSON.stringify(PingResult.alive)
            }
        )

        this.App.listen(process.env.SERVER_PORT)
    }
}