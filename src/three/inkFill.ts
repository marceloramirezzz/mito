import { Mesh, NoBlending, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, WebGLRenderer } from 'three'
import { clockScroll, ramp } from '../clock'

// Positions as given by clockScroll.
const INK_START = 1.9
const INK_END = 2.6
// How fast the edge boils while the ink is spreading, per millisecond.
const BOIL_SPEED = 0.0017

const fragmentShader = `
precision highp float;
uniform float uProgress;
uniform float uTime;
uniform float uAspect;
varying vec2 vUv;

float hash(vec2 p) {
  vec3 q = fract(vec3(p.xyx) * 0.1031);
  q += dot(q, q.yzx + 33.33);
  return fract((q.x + q.y) * q.z);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

float fbm(vec2 p) {
  float total = 0.0;
  float amount = 0.5;
  for (int i = 0; i < 5; i++) {
    total += noise(p) * amount;
    p = p * 2.02 + 11.3;
    amount *= 0.5;
  }
  return total / 0.969;
}

void main() {
  vec2 centered = (vUv - 0.5) * vec2(uAspect, 1.0);
  // 0 at the center of the screen, 1 at the corners.
  float reachNeeded = length(centered) / (length(vec2(uAspect, 1.0)) * 0.5);

  vec2 warp = vec2(fbm(vUv * 2.2 + uTime * 0.24), fbm(vUv * 2.2 + 31.7 - uTime * 0.2)) - 0.5;
  vec2 warped = vUv + warp * 0.4;
  float grain = fbm(warped * 4.25 + uTime * 0.14) * 0.6 + fbm(warped * 9.8 - uTime * 0.09) * 0.4;
  // Ridges give thin reaching fingers; low lobes stop the outline reading as a circle.
  float fingers = 1.0 - abs(grain * 2.0 - 1.0);
  float lobes = fbm(warped * 1.28 + 7.0 + uTime * 0.06);
  float field = (grain - 0.5) * 1.4 + (fingers - 0.5) * 0.6 + (lobes - 0.5) * 1.9;

  float reach = uProgress * 1.35 - 0.05;
  // Wild while it spreads, then calm, so the screen ends in clean, hole-free lilac.
  float calm = 1.0 - smoothstep(0.4, 1.0, uProgress);
  float towardEdge = clamp(reachNeeded * 1.8, 0.0, 1.0);
  float coverage = (reach - reachNeeded) + field * 0.82 * max(reach, 0.0) * calm * towardEdge;
  float alpha = smoothstep(-0.01, 0.01, coverage);

  vec3 lilac = vec3(0.941, 0.784, 0.965);
  float settled = smoothstep(0.5, 0.96, uProgress);
  vec3 bright = mix(vec3(1.0, 0.863, 1.0), lilac, settled);
  vec3 deep = mix(vec3(0.604, 0.369, 0.761), lilac, settled);
  float fromCenter = clamp(length(centered) / (max(uAspect, 1.0) * 0.6), 0.0, 1.0);
  vec3 color = fromCenter < 0.5 ? mix(bright, lilac, fromCenter * 2.0) : mix(lilac, deep, (fromCenter - 0.5) * 2.0);
  color *= 1.0 - fbm(vUv * 7.0 + 3.0) * 0.08;
  gl_FragColor = vec4(color * alpha, alpha);
}
`

export type InkFillOptions = {
  canvas: HTMLCanvasElement
  clock: HTMLElement
  reducedMotion: boolean
}

export function createInkFill({ canvas, clock, reducedMotion }: InkFillOptions) {
  const renderer = new WebGLRenderer({ canvas, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

  const material = new ShaderMaterial({
    uniforms: { uProgress: { value: 0 }, uTime: { value: 0 }, uAspect: { value: 1 } },
    vertexShader: 'varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
    fragmentShader,
    blending: NoBlending,
    depthTest: false,
  })
  const geometry = new PlaneGeometry(2, 2)
  const quad = new Mesh(geometry, material)
  quad.frustumCulled = false
  const scene = new Scene()
  scene.add(quad)
  const camera = new OrthographicCamera()

  const resize = () => {
    const { clientWidth: width, clientHeight: height } = canvas
    renderer.setSize(width, height, false)
    material.uniforms.uAspect.value = width / height
  }
  const observer = new ResizeObserver(resize)
  observer.observe(canvas)
  resize()

  let frame = 0
  let last = performance.now()
  let shown = -1
  const render = (now: number) => {
    frame = requestAnimationFrame(render)
    const elapsed = now - last
    last = now
    const progress = ramp(INK_START, INK_END, clockScroll(clock))
    const visible = progress > 0 && clock.getBoundingClientRect().bottom > 0
    canvas.style.visibility = visible ? 'visible' : 'hidden'
    if (!visible) return
    const spreading = progress < 1
    if (!spreading && shown === progress) return
    if (spreading && !reducedMotion) material.uniforms.uTime.value += Math.min(elapsed, 50) * BOIL_SPEED
    material.uniforms.uProgress.value = progress
    shown = progress
    renderer.render(scene, camera)
  }
  frame = requestAnimationFrame(render)

  return () => {
    cancelAnimationFrame(frame)
    observer.disconnect()
    geometry.dispose()
    material.dispose()
    renderer.dispose()
  }
}
