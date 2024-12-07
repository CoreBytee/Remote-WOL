import { toIP } from "@network-utils/arp-lookup"
import { config } from "dotenv"
import RemoteWol from "./classes/RemoteWol.js"

config({ path: process.argv[2] || ".env" })

new RemoteWol(
    process.env.TARGET_MAC,
    await toIP(process.env.TARGET_MAC)
)