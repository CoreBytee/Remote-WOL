import { Elysia } from 'elysia'
import Index from "../Assets/index.html"
import BasicAuthentication from '../Helpers/BasicAuthentication'

export default class Server {
    constructor() {
        this.App = new Elysia()
       
        this.App.use(
            BasicAuthentication(
                [
                    { Username: process.env.LOGIN_NAME, Password: process.env.LOGIN_PASSWORD }
                ],
                "Protected",
                (Context) => {
                    Context.set.status = 401
                    return "Unauthorized"
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