const FS = require("fs")

const WebSocket = new (require("./Classes/WebSocket"))()

WebSocket.OnMessage(
    function (Message) {
        if (Message != "boot") {
            return
        }
        console.log("SENDING WOL PACKET")
        WebSocket.Send(
            "looting"
        )
    }
)