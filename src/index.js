import { toIP } from "@network-utils/arp-lookup"
import { config } from "dotenv"
import RemoteWol from "./Classes/RemoteWol.js"

config()

const RemoteWolInstance = new RemoteWol(
    process.env.TARGET_MAC,
    await toIP(process.env.TARGET_MAC)
)