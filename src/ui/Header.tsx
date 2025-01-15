import type { Component } from 'solid-js'
import { deviceManager } from '../store'

interface Props {
    connected: boolean
}

const Header: Component<Props> = (props) => {
    return (
        <header class="bg-blue-500 p-4">
            <div class="container mx-auto flex justify-between items-center">
                <h1 class="text-white text-xl">OSP</h1>
                {props.connected ? (
                    <>
                        <button
                            class="bg-red-500 text-white px-4 py-2 rounded"
                            onclick={() => deviceManager.disconnect()}
                        >
                            Disconnect
                        </button>
                        <span class="text-white">{deviceManager.deviceName}</span>
                    </>
                ) : (
                    <button
                        class="bg-white text-blue-500 px-4 py-2 rounded"
                        onclick={() => deviceManager.connectPrompt()}
                    >
                        Connect
                    </button>
                )}
            </div>
        </header>
    )
}

export default Header
