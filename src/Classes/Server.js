import { Elysia } from 'elysia'
import Index from "../Assets/index.html"
import { basicAuth } from '@eelkevdbos/elysia-basic-auth'

export default class Server {
    constructor() {
        this.App = new Elysia()
        this.App.use(
            basicAuth(
                {
                    credentials: [
                        {
                            username: process.env.LOGIN_NAME,
                            password: process.env.LOGIN_PASSWORD
                        }
                    ],
                    scope: "/",
                    realm: "Login"
                }
            )
        )

        this.App.get(
            "/",
            () => { return new Response(Bun.file(Index)) }
        )

        this.App.listen(process.env.SERVER_PORT)
    }
}