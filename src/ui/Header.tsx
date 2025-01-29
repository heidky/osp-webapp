import type { Component } from 'solid-js'
import { deviceManager } from '../store'

interface Props {
    connected: boolean
}

const Header: Component<Props> = (props) => {
    return (
        <header class="p-4">
            <div class="container mx-auto flex items-center justify-between">
                <h1 class="text-3xl font-bold tracking-wider text-white">OSP</h1>
                {props.connected ? (
                    <>
                        <button
                            class="rounded bg-red-500 px-4 py-2 text-white"
                            onclick={() => deviceManager.disconnect()}
                        >
                            Disconnect
                        </button>
                        <span class="text-white">{deviceManager.deviceName}</span>
                    </>
                ) : (
                    <button
                        class="rounded bg-white px-4 py-2 text-blue-500"
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
