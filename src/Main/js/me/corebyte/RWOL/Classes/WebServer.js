const FS = require("fs")

class WebServer {
    constructor(Main) {
        this.Main = Main
        this.App = require("express")()
        this.Middleware()
        this.Routes()
        this.Listen()
    }

    Middleware() {
        this.App.use(
            require("express-basic-auth")(
                {
                    users: {
                        "adminuser": FS.readFileSync("./PASSWORD", "utf8")
                    },
                    challenge: true,
                    realm: "RWOL"
                }
            )
        )
        
        this.App.use(
            require("connect-no-cache-headers")()
        )
    }

    Routes() {
        this.App.get(
            "/",
            function (Request, Response) {
                Response.sendFile(
                    TypeWriter.ResourceManager.GetFilePath("RWOL", "/index.html")
                )
            }
        )
        
        this.App.get(
            "/boot",
            function (Request, Response) {
                console.log("boot")
                Response.redirect(
                    "/"
                )
            }
        )
    }

    Listen() {
        this.Server = this.App.listen(
            FS.readFileSync("./PORT", "utf8")
        )
    }

    GetServer() {
        return this.Server
    }
}

module.exports = WebServer