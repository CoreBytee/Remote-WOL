const WS = require('ws')
const FS = require("fs")

class WebSocket {
    constructor(Main, Server) {
        this.Main = Main
        this.Server = Server
        this.Secret = FS.readFileSync("./CLIENTPASSWORD", "utf8")
        this.Connections = []
        this.MessageListeners = []
        this.RunServer()
        this.ListenConnections()
    }

    RunServer() {
        this.WebSocketServer = new WS.Server(
            {
                server: this.Server,
                path: "/ws"
            }
        )
    }

    ListenConnections() {
        this.WebSocketServer.on(
            "connection",
            function (WebSocket, Request) {
                if (Request.headers.authentication != this.Secret) {
                    WebSocket.close()
                    TypeWriter.Logger.Information("Connection Denied: " + Request.socket.remoteAddress)
                    return
                }
                const ConnectionId = this.Connections.length
                var ConnectionIsAlive = true
                this.Connections.push(WebSocket)

                const HeartbeatInterval = setInterval(
                    function() {
                        if (ConnectionIsAlive === false) {
                            WebSocket.terminate()
                            return
                        }
                        ConnectionIsAlive = false
                        WebSocket.ping()
                    },
                    10000
                )

                TypeWriter.Logger.Information("New Connection: " + ConnectionId)
                WebSocket.on(
                    "close",
                    function () {
                        this.Connections.splice(ConnectionId, 1)
                        clearInterval(HeartbeatInterval)
                        TypeWriter.Logger.Information("Connection Closed: " + ConnectionId)
                    }.bind(this)
                )

                WebSocket.on(
                    "pong",
                    function () {
                        ConnectionIsAlive = true
                    }.bind(this)
                )

                WebSocket.on(
                    "message",
                    function (Message) {
                        const MessageData = Message.toString()
                        for (const Fn of this.MessageListeners) {
                            Fn(MessageData)
                        }
                    }.bind(this)
                )
                
            }.bind(this)
        )
    }

    BroadcastMessage(Text) {
        for (const WebSocket of this.Connections) {
            WebSocket.send(Text)
        }
    }

    OnMessage(Fn) {
        this.MessageListeners.push(Fn)
    }
}

module.exports = WebSocket