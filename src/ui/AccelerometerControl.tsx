import { Component, createSignal } from 'solid-js'

interface Props {
  disabled: boolean
}

declare global {
  interface Window {
    Accelerometer: any
  }
}

const AccelerometerControl: Component<Props> = ({ disabled }) => {
  const [error, setError] = createSignal('')
  const [x, setX] = createSignal('')

  navigator.permissions.query({ name: 'accelerometer' as any }).then((result) => {
    if (result.state === 'denied') {
      setError((error) => error + 'Accelerometer permission denied\n')
    } else if (result.state === 'granted') {
      setX((x) => x + 'Accelerometer permission granted\n')

      if (window.Accelerometer === undefined) {
        setError((error) => error + 'Accelerometer not supported\n')
      }

      const acl = new window.Accelerometer({ frequency: 60 })
      acl.addEventListener('reading', () => {
        setX(`${acl.x.toFixed(3)} ${acl.y.toFixed(3)} ${acl.z.toFixed(3)}`)
      })

      acl.addEventListener('error', (event: any) => {
        setError((error) => error + event.error.name + '\n')
      })

      acl.start()
    }
  })

  return (
    <div class="">
      <div>{x()}</div>
      <div class="text-red-500">{error()}</div>
    </div>
  )
}

export default AccelerometerControl
