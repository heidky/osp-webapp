import { Component, createEffect, createSignal, onCleanup } from 'solid-js'
import VibeGritGauge, { VibeState } from './VibeGritGauge'
import { deviceManager } from '../store'
import { VibeSmoother } from '../device/processing'

const TX_RATE = 25

const PadControl: Component = () => {
  const [vibeState, setVibeState] = createSignal<VibeState>('off')
  const [vibe, setVibe] = createSignal(0)
  const [gritOn, setGritOn] = createSignal(false)
  const [grit, setGrit] = createSignal(0)

  let vibeSmoother = new VibeSmoother()

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

  let time: number | null = null
  let px = 0
  let py = 0
  let px_prev = 0
  let py_prev = 0
  let vx_prev = 0
  let vy_prev = 0

  let angle_prev = 0
  const angle_beta = 0.1 / 2

  const onTouchMove = (e: TouchEvent) => {
    px = e.touches[0].clientX
    py = e.touches[0].clientY
  }

  const interval2 = setInterval(() => {
    const now = Date.now()
    if (time) {
      const dt = (now - time) / 1000
      //   console.log(dt, x, y)
      let vx = (px - px_prev) / dt
      let vy = (py - py_prev) / dt
      // let ax = (vx - vx_prev) / dt
      // let ay = (vy - vy_prev) / dt

      if (gritOn() && vx * vx + vy * vy > 10) {
        const angle = Math.atan(Math.abs(vy / (vx + 0.001))) / (Math.PI / 2)
        angle_prev = angle * angle_beta + angle_prev * (1 - angle_beta)
        setGrit(Math.round(angle_prev * 50))
      }

      // console.log(angle_prev.toFixed(3))

      vx_prev = vx
      vy_prev = vy
    }
    time = now
    px_prev = px
    py_prev = py

    if (vibeState() == 'change') {
      const v_mag = Math.sqrt(vx_prev * vx_prev + vy_prev * vy_prev)
      const vibe_norm = vibeSmoother.update((v_mag / 1000) * 0.5)
      setVibe(Math.round(vibe_norm * 20))
    } else if (vibeState() == 'off') {
      vibeSmoother.value = 0
      setVibe(0)
    }
  }, 1000 / 60)
  onCleanup(() => clearInterval(interval2))

  createEffect(() => !gritOn() && setGrit(0))

  return (
    <div class="flex flex-col px-2">
      <VibeGritGauge
        vibeState={vibeState()}
        vibeValue={vibe()}
        gritEnabled={gritOn()}
        gritValue={grit()}
        onGritEnabled={(b) => setGritOn(b)}
      />

      <div
        class="mt-8 h-64 rounded-md border border-slate-900 bg-zinc-700"
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
