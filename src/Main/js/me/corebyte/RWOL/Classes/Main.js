

class Main {
    constructor() {
        this.WebServer = new (Import("me.corebyte.RWOL.Classes.WebServer"))(this)
        this.WebSocket = new (Import("me.corebyte.RWOL.Classes.WebSocket"))(this, this.WebServer.GetServer())

        this.Booting = false

        this.WebSocket.OnMessage(
            function (Message) {
                if (Message != "looting") { return }
                TypeWriter.Logger.Information("Client received boot message")
                this.Booting = false
            }.bind(this)
        )

        setInterval(
            () => {
                if (this.Booting === false) { return }
                this.BroadcastBoot()
            },
            5000
        )
    }

    BroadcastBoot() {
        TypeWriter.Logger.Information("Broadcasting Boot")
        this.WebSocket.BroadcastMessage("boot")
    }

    StartBooting() {
        this.BroadcastBoot()
        this.Booting = true
    }
}

module.exports = Main