import { deviceManager } from '../store'
import { Component } from 'solid-js'

interface Props {
    disabled: boolean
}

const ControlPanel: Component<Props> = (props) => {
    const sendVibe = (value: number) => {
        deviceManager.sendVibe(value)
    }

    return (
        <div class="flex space-x-4">
            <button
                class={`px-4 py-2 rounded ${
                    props.disabled ? 'bg-gray-500' : 'bg-blue-500'
                } text-white`}
                onClick={() => sendVibe(10)}
                disabled={props.disabled}
            >
                10
            </button>
            <button
                class={`px-4 py-2 rounded ${
                    props.disabled ? 'bg-gray-500' : 'bg-red-500'
                } text-white`}
                onClick={() => sendVibe(0)}
                disabled={props.disabled}
            >
                0
            </button>
        </div>
    )
}

export default ControlPanel
