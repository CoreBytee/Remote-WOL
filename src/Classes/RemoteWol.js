import Server from "./Server"
import ping from 'ping'


export default class RemoteWol {
    constructor(TargetMac, TargetIP) {
        // State
        this.TargetMac = TargetMac
        this.TargetIP = process.env.TARGET_IP_OVERRIDE || TargetIP

        console.log(`Target MAC: ${this.TargetMac}`)
        console.log(`Target IP: ${this.TargetIP}`)

        // Objects
        this.Server = new Server(this)
    }

    async PingTarget() {
        const PingResult = await ping.promise.probe(
            this.TargetIP,
            {
                min_reply: 1
            }
        )

        return PingResult.alive
    }
}