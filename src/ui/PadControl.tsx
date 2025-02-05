import { Component, createEffect, createSignal, onCleanup } from 'solid-js'
import VibeGritGauge, { VibeState } from './VibeGritGauge'
import { deviceManager } from '../store'
import { Smoother } from '../device/processing'

const UPDATE_RATE = 50
const TX_RATE = 25

const VIBE_MAX = 20
const GRIT_MAX = 50

const PadControl: Component = () => {
  const [vibeState, setVibeState] = createSignal<VibeState>('off')
  const [vibe, setVibe] = createSignal(0)
  const [gritEnabled, setGritEnabled] = createSignal(false)
  const [grit, setGrit] = createSignal(0)

  const vibeSmoother = new Smoother(UPDATE_RATE)
  vibeSmoother.boost = 2

  let sendVibe = true

  const intervalSend = setInterval(() => {
    if (sendVibe) {
      deviceManager.sendVibe(vibe())
    } else {
      deviceManager.sendGrit(grit())
    }
    sendVibe = !sendVibe
  }, 1000 / TX_RATE)

  onCleanup(() => clearInterval(intervalSend))

  let time: number | null = null
  let px = 0
  let py = 0
  let px_prev = 0
  let py_prev = 0
  let vx = 0
  let vy = 0

  let angle_prev = 0
  const EXP_BETA_ANGLE = 0.1 / 2

  const onTouchMove = (e: TouchEvent) => {
    px = e.touches[0].clientX
    py = e.touches[0].clientY
    e.preventDefault()
  }

  const interval = setInterval(() => {
    const now = Date.now()
    if (time) {
      const dt = (now - time) / 1000

      vx = (px - px_prev) / dt
      vy = (py - py_prev) / dt

      const V_MAG_STATIC = 10
      if (gritEnabled() && vx * vx + vy * vy > V_MAG_STATIC) {
        const angle = Math.atan(Math.abs(vy / (vx + 0.001))) / (Math.PI / 2)
        angle_prev = angle * EXP_BETA_ANGLE + angle_prev * (1 - EXP_BETA_ANGLE)
        setGrit(Math.round(angle_prev * GRIT_MAX))
      }
    }
    time = now
    px_prev = px
    py_prev = py

    if (vibeState() == 'change') {
      const PIXEL_SCALE = 500 * 1000
      const v_mag = Math.sqrt(vx * vx + vy * vy)
      const vibe_norm = vibeSmoother.update(v_mag / PIXEL_SCALE)
      setVibe(Math.round(vibe_norm * VIBE_MAX))
    } else if (vibeState() == 'off') {
      vibeSmoother.value = 0
      setVibe(0)
    }
  }, 1000 / UPDATE_RATE)
  onCleanup(() => clearInterval(interval))

  createEffect(() => !gritEnabled() && setGrit(0))

  return (
    <div class="flex flex-col px-2">
      <VibeGritGauge
        vibeState={vibeState()}
        vibeValue={vibe()}
        gritEnabled={gritEnabled()}
        gritValue={grit()}
        onGritEnabled={(b) => setGritEnabled(b)}
      />

      <div
        class="mt-8 h-64 touch-none select-none rounded-md border border-slate-900 bg-zinc-700"
        onTouchStart={() => setVibeState('change')}
        onTouchEnd={() => setVibeState('hold')}
        onTouchCancel={() => setVibeState('hold')}
        onClick={() => setVibeState('off')}
        onTouchMove={onTouchMove}
      />

      {/* <button
        disabled={vibeState() == 'off'}
        class={`mt-2 flex-grow select-none rounded bg-red-800 py-2 font-bold text-red-300 backdrop:h-16 disabled:bg-gray-600 disabled:text-gray-500`}
        onClick={() => setVibeState('off')}
      >
        KILL VIBE
      </button> */}
    </div>
  )
}

export default PadControl
