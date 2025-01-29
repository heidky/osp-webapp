import { createSignal, onCleanup, type Component } from 'solid-js'
import Header from './ui/Header'
import ControlPanel from './ui/ControlPanel'
import { deviceManager } from './store'
import AccelerometerControl from './ui/AccelerometerControl'

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
    <>
      <Header connected={connected()} reconnection={reconnection()} />
      {/* <div class="px-32 py-8">
        <ControlPanel disabled={!connected()} />
      </div> */}
      <AccelerometerControl disabled={!connected()} />
    </>
  )
}

export default App
