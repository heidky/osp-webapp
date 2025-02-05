import { Component, createEffect, createRenderEffect, createSignal, onCleanup } from 'solid-js'

export type VibeState = 'off' | 'change' | 'hold'

interface Props {
  vibeState: VibeState
  vibeValue: number
  gritEnabled: boolean
  gritValue: number
  onGritEnabled?: (enabled: boolean) => void
}

const UPDATE_RATE = 10

const VibeGritGauge: Component<Props> = (p) => {
  const [vibe, setVibe] = createSignal(p.vibeValue)
  const [grit, setGrit] = createSignal(p.gritValue)

  const vibeValue = () => p.vibeValue
  const gritValue = () => p.gritValue

  const interval = setInterval(() => {
    setVibe(vibeValue())
    setGrit(gritValue())
  }, 1000 / UPDATE_RATE)
  onCleanup(() => clearInterval(interval))

  return (
    <div class="flex flex-row items-center justify-around gap-x-2">
      <div class="flex flex-row items-center gap-x-2">
        <span
          class="size-3 rounded-full"
          classList={{
            'bg-yellow-500': p.vibeState == 'hold',
            'bg-gray-500': p.vibeState == 'off',
            'bg-purple-500': p.vibeState == 'change',
          }}
        ></span>
        <span class="text-3xl text-gray-400">V</span>
        <span class="font-mono text-4xl font-bold">{vibe().toFixed(0).padStart(2, '0')}</span>
      </div>
      <div
        class="flex flex-row items-center gap-x-2"
        onClick={() => p.onGritEnabled?.(!p.gritEnabled)}
      >
        <span
          class={`size-3 rounded-full ${p.gritEnabled ? 'bg-orange-500' : 'bg-gray-500'}`}
        ></span>
        <span class="text-3xl text-gray-400">G</span>
        <span class="font-mono text-4xl font-bold">{grit().toFixed(0).padStart(2, '0')}</span>
      </div>
    </div>
  )
}

export default VibeGritGauge
