import { Component, createSignal, onCleanup } from 'solid-js'
import { deviceManager } from '../store'
import MotionSensor, { Vector3 } from '../device/MotionSensor'
import { VibeSmoother } from '../device/processing'
import VibeGritGauge from './VibeGritGauge'

interface Props {
  disabled?: boolean
}

const TX_RATE = 25
const VIBE_MAX = 20

const AccelerationControl: Component<Props> = (p) => {
  const [error, setError] = createSignal('')
  const [vibeState, setVibeState] = createSignal<'off' | 'change' | 'hold'>('off')
  const [vibe, setVibe] = createSignal(0)
  const [gritEnabled, setGritEnabled] = createSignal(false)
  const [grit, setGrit] = createSignal(0)

  const vibeSmoother = new VibeSmoother()
  const motion = new MotionSensor()

  motion.onError = (e) => setError(e.join('\n'))

  motion.onAcceleration = (a: Vector3) => {
    if (vibeState() == 'change') {
      vibeSmoother.update(Math.abs(a.x))
      setVibe(Math.round(vibeSmoother.value * VIBE_MAX))
    } else if (vibeState() == 'off') {
      vibeSmoother.value = 0
      setVibe(0)
    }
  }

  motion.onOrientation = (o: Vector3) => {
    const grit = gritEnabled() ? pitchToGrit(o.y) : 0
    setGrit(grit)
  }

  motion.start()
  onCleanup(() => motion.stop())

  let sendVibe = true

  const interval = setInterval(() => {
    if (sendVibe) {
      deviceManager.sendVibe(vibe())
    } else {
      deviceManager.sendGrit(grit())
    }
    sendVibe = !sendVibe
  }, 1000 / TX_RATE)

  onCleanup(() => clearInterval(interval))

  return (
    <div class="px-2">
      <VibeGritGauge
        vibeState={vibeState()}
        vibeValue={vibe()}
        gritEnabled={gritEnabled()}
        onGritEnabled={(b) => setGritEnabled(b)}
        gritValue={grit()}
      />

      <div class="mt-32 flex flex-col items-stretch justify-between gap-y-8">
        <button
          class={`h-32 flex-grow select-none rounded bg-gray-600 py-2 font-bold text-gray-500`}
          onTouchStart={() => setVibeState('change')}
          onTouchEnd={() => setVibeState((s) => (s == 'off' ? 'off' : 'hold'))}
          onTouchCancel={() => setVibeState((s) => (s == 'off' ? 'off' : 'hold'))}
          disabled={error().length > 0}
        >
          Touch to Control Vibe
        </button>

        <div class="flex-grow"></div>

        <button
          disabled={vibeState() == 'off' || error().length > 0}
          class={`h-16 flex-grow select-none rounded bg-red-800 py-2 font-bold text-red-300 disabled:bg-gray-600 disabled:text-gray-500`}
          onClick={() => setVibeState('off')}
        >
          KILL VIBE
        </button>
      </div>
      <div class="my-5 text-red-500">{error()}</div>
    </div>
  )
}

export default AccelerationControl

function mapClamped(value: number, start1: number, stop1: number, start2: number, stop2: number) {
  const v = start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
  return Math.min(Math.max(v, start2), stop2)
}

function pitchToGrit(pitch: number) {
  const GRIT_MAX = 50
  const ANGLE_MAX = 90
  const ANGLE_DEADZONE = 0

  if (pitch < 0) return 0
  if (pitch > 90) return GRIT_MAX

  let d = Math.min(Math.abs(pitch), ANGLE_MAX)
  return mapClamped(d, ANGLE_DEADZONE, ANGLE_MAX - ANGLE_DEADZONE, 0, GRIT_MAX)
}
