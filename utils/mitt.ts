import mitt from "mitt"
const emitter = mitt()
export const useEmit = emitter.emit
export const useOn = emitter.on
export const useOff = emitter.off
