import { Show, type Component } from 'solid-js'
import { deviceManager } from '../store'
import { FiBluetooth } from 'solid-icons/fi'
import { IoSettings } from 'solid-icons/io'

const StatusDot = ({ status }) => (
  <div
    class={`${
      {
        on: 'bg-green-400',
        off: 'bg-gray-600',
        wait: 'animate-pulse bg-yellow-400 shadow-lg shadow-yellow-400/50',
      }[status]
    } size-4 shrink-0 rounded-md transition-colors`}
  />
)

const ConnectButton = ({ onClick }) => (
  <button
    class="flex flex-row items-center gap-x-2 rounded-md bg-blue-600 p-1.5 px-3 text-xl text-white hover:bg-opacity-90"
    onClick={onClick}
  >
    <span class="text-sm font-bold tracking-wider text-gray-200">Connect</span> <FiBluetooth />
  </button>
)

const SettingsButton = ({ onClick }) => (
  <button
    class="flex flex-row items-center gap-x-2 rounded-md bg-gray-600 p-1.5 px-3 text-xl text-white hover:bg-opacity-90"
    onClick={onClick}
  >
    {/* <span className="text-sm font-bold text-gray-200 tracking-wider">
        S
      </span>{' '} */}
    <IoSettings />
  </button>
)

interface Props {
  connected: boolean
  reconnection: boolean
}

const Header: Component<Props> = (props) => {
  const goFullscreen = () => {
    document.querySelector('#root').requestFullscreen()
  }

  return (
    <header class="flex select-none flex-row items-center justify-between p-4">
      <div class="container mx-auto flex items-center justify-between">
        <h1 class="text-3xl font-bold tracking-wider text-white" onClick={goFullscreen}>
          OSP
        </h1>

        <Show
          when={props.connected || props.reconnection}
          fallback={<ConnectButton onClick={() => deviceManager.connectPrompt()} />}
        >
          <div class="flex flex-row items-center justify-end gap-x-3">
            <StatusDot status={!props.reconnection ? 'on' : 'wait'} />

            <span
              class={`text-md me-3 ${deviceManager.deviceName ? 'text-gray-400' : 'text-gray-500'}`}
            >
              {deviceManager.deviceName || 'No Device'}
            </span>

            <SettingsButton onClick={() => deviceManager.disconnect()} />
          </div>
        </Show>
      </div>
    </header>
  )
}

export default Header
