import { deviceManager } from '../store'
import { Component, createSignal, Match, Switch } from 'solid-js'
import AccelerationControl from './AccelerationControl'
import PadControl from './PadControl'

interface Props {
  disabled: boolean
}

export type ControlType = 'acceleration' | 'pad'

const ControlPanel: Component<Props> = (props) => {
  const [type, setType] = createSignal<ControlType>('pad')

  return (
    <div class="flex flex-col">
      <select
        class="mx-2 mb-8 rounded-md px-2 py-2"
        value={type()}
        on:change={(e) => setType(e.target.value as ControlType)}
      >
        <option value="pad">Pad</option>
        <option value="acceleration">Acceleration</option>
      </select>

      <Switch>
        <Match when={type() == 'acceleration'}>
          <AccelerationControl />
        </Match>

        <Match when={type() == 'pad'}>
          <PadControl />
        </Match>
      </Switch>
    </div>
  )
}

export default ControlPanel
