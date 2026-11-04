import {
  Box3,
  DirectionalLight,
  Group,
  PerspectiveCamera,
  PMREMGenerator,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import type { TotemId } from '../content'
import { buildTotem, disposeTotem } from './totemModels'

const TARGET_HEIGHT = 3.6

export function createTotemStage(canvas: HTMLCanvasElement, reducedMotion: boolean) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const scene = new Scene()
  const environments = new PMREMGenerator(renderer)
  const room = new RoomEnvironment()
  const environment = environments.fromScene(room, 0.04)
  room.dispose()
  scene.environment = environment.texture
  scene.environmentIntensity = 1.1

  const rim = new DirectionalLight(0xffd9a0, 4)
  rim.position.set(-3, 4, -2)
  const key = new DirectionalLight(0xf0c8f6, 1.5)
  key.position.set(3, 2, 4)
  scene.add(rim, key)

  const camera = new PerspectiveCamera(30, 1, 0.1, 40)
  camera.position.set(0, 0.2, 9)
  const pivot = new Group()
  scene.add(pivot)

  const resize = () => {
    const { clientWidth: width, clientHeight: height } = canvas
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.position.z = Math.max(8.6, 10 / camera.aspect)
    camera.updateProjectionMatrix()
  }
  const sizes = new ResizeObserver(resize)
  sizes.observe(canvas)
  resize()

  let current: Group | null = null
  let shownAt = performance.now()
  const setTotem = (id: TotemId) => {
    if (current) {
      pivot.remove(current)
      disposeTotem(current)
    }
    const totem = buildTotem(id)
    const box = new Box3().setFromObject(totem)
    const size = box.getSize(new Vector3())
    const fit = TARGET_HEIGHT / Math.max(size.y, size.x * 0.72)
    totem.scale.setScalar(fit)
    totem.position.copy(box.getCenter(new Vector3()).multiplyScalar(-fit))
    pivot.add(totem)
    current = totem
    shownAt = performance.now()
  }

  let pointer = 0
  const onPointer = (event: PointerEvent) => {
    pointer = event.clientX / window.innerWidth - 0.5
  }
  window.addEventListener('pointermove', onPointer, { passive: true })

  let visible = true
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
  })
  visibility.observe(canvas)

  let frame = 0
  const render = (now: number) => {
    frame = requestAnimationFrame(render)
    if (!visible) return
    const entrance = reducedMotion ? 1 : Math.min((now - shownAt) / 700, 1)
    const eased = 1 - Math.pow(1 - entrance, 3)
    const sway = reducedMotion ? 0 : Math.sin(now * 0.0005) * 0.3
    pivot.rotation.y = -0.65 + sway + pointer * 0.5 + (1 - eased) * 1.2
    pivot.scale.setScalar(0.88 + eased * 0.12)
    renderer.render(scene, camera)
  }
  frame = requestAnimationFrame(render)

  return {
    setTotem,
    dispose() {
      cancelAnimationFrame(frame)
      sizes.disconnect()
      visibility.disconnect()
      window.removeEventListener('pointermove', onPointer)
      if (current) disposeTotem(current)
      environment.dispose()
      environments.dispose()
      renderer.dispose()
    },
  }
}
