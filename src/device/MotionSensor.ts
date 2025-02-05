declare global {
  interface Window {
    Accelerometer: any
    AbsoluteOrientationSensor: any
    LinearAccelerationSensor: any
  }
}

export interface Vector3 {
  x: number
  y: number
  z: number
}

class MotionSensor {
  static SENSOR_SAMPLE_RATE = 50

  accelerationSensor: any = null
  orientationSensor: any = null

  acceleration: Vector3 = { x: 0, y: 0, z: 0 }
  orientation: Vector3 = { x: 0, y: 0, z: 0 }

  constructor() {}

  async start() {
    if (this.accelerationSensor || this.orientationSensor) {
      this._errorHappened('already started')
      return
    }

    const results = await Promise.all([
      navigator.permissions.query({ name: 'accelerometer' as any }),
      navigator.permissions.query({ name: 'magnetometer' as any }),
      navigator.permissions.query({ name: 'gyroscope' as any }),
    ])
    if (results.some((result) => result.state !== 'granted')) {
      this._errorHappened('IMU permissions not granted')
      return
    }
    if (window.LinearAccelerationSensor === undefined) {
      this._errorHappened('no LinearAccelerationSensor')
      return
    }
    if (window.AbsoluteOrientationSensor === undefined) {
      this._errorHappened('no AbsoluteOrientationSensor')
      return
    }

    this.accelerationSensor = new window.LinearAccelerationSensor({
      frequency: MotionSensor.SENSOR_SAMPLE_RATE,
    })
    this.accelerationSensor.addEventListener('reading', () => {
      const MS2_TO_Gs = 9.81
      const { x, y, z } = this.accelerationSensor
      this.acceleration = { x: x / MS2_TO_Gs, y: y / MS2_TO_Gs, z: z / MS2_TO_Gs }
      this.onAcceleration?.(this.acceleration)
    })

    this.accelerationSensor.addEventListener('error', (event: any) => {
      this._errorHappened(`accelererometer error: ${event.error.name}`)
    })

    this.orientationSensor = new window.AbsoluteOrientationSensor({
      frequency: MotionSensor.SENSOR_SAMPLE_RATE,
    })
    this.orientationSensor.addEventListener('reading', () => {
      const [qw, qx, qy, qz] = this.orientationSensor.quaternion
      const roll = (Math.atan2(qw * qx + qy * qz, 0.5 - (qx * qx + qy * qy)) / Math.PI) * 180
      const pitch = (Math.asin(2 * (qw * qy - qz * qx)) / Math.PI) * 180
      const yaw = (Math.atan2(qx * qy + qw * qz, 0.5 - (qy * qy + qz * qz)) / Math.PI) * 180
      this.orientation = { x: -pitch, y: -angleNormalize(yaw - 180), z: roll }
      this.onOrientation?.(this.orientation)
    })

    this.orientationSensor.addEventListener('error', (event: any) => {
      this._errorHappened(`orientation error: ${event.error.name}`)
    })

    this.accelerationSensor.start()
    this.orientationSensor.start()
  }

  async stop() {
    this.accelerationSensor?.stop()
    this.orientationSensor?.stop()
    this.accelerationSensor = null
    this.orientationSensor = null
    this.acceleration = { x: 0, y: 0, z: 0 }
    this.orientation = { x: 0, y: 0, z: 0 }
  }

  onAcceleration: (o: Vector3) => void = null
  onOrientation: (o: Vector3) => void = null
  onError: (errors: string[]) => void = null

  private _errors: string[] = []

  private _errorHappened(msg: string) {
    this._errors.push(msg)
    this.onError?.(this._errors)
  }
}

export default MotionSensor

// convert any angle to a value between -180 and 180
function angleNormalize(angle: number) {
  let a = (angle % 360) + 360
  if (a > 180) a = a - 360
  return a
}
