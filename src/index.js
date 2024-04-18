import { toIP } from "@network-utils/arp-lookup"
import RemoteWol from "./Classes/RemoteWol"

const RemoteWolInstance = new RemoteWol(
    process.env.TARGET_MAC,
    await toIP(process.env.TARGET_MAC)
)