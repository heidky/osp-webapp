import { createEffect, createSignal, type Component } from 'solid-js'
import Header from './ui/Header'
import ControlPanel from './ui/ControlPanel'
import { deviceManager } from './store'

const App: Component = () => {
  const [connected, setConnected] = createSignal(false)
  const [reconnection, setReconnection] = createSignal(false)

  createEffect(() => {
    deviceManager.onConnectionChange = (connected: boolean) => setConnected(connected)
    deviceManager.onReconnectionChange = (reconnecting: boolean) => setReconnection(reconnecting)
    return () => {
      deviceManager.onConnectionChange = null
      deviceManager.onReconnectionChange = null
    }
  })

  return (
    <>
      <Header connected={connected()} reconnection={reconnection()} />
      <div class="px-32 py-8">
        <ControlPanel disabled={!connected()} />
      </div>
    </>
  )
}

export default App
