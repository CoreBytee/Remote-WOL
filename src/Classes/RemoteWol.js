import Server from "./Server";

export default class RemoteWol {
    constructor(TargetMac, TargetIP) {
        // State
        this.TargetMac = TargetMac
        this.TargetIP = TargetIP

        // Objects
        this.Server = new Server()
    }
}