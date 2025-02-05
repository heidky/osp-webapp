import { Component, createSignal, For, Index } from 'solid-js'

interface Props {
  title: string
  value: number
  onChange: (v: number) => void
  choices: number[] | string[]
}

const DiscreteSlider: Component<Props> = (p) => {
  const selectedIndex = () => {
    const [dist, idx] = p.choices
      .map((n: any) => Number(n))
      .map((n) => Math.abs(n - p.value))
      .reduce(
        ([distP, idxP], dist, idx) => (dist < distP ? [dist, idx] : [distP, idxP]),
        [Infinity, -1]
      )

    return idx
  }

  return (
    <div class="flex flex-row items-center">
      <h1 class="text-md me-4 block font-bold text-zinc-600">➤ {p.title}</h1>
      <div class="flex flex-grow flex-row justify-stretch gap-x-2">
        <Index each={p.choices}>
          {(item, index) => (
            <button
              class="relative block size-6 flex-grow rounded-md bg-zinc-600 font-bold text-zinc-700 outline-offset-1"
              classList={{ 'outline outline-cyan-700': index == selectedIndex() }}
              onClick={() => p.onChange?.(Number(p.choices[index]))}
            >
              <span>{item()}</span>
            </button>
          )}
        </Index>
      </div>
    </div>
  )
}

export default DiscreteSlider
