import { Component, createSignal, onCleanup } from 'solid-js'
import { deviceManager } from '../store'
import { send } from 'vite'

interface Props {
  disabled: boolean
}

declare global {
  interface Window {
    Accelerometer: any
    AbsoluteOrientationSensor: any
    LinearAccelerationSensor: any
  }
}

// convert any angle to a value between -180 and 180
function angleNormalize(angle: number) {
  let a = (angle % 360) + 360
  if (a > 180) a = a - 360
  return a
}

function accelerationToText({ x, y, z }: { x: number; y: number; z: number }) {
  return `x: ${x.toFixed(2)} m/s², y: ${y.toFixed(2)} m/s², z: ${z.toFixed(2)} m/s²`
}

function orientationToText({ roll, pitch, yaw }: { roll: number; pitch: number; yaw: number }) {
  return `roll: ${roll.toFixed(2)}°, pitch: ${pitch.toFixed(2)}°, yaw: ${yaw.toFixed(2)}°`
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

// this cmaples the value
function mapClamped(value: number, start1: number, stop1: number, start2: number, stop2: number) {
  const v = start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1))
  return Math.min(Math.max(v, start2), stop2)
}

class VibeSmoother {
  private _s: number

  constructor() {
    this._s = 0
  }

  boost = 1.6
  decay = 0.98

  update(v: number) {
    this._s *= this.decay
    this._s += (v * this.boost) / 100
    this._s = Math.max(0, Math.min(1, this._s))
    return this._s
  }

  get value() {
    return this._s
  }

  set value(v: number) {
    this._s = Math.max(0, Math.min(1, v))
  }
}

const SENSOR_SAMPLE_RATE = 50
const TX_RATE = 26
const VIBE_MAX = 20

const AccelerometerControl: Component<Props> = ({ disabled }) => {
  const [error, setError] = createSignal('')
  // const [acceleration, setAcceleration] = createSignal({ x: 0, y: 0, z: 0 })
  // const [orientation, setOrientation] = createSignal({ roll: 0, pitch: 0, yaw: 0 })
  const [vibe, setVibe] = createSignal(0)
  const [grit, setGrit] = createSignal(0)
  const [gritEnabled, setGritEnabled] = createSignal(false)
  const [vibeState, setVibeState] = createSignal<'off' | 'change' | 'hold'>('off')
  const vibeSmoother = new VibeSmoother()

  let sendVibe = true

  const interval = setInterval(() => {
    if (sendVibe) {
      deviceManager.sendVibe(vibe())
    } else {
      deviceManager.sendCmd('Grit', grit())
    }
    sendVibe = !sendVibe
  }, 1000 / TX_RATE)

  onCleanup(() => {
    clearInterval(interval)
  })

  Promise.all([
    navigator.permissions.query({ name: 'accelerometer' as any }),
    navigator.permissions.query({ name: 'magnetometer' as any }),
    navigator.permissions.query({ name: 'gyroscope' as any }),
  ]).then((results) => {
    if (results.every((result) => result.state === 'granted')) {
      if (
        window.LinearAccelerationSensor === undefined ||
        window.AbsoluteOrientationSensor === undefined
      ) {
        setError((error) => error + 'Accelerometer not supported\n')
      }

      const acceleration = new window.LinearAccelerationSensor({ frequency: SENSOR_SAMPLE_RATE })
      acceleration.addEventListener('reading', () => {
        const { x, y, z } = acceleration
        const MS2_TO_Gs = 9.81
        const a = { x: x / MS2_TO_Gs, y: y / MS2_TO_Gs, z: z / MS2_TO_Gs }
        // setAcceleration(a)

        if (vibeState() == 'change') {
          const vibe = Math.abs(a.x)
          vibeSmoother.update(vibe)
          setVibe(Math.round(vibeSmoother.value * VIBE_MAX))
        } else if (vibeState() == 'off') {
          vibeSmoother.value = 0
          setVibe(0)
        }
      })

      acceleration.addEventListener('error', (event: any) => {
        setError((error) => error + event.error.name + '\n')
      })

      const orientation = new window.AbsoluteOrientationSensor({
        frequency: SENSOR_SAMPLE_RATE,
      })
      orientation.addEventListener('reading', () => {
        const [qw, qx, qy, qz] = orientation.quaternion
        const roll = (Math.atan2(qw * qx + qy * qz, 0.5 - (qx * qx + qy * qy)) / Math.PI) * 180
        const pitch = (Math.asin(2 * (qw * qy - qz * qx)) / Math.PI) * 180
        const yaw = (Math.atan2(qx * qy + qw * qz, 0.5 - (qy * qy + qz * qz)) / Math.PI) * 180
        const o = { roll: -pitch, pitch: -angleNormalize(yaw - 180), yaw: roll }
        // setOrientation(o)

        const grit = gritEnabled() ? pitchToGrit(o.pitch) : 0
        setGrit(grit)
      })

      orientation.addEventListener('error', (event: any) => {
        setError((error) => error + event.error.name + '\n')
      })

      acceleration.start()
      orientation.start()
    } else {
      setError((error) => error + 'Accelerometer permission denied\n')
    }
  })

  return (
    <div class="">
      {/* <div>{accelerationToText(acceleration())}</div> */}
      {/* <div>{orientationToText(orientation())}</div> */}
      <div class="text-red-500">{error()}</div>
      <div class="flex flex-row items-center justify-around gap-x-2">
        <div class="flex flex-row items-center gap-x-2">
          <span
            class={`size-3 rounded-full`}
            classList={{
              'bg-yellow-500': vibeState() == 'hold',
              'bg-gray-500': vibeState() == 'off',
              'bg-purple-500': vibeState() == 'change',
            }}
          ></span>
          <span class="text-2xl text-gray-300">V</span>
          <span class="text-2xl">{vibe().toFixed(0).padStart(2, '0')}</span>
        </div>
        <div class="flex flex-row items-center gap-x-2" onClick={() => setGritEnabled((g) => !g)}>
          <span
            class={`size-3 rounded-full ${gritEnabled() ? 'bg-orange-500' : 'bg-gray-500'}`}
          ></span>
          <span class="text-2xl text-gray-300">G</span>
          <span class="text-2xl">{grit().toFixed(0).padStart(2, '0')}</span>
        </div>
      </div>

      <div class="mx-2 mt-32 flex flex-col items-stretch justify-between gap-y-8">
        <button
          class={`h-32 flex-grow select-none rounded bg-gray-600 py-2 font-bold text-gray-500`}
          onTouchStart={() => setVibeState('change')}
          onTouchEnd={() => setVibeState((s) => (s == 'off' ? 'off' : 'hold'))}
          onTouchCancel={() => setVibeState((s) => (s == 'off' ? 'off' : 'hold'))}
        >
          Touch to Control Vibe
        </button>

        <div class="flex-grow"></div>

        <button
          disabled={vibeState() == 'off'}
          class={`h-16 flex-grow select-none rounded bg-red-800 py-2 font-bold text-red-300 disabled:bg-gray-600 disabled:text-gray-500`}
          onClick={() => setVibeState('off')}
        >
          KILL VIBE
        </button>
      </div>
    </div>
  )
}

export default AccelerometerControl
