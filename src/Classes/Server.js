import { Elysia } from 'elysia'
import Index from "../Assets/index.html"

export default class Server {
    constructor() {
        this.App = new Elysia()
        this.App.listen(process.env.SERVER_PORT)

        this.App.get(
            "/",
            () => Index
        )
    }
}