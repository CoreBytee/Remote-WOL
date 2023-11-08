const WS = require("ws")
const FS = require("fs")

class WebSocket {
    constructor() {
        this.MessageListeners = []
        this.Connect()
    }

    OnMessage(Fn) {
        this.MessageListeners.push(Fn)
    }

    Send(Text) {
        this.WebSocket.send(Text)
    }

    Heartbeat() {
        this.StopHeartbeat()
        this.HeartbeatTimeout = setTimeout(
            function () {
                this.Disconnect(true)
            }.bind(this),
            15000
        )
    }

    StopHeartbeat() {
        if (!this.HeartbeatTimeout) { return }
        clearTimeout(this.HeartbeatTimeout)
    }

    Connect() {
        console.log("Trying to connect to WebSocket")
        this.WebSocket = new WS.WebSocket(
            `wss://${FS.readFileSync("./SERVER", "utf8")}/ws`,
            {
                headers: {
                    "Authentication": FS.readFileSync("./SERVERPASSWORD", "utf8")
                }
            }
        )

        this.WebSocket.on(
            "error",
            console.log
        )

        this.WebSocket.on("ping", this.Heartbeat.bind(this))

        this.WebSocket.on(
            "open",
            function () {
                console.log("WebSocket Opened")
            }.bind(this)
        )

        this.WebSocket.on(
            "close",
            function (Code, Reason) {
                console.log("WebSocket Closed", Code, Reason.toString())
                this.Disconnect(true)
            }.bind(this)
        )

        this.WebSocket.on(
            "message",
            function (Message) {
                const MessageData = Message.toString()
                for (const Fn of this.MessageListeners) {
                    Fn(MessageData)
                }
            }.bind(this)
        )
    }

    async Disconnect(Reconnect, Force=false) {
        this.StopHeartbeat()
        if (Force) {
            this.WebSocket.terminate()
        } else {
            this.WebSocket.close()
        }
        if (Reconnect) {
            await new Promise(resolve => setTimeout(resolve, 1000))
            this.Connect()
        }
    }
}

module.exports = WebSocket