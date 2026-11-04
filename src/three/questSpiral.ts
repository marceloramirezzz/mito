import {
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  WebGLRenderer,
  BackSide,
  FrontSide,
  Texture,
} from 'three'
import type { Quest } from '../content'
import { patternTexture, questTexture } from './cardTextures'

const SPIRAL_RADIUS = 3.1
const ANGLE_STEP = 0.74
const Y_STEP = 0.46
const BEND_RADIUS = 2.1
const INTRO_MS = 1500

function bentCard() {
  const geometry = new PlaneGeometry(1.3, 1.87, 18, 1)
  const position = geometry.attributes.position
  for (let i = 0; i < position.count; i++) {
    const x = position.getX(i)
    position.setX(i, BEND_RADIUS * Math.sin(x / BEND_RADIUS))
    position.setZ(i, BEND_RADIUS * Math.cos(x / BEND_RADIUS) - BEND_RADIUS)
  }
  geometry.computeVertexNormals()
  return geometry
}

export type SpiralOptions = {
  canvas: HTMLCanvasElement
  quests: Quest[]
  // 0–1 progress through the pinned hero.
  getProgress: () => number
  reducedMotion: boolean
}

export function createQuestSpiral({ canvas, quests, getProgress, reducedMotion }: SpiralOptions) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const scene = new Scene()
  const camera = new PerspectiveCamera(36, 1, 0.1, 50)
  const spiral = new Group()
  scene.add(spiral)

  const isSmall = window.innerWidth < 720
  const count = isSmall ? 18 : 30
  const span = count * Y_STEP
  const geometry = bentCard()
  const textures: Texture[] = []
  const materials: MeshBasicMaterial[] = []

  const makeMaterial = (map: Texture, side: typeof FrontSide | typeof BackSide | typeof DoubleSide) => {
    const material = new MeshBasicMaterial({ map, side, transparent: true, alphaTest: 0.02 })
    materials.push(material)
    return material
  }

  const patterns = Array.from({ length: 6 }, (_, i) => patternTexture(i))
  const questFaces = quests.map(questTexture)
  textures.push(...patterns, ...questFaces)

  const cards = Array.from({ length: count }, (_, i) => {
    const card = new Group()
    const back = patterns[i % patterns.length]
    if (i % 3 === 0) {
      const front = questFaces[(i / 3) % questFaces.length]
      card.add(new Mesh(geometry, makeMaterial(front, FrontSide)))
      card.add(new Mesh(geometry, makeMaterial(back, BackSide)))
    } else {
      card.add(new Mesh(geometry, makeMaterial(back, DoubleSide)))
    }
    spiral.add(card)
    return card
  })

  const resize = () => {
    const { clientWidth: width, clientHeight: height } = canvas
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.position.set(0, 0, width < 720 ? 19 : 13.5)
    camera.lookAt(0, 0, 0)
    camera.updateProjectionMatrix()
  }
  const observer = new ResizeObserver(resize)
  observer.observe(canvas)
  resize()

  let drag = 0
  let velocity = 0
  let lastX: number | null = null
  const onDown = (event: PointerEvent) => {
    lastX = event.clientX
  }
  const onMove = (event: PointerEvent) => {
    if (lastX === null) return
    velocity = (event.clientX - lastX) * 0.012
    drag += velocity
    lastX = event.clientX
  }
  const onUp = () => {
    lastX = null
  }
  canvas.addEventListener('pointerdown', onDown)
  window.addEventListener('pointermove', onMove)
  window.addEventListener('pointerup', onUp)
  window.addEventListener('pointercancel', onUp)

  let visible = true
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
  })
  visibility.observe(canvas)

  const started = performance.now()
  let frame = 0
  const render = (now: number) => {
    frame = requestAnimationFrame(render)
    if (!visible) return

    const intro = reducedMotion ? 1 : Math.min((now - started) / INTRO_MS, 1)
    const eased = 1 - Math.pow(1 - intro, 4)
    if (lastX === null) {
      drag += velocity
      velocity *= 0.94
    }
    const drift = reducedMotion ? 0 : (now - started) * 0.00012
    const offset = getProgress() * 9 + drag + drift

    cards.forEach((card, i) => {
      const slot = i + offset
      const y = ((slot * Y_STEP) % span + span) % span - span / 2
      const angle = slot * ANGLE_STEP + (1 - eased) * 2.5
      card.position.set(
        Math.sin(angle) * SPIRAL_RADIUS * eased,
        y * eased,
        Math.cos(angle) * SPIRAL_RADIUS * eased,
      )
      card.rotation.y = angle

      const edge = 1 - Math.abs(y) / (span / 2)
      const opacity = Math.min(edge * 5, 1) * eased
      card.children.forEach((face) => {
        ((face as Mesh).material as MeshBasicMaterial).opacity = opacity
      })
    })

    spiral.rotation.z = 0.08
    renderer.render(scene, camera)
  }
  frame = requestAnimationFrame(render)

  return () => {
    cancelAnimationFrame(frame)
    observer.disconnect()
    visibility.disconnect()
    canvas.removeEventListener('pointerdown', onDown)
    window.removeEventListener('pointermove', onMove)
    window.removeEventListener('pointerup', onUp)
    window.removeEventListener('pointercancel', onUp)
    geometry.dispose()
    textures.forEach((texture) => texture.dispose())
    materials.forEach((material) => material.dispose())
    renderer.dispose()
  }
}
