import Server from "./Server";

export default class RemoteWol {
    constructor(TargetMac, TargetIP) {
        // State
        this.TargetMac = TargetMac
        this.TargetIP = process.env.TARGET_IP_OVERRIDE || TargetIP

        // Objects
        this.Server = new Server(this)
    }
}