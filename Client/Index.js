const FS = require("fs")
const WOL = require("wol")

const WebSocket = new (require("./Classes/WebSocket"))()

WebSocket.OnMessage(
    function (Message) {
        if (Message != "boot") {
            return
        }
        console.log("SENDING WOL PACKET")
        WOL.wake(
            FS.readFileSync("./MAC", "utf8"),
            function (Error, Response) {
                if (Error) {
                    console.log(Error)
                } else {
                    console.log(Response)
                }
            }
        )
        WebSocket.Send(
            "looting"
        )
    }
)