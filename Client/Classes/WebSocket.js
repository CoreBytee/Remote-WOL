const WS = require("ws")

class WebSocket {
    constructor() {
        this.OnMessage = []
    }

    OnMessage(Fn) {
        this.OnMessage.push(Fn)
    }

    Send(Text) {
        this.WebSocket.send(Text)
    }

    Connect() {
        this.WebSocket = new WS.WebSocket(
            `ws://${FS.readFileSync("./SERVER", "utf8")}/ws`,
            {
                headers: {
                    "Authentication": FS.readFileSync("./SERVERPASSWORD", "utf8")
                }
            }
        )

        this.WebSocket.on(
            "open",
            function () {
                console.log("Connected")
                this.WebSocket.send("Hello")
            }.bind(this)
        )

        this.WebSocket.on(
            "message",
            function (Message) {
                const MessageData = Message.toString()
                console.log(MessageData)
                for (const Fn of this.OnMessage) {
                    Fn(MessageData)
                }
            }.bind(this)
        )
    }
}