

class Main {
    constructor() {
        this.WebServer = new (Import("me.corebyte.RWOL.Classes.WebServer"))(this)
        this.WebSocket = new (Import("me.corebyte.RWOL.Classes.WebSocket"))(this, this.WebServer.GetServer())
    }
}

module.exports = Main