import {
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
import { clockScroll } from '../clock'
import type { Quest } from '../content'
import { patternTexture, questTexture } from './cardTextures'

const SPIRAL_RADIUS = 4.2
const SPIRAL_RADIUS_SMALL = 3.3
// One strand: far enough apart per turn that only one near row fits on screen,
// with the far side of the turns above and below showing as two rows behind it.
const TURN_RISE = 5.5
const TURNS = 3
// Radians per millisecond: the near row drifts left, the far rows right.
const SPIN_SPEED = 0.00013
// Cards dim as they climb behind the hero title, and fade where the strand wraps.
const TITLE_FADE_START = 2.3
const TITLE_FADE_END = 4.2
// Below these heights a card starts off screen, for near and far cards.
const NEAR_BOTTOM_EDGE = -3.7
const FAR_BOTTOM_EDGE = -6
const BEND_RADIUS = 2.5
const INTRO_MS = 1500
// Scroll positions in viewport heights: the visible cards merge into a stack as
// Chapter 1's black band arrives, and only the top card is left once it has passed.
const MERGE_START = 0.18
const MERGE_END = 0.72
const COLLAPSE_START = 1.18
const COLLAPSE_END = 1.7
// Positions as given by clockScroll: the card turns once, then travels into the phone
// and rides there until the next chapter's sheet has covered it.
const FLIP_START = 1.95
const FLIP_END = 2.55
const SETTLE_START = 2.15
const SETTLE_END = 2.65
// The top of the card leads the bottom through the turn.
const FLIP_LAG = 0.2
const STACK_SCALE = 1.35
// Sits the spiral below the hero title.
const SPIRAL_DROP = -0.6
const CARD_WIDTH = 1.36
const CARD_HEIGHT = 1.95
const FIELD_OF_VIEW = 36

const clamp01 = (value: number) => Math.min(Math.max(value, 0), 1)
const smooth = (value: number) => value * value * (3 - 2 * value)
const between = (start: number, end: number, value: number) => clamp01((value - start) / (end - start))
const mix = (from: number, to: number, amount: number) => from + (to - from) * amount

function cardGeometry() {
  return new PlaneGeometry(CARD_WIDTH, CARD_HEIGHT, 18, 16)
}

// Curves a card by `bend` (0–1) and turns it about its vertical axis by `flip` (0–1).
function shapeCard(geometry: PlaneGeometry, flat: ArrayLike<number>, bend: number, flip: number) {
  const position = geometry.attributes.position
  for (let i = 0; i < position.count; i++) {
    const flatX = flat[i * 3]
    const y = flat[i * 3 + 1]
    const x = mix(flatX, BEND_RADIUS * Math.sin(flatX / BEND_RADIUS), bend)
    const z = (BEND_RADIUS * Math.cos(flatX / BEND_RADIUS) - BEND_RADIUS) * bend
    const height = y / CARD_HEIGHT + 0.5
    const turn = clamp01((flip - (1 - height) * FLIP_LAG) / (1 - FLIP_LAG)) * Math.PI * 2
    position.setXYZ(i, x * Math.cos(turn) - z * Math.sin(turn), y, x * Math.sin(turn) + z * Math.cos(turn))
  }
  position.needsUpdate = true
}

export type SpiralOptions = {
  canvas: HTMLCanvasElement
  quests: Quest[]
  // The Quest waiting in the phone, which the last card turns out to be.
  clockQuest: number
  problem: HTMLElement
  clock: HTMLElement
  phoneCard: HTMLElement
  reducedMotion: boolean
}

export function createQuestSpiral({ canvas, quests, clockQuest, problem, clock, phoneCard, reducedMotion }: SpiralOptions) {
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

  const scene = new Scene()
  const camera = new PerspectiveCamera(FIELD_OF_VIEW, 1, 0.1, 50)
  const spiral = new Group()
  scene.add(spiral)

  const isSmall = window.innerWidth < 720
  const spiralRadius = isSmall ? SPIRAL_RADIUS_SMALL : SPIRAL_RADIUS
  const cardsPerTurn = isSmall ? 8 : 11
  const count = cardsPerTurn * TURNS
  const angleStep = (Math.PI * 2) / cardsPerTurn
  const turnRise = isSmall ? TURN_RISE * 1.4 : TURN_RISE
  const yStep = turnRise / cardsPerTurn
  const span = count * yStep
  const geometry = cardGeometry()
  const flatCard = Float32Array.from(geometry.attributes.position.array)
  shapeCard(geometry, flatCard, 1, 0)
  // The top card gets its own copy, because it unbends and turns on its own.
  const topGeometry = cardGeometry()
  const textures: Texture[] = []
  const materials: MeshBasicMaterial[] = []

  const makeMaterial = (map: Texture, side: typeof FrontSide | typeof BackSide) => {
    const material = new MeshBasicMaterial({ map, side, transparent: true, alphaTest: 0.02 })
    materials.push(material)
    return material
  }

  const patterns = Array.from({ length: 6 }, (_, i) => patternTexture(i))
  const questFaces = quests.map(questTexture)
  textures.push(...patterns, ...questFaces)

  const cards = Array.from({ length: count }, (_, i) => {
    const card = new Group()
    // Every card faces outward: its quest on the outside, a pattern on the inside.
    card.add(new Mesh(geometry, makeMaterial(questFaces[i % questFaces.length], FrontSide)))
    card.add(new Mesh(geometry, makeMaterial(patterns[i % patterns.length], BackSide)))
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

  let pointerX = 0
  let pointerY = 0
  let tiltX = 0
  let tiltY = 0
  const onMove = (event: PointerEvent) => {
    if (event.pointerType === 'mouse' && !reducedMotion) {
      pointerX = (event.clientX / window.innerWidth) * 2 - 1
      pointerY = (event.clientY / window.innerHeight) * 2 - 1
    }
  }
  window.addEventListener('pointermove', onMove)

  const placeCard = (i: number, offset: number) => {
    const slot = i + offset
    // The half-turn offset puts a near row, not a far one, across the middle.
    const y = ((slot * yStep + turnRise / 2) % span + span) % span - span / 2
    return { y, angle: slot * angleStep }
  }

  // Only the cards on screen when the merge starts take part in it.
  let merging = new Set<number>()
  let topCard = 0
  let behindCard = 1
  const chooseMergingCards = (offset: number) => {
    const onScreen = cards.flatMap((_, i) => {
      const { y, angle } = placeCard(i, offset)
      const facing = Math.cos(angle)
      const bottomEdge = facing > 0 ? NEAR_BOTTOM_EDGE : FAR_BOTTOM_EDGE
      return y < TITLE_FADE_END && y > bottomEdge ? [{ i, facing }] : []
    })
    const nearestFirst = [...onScreen].sort((a, b) => b.facing - a.facing)
    merging = new Set(onScreen.map(({ i }) => i))
    topCard = nearestFirst[0]?.i ?? 0
    behindCard = nearestFirst[1]?.i ?? 1
  }

  const lastCard = questFaces[clockQuest]
  let shapedBend = -1
  let shapedFlip = -1
  const started = performance.now()
  let frame = 0
  const render = (now: number) => {
    frame = requestAnimationFrame(render)
    const viewHeight = canvas.clientHeight
    const scroll = window.scrollY / viewHeight
    const clockAt = clockScroll(clock)
    const covered = clock.getBoundingClientRect().bottom <= 0
    canvas.style.visibility = covered ? 'hidden' : 'visible'
    if (covered) return
    // Chapter 1's band has to cover the cards; the card has to cover the phone.
    // The two never overlap, so swapping the layers can't be seen.
    canvas.style.zIndex = problem.getBoundingClientRect().bottom <= 0 ? '2' : ''

    const merge = smooth(between(MERGE_START, MERGE_END, scroll))
    const collapse = smooth(between(COLLAPSE_START, COLLAPSE_END, scroll))
    const flip = smooth(between(FLIP_START, FLIP_END, clockAt))
    const settle = smooth(between(SETTLE_START, SETTLE_END, clockAt))
    const spread = 1 - merge

    const intro = reducedMotion ? 1 : Math.min((now - started) / INTRO_MS, 1)
    const eased = 1 - Math.pow(1 - intro, 4)
    const offset = reducedMotion ? 0 : -((now - started) * SPIN_SPEED) / angleStep
    if (merge < 0.001 || merging.size === 0) chooseMergingCards(offset)

    const bend = 1 - collapse
    if (bend !== shapedBend || flip !== shapedFlip) {
      shapeCard(topGeometry, flatCard, bend, flip)
      shapedBend = bend
      shapedFlip = flip
    }
    const phoneRect = phoneCard.getBoundingClientRect()

    cards.forEach((card, i) => {
      const placed = placeCard(i, offset)
      const y = placed.y
      const angle = placed.angle + (1 - eased) * 2.5
      // Two quest cards survive the merge: one on top, one peeking out behind it.
      const stackRole = i === topCard ? 'top' : i === behindCard ? 'behind' : null
      const isBehind = stackRole === 'behind'
      const isTop = stackRole === 'top'
      // Separate layers, so the curved cards never cut through each other as they meet.
      const stackDepth = isTop ? 0.6 : isBehind ? 0.3 : -i * 0.06
      card.position.set(
        Math.sin(angle) * spiralRadius * eased * spread + (isBehind ? 0.14 : 0) * merge,
        y * eased * spread + (isBehind ? 0.08 : 0) * merge,
        Math.cos(angle) * spiralRadius * eased * spread + stackDepth * merge,
      )
      card.rotation.y = Math.atan2(Math.sin(angle), Math.cos(angle)) * spread
      card.rotation.z = (isBehind ? -0.05 : 0.015) * merge * (1 - collapse)
      let scale = 1 + (STACK_SCALE - 1) * merge
      if (isTop && settle > 0) {
        const fieldHeight = 2 * (camera.position.z - card.position.z) * Math.tan((FIELD_OF_VIEW / 360) * Math.PI)
        const fieldWidth = fieldHeight * camera.aspect
        const targetX = ((phoneRect.left + phoneRect.width / 2) / canvas.clientWidth - 0.5) * fieldWidth
        const targetY = (0.5 - (phoneRect.top + phoneRect.height / 2) / viewHeight) * fieldHeight
        card.position.x = mix(card.position.x, targetX, settle)
        card.position.y = mix(card.position.y, targetY, settle)
        scale = mix(scale, (phoneRect.width / canvas.clientWidth) * fieldWidth / CARD_WIDTH, settle)
      }
      card.scale.setScalar(isTop ? scale : scale * (1 - collapse))

      const atWrap = Math.min((1 - Math.abs(y) / (span / 2)) * 5, 1)
      const belowTitle = 1 - clamp01((y - TITLE_FADE_START) / (TITLE_FADE_END - TITLE_FADE_START))
      const inStrand = atWrap * belowTitle
      // Cards stay opaque so they never show through each other: they dim to the
      // black page instead of fading.
      const level = (inStrand + (1 - inStrand) * merge) * eased
      const staysInMerge = merge < 0.001 || merging.has(i)
      card.visible = level > 0.01 && staysInMerge && (stackRole !== null || merge < 0.97) && (isTop || collapse < 0.999)
      card.children.forEach((child) => {
        const face = child as Mesh<PlaneGeometry, MeshBasicMaterial>
        face.geometry = isTop ? topGeometry : geometry
        face.material.color.setScalar(level)
      })
      // The stack is behind the band by now, so the swap to the phone's Quest stays hidden.
      const front = (card.children[0] as Mesh<PlaneGeometry, MeshBasicMaterial>).material
      front.map = isTop && collapse > 0 ? lastCard : questFaces[i % questFaces.length]
    })

    // Moving the cursor up and down tips the helix; side to side rolls it.
    tiltX += (pointerX - tiltX) * 0.05
    tiltY += (pointerY - tiltY) * 0.05
    spiral.rotation.set(tiltY * 0.1 * spread, tiltX * 0.06 * spread, -tiltX * 0.08 * spread)
    spiral.position.set(0, SPIRAL_DROP * spread, 0)
    renderer.render(scene, camera)
  }
  frame = requestAnimationFrame(render)

  return () => {
    cancelAnimationFrame(frame)
    observer.disconnect()
    window.removeEventListener('pointermove', onMove)
    canvas.style.zIndex = ''
    geometry.dispose()
    topGeometry.dispose()
    textures.forEach((texture) => texture.dispose())
    materials.forEach((material) => material.dispose())
    renderer.dispose()
  }
}
