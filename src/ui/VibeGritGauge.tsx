import { Component } from 'solid-js'

export type VibeState = 'off' | 'change' | 'hold'

interface Props {
  vibeState: VibeState
  vibeValue: number
  gritEnabled: boolean
  gritValue: number
  onGritEnabled?: (enabled: boolean) => void
}

const VibeGritGauge: Component<Props> = (p) => {
  return (
    <div class="flex flex-row items-center justify-around gap-x-2">
      <div class="flex flex-row items-center gap-x-2">
        <span
          class={`size-3 rounded-full`}
          classList={{
            'bg-yellow-500': p.vibeState == 'hold',
            'bg-gray-500': p.vibeState == 'off',
            'bg-purple-500': p.vibeState == 'change',
          }}
        ></span>
        <span class="text-2xl text-gray-300">V</span>
        <span class="text-2xl">{p.vibeValue.toFixed(0).padStart(2, '0')}</span>
      </div>
      <div
        class="flex flex-row items-center gap-x-2"
        onClick={() => p.onGritEnabled?.(!p.gritEnabled)}
      >
        <span
          class={`size-3 rounded-full ${p.gritEnabled ? 'bg-orange-500' : 'bg-gray-500'}`}
        ></span>
        <span class="text-2xl text-gray-300">G</span>
        <span class="text-2xl">{p.gritValue.toFixed(0).padStart(2, '0')}</span>
      </div>
    </div>
  )
}

export default VibeGritGauge
