import { wake } from "wol"
import Server from "./Server.js"
import ping from 'ping'

export default class RemoteWol {
    constructor(targetMac, targetIP) {
        // State
        this.targetMac = targetMac
        this.targetIP = process.env.TARGET_IP_OVERRIDE || targetIP

        console.log(`Target MAC: ${this.targetMac}`)
        console.log(`Target IP: ${this.targetIP}`)

        // Objects
        this.Server = new Server(this)
    }

    async pingTarget() {
        const pingResult = await ping.promise.probe(
            this.targetIP,
            {
                min_reply: 1
            }
        )

        return pingResult.alive
    }

    async wakeTarget() {
        console.log("Sending magic packet...")
        wake(this.targetMac)
        console.log("Sent magic packet!")
    }
}