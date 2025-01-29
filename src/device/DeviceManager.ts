/// <reference types="web-bluetooth" />
// import { throttle } from 'throttle-debounce'

const UUID_SERVICE = '53300001-0023-4bd4-bbd5-a6920e4c5653'
const UUID_CHARASTERIC_TX = '53300002-0023-4bd4-bbd5-a6920e4c5653'
const UUID_CHARASTERIC_RX = '53300003-0023-4bd4-bbd5-a6920e4c5653'
const RECONNECT_DELAY_SECONDS = 3

export default class DeviceManager {
  device: BluetoothDevice | null = null
  get deviceName() {
    return this.device?.name || null
  }

  server: BluetoothRemoteGATTServer | null = null
  service: BluetoothRemoteGATTService | null = null

  tx_characteristic: BluetoothRemoteGATTCharacteristic | null = null
  rx_characteristic: BluetoothRemoteGATTCharacteristic | null = null

  get connected() {
    return this.device && this.device.gatt?.connected
  }

  onConnectionChange: ((connected: boolean) => void) | null = null
  onReconnectionChange: ((reconnecting: boolean) => void) | null = null

  wantsConnection: boolean = false

  get reconnecting() {
    return this.device && !this.device.gatt?.connected && this.enableAutoReconnect
  }

  reconnectTimeoutId: number | undefined = undefined

  _enableAutoReconnect = true

  get enableAutoReconnect() {
    return this._enableAutoReconnect
  }

  set enableAutoReconnect(value: boolean) {
    this._enableAutoReconnect = value
    if (!value) {
      clearTimeout(this.reconnectTimeoutId)
      this.reconnectTimeoutId = undefined

      if (!this.connected) {
        this.device = null
        if (this.onReconnectionChange) this.onReconnectionChange(false)
      }
    }
  }

  constructor() {}

  async connectPrompt() {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [UUID_SERVICE] }],
      })

      await this.connect(device)
    } catch {
      console.warn('closed connect prompt')
    }
  }

  async connect(device: BluetoothDevice) {
    if (!device) return

    this.device = device
    this.wantsConnection = true
    this.server = await device.gatt!.connect()

    console.log('device connected:', device.name)
    if (this.onReconnectionChange) this.onReconnectionChange(false)
    if (this.onConnectionChange) this.onConnectionChange(true)

    this.service = await this.server.getPrimaryService(UUID_SERVICE)
    this.tx_characteristic = await this.service.getCharacteristic(UUID_CHARASTERIC_TX)
    this.rx_characteristic = await this.service.getCharacteristic(UUID_CHARASTERIC_RX)
    console.log('service + characteristics obtained')

    device.addEventListener('gattserverdisconnected', () => {
      console.log('device disconneted')

      this.server = null
      this.service = null
      this.tx_characteristic = null
      this.rx_characteristic = null

      if (this.onConnectionChange) this.onConnectionChange(false)

      if (this.enableAutoReconnect && this.wantsConnection) {
        if (this.onReconnectionChange) this.onReconnectionChange(true)
        this._attemptReconnect()
      } else {
        device = null
      }
    })
  }

  async _attemptReconnect() {
    if (!this.connected && this.device) {
      console.log('reconnect attempt...')

      try {
        // clear timeout attempt
        clearTimeout(this.reconnectTimeoutId)
        this.reconnectTimeoutId = undefined

        await this.connect(this.device)
      } catch {
        // retry in 2 seconds
        clearTimeout(this.reconnectTimeoutId)
        this.reconnectTimeoutId = setTimeout(() => {
          console.log('reconnect timeout')
          this._attemptReconnect()
        }, 1000 * RECONNECT_DELAY_SECONDS)
      }
    }
  }

  disconnect() {
    if (this.connected) {
      this.wantsConnection = false
      this.device.gatt?.disconnect()
      this.device = null
    } else {
      this.wantsConnection = false
      this.device = null
      clearTimeout(this.reconnectTimeoutId)
      this.reconnectTimeoutId = undefined
      if (this.onReconnectionChange) this.onReconnectionChange(false)
    }
  }

  async sendVibe(value: number) {
    if (this.tx_characteristic) {
      const valueText = Math.min(20, Math.max(0, value)).toFixed(0)
      const sendText = 'Vibrate:' + valueText + ';'

      const encoder = new TextEncoder()
      const buffer = encoder.encode(sendText)
      await this.tx_characteristic.writeValue(buffer)
    }
  }
}
