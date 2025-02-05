import { createSignal, onCleanup, type Component } from 'solid-js'
import Header from './ui/Header'
import ControlPanel from './ui/ControlPanel'
import { deviceManager } from './store'

const App: Component = () => {
  const [connected, setConnected] = createSignal(false)
  const [reconnection, setReconnection] = createSignal(false)

  deviceManager.onConnectionChange = (connected: boolean) => setConnected(connected)
  deviceManager.onReconnectionChange = (reconnecting: boolean) => setReconnection(reconnecting)

  onCleanup(() => {
    deviceManager.onConnectionChange = null
    deviceManager.onReconnectionChange = null
  })

  return (
    <div class="container flex min-h-svh flex-col">
      <Header connected={connected()} reconnection={reconnection()} />
      <div class="mt-4"></div>
      <ControlPanel disabled={!connected()} />
    </div>
  )
}

export default App
