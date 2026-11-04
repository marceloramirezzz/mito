import {
  BufferGeometry,
  CatmullRomCurve3,
  ConeGeometry,
  CylinderGeometry,
  Group,
  IcosahedronGeometry,
  Material,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  TorusGeometry,
  TubeGeometry,
  Vector3,
} from 'three'
import type { TotemId } from '../content'

type V3 = [number, number, number]

// Placeholder Totems built from primitives. To use real art, make buildTotem
// return a loaded model for that id; the stage only needs a Group back.
export function buildTotem(id: TotemId) {
  const totem = new Group()
  const bronze = new MeshStandardMaterial({ color: 0x8f7450, metalness: 0.9, roughness: 0.34, flatShading: true })
  const gold = new MeshStandardMaterial({ color: 0xd2ab5e, metalness: 1, roughness: 0.28, flatShading: true })

  const add = (geometry: BufferGeometry, material: Material, position: V3, scale: V3 = [1, 1, 1], rotation: V3 = [0, 0, 0]) => {
    const mesh = new Mesh(geometry, material)
    mesh.position.set(...position)
    mesh.scale.set(...scale)
    mesh.rotation.set(...rotation)
    totem.add(mesh)
    return mesh
  }
  const blob = () => new IcosahedronGeometry(1, 1)
  const cone = () => new ConeGeometry(1, 1, 5)
  const limb = (position: V3, length: number, radius = 0.09) =>
    add(new CylinderGeometry(radius, radius * 0.7, length, 6), bronze, [position[0], position[1] - length / 2, position[2]])
  const eyes = (x: number, y: number, spread: number, size = 0.05) => {
    for (const z of [spread, -spread]) add(new SphereGeometry(size, 8, 8), gold, [x, y, z])
  }

  // Shared four-legged body; the head sits at +x.
  const quadruped = (length: number, height: number, legs: number, head: V3) => {
    add(blob(), bronze, [0, 0, 0], [length, height, 0.55])
    add(blob(), bronze, [length * 0.95, height * 0.75, 0], [0.42, 0.34, 0.3], [0, 0, 0.7])
    add(blob(), bronze, head, [0.4, 0.36, 0.34])
    for (const x of [length * 0.6, -length * 0.6]) {
      for (const z of [0.3, -0.3]) limb([x, -height * 0.55, z], legs)
    }
  }
  const snout = (head: V3, length: number, radius: number) =>
    add(cone(), bronze, [head[0] + 0.3 + length / 2, head[1] - 0.05, 0], [radius, length, radius], [0, 0, -Math.PI / 2])
  const pointedEars = (head: V3, height: number, radius: number, material: Material = bronze) => {
    for (const z of [0.18, -0.18]) {
      add(cone(), material, [head[0] - 0.05, head[1] + 0.3 + height / 2, z], [radius, height, radius])
    }
  }

  if (id === 'fox') {
    const head: V3 = [1.25, 0.65, 0]
    quadruped(1, 0.5, 0.7, head)
    snout(head, 0.5, 0.15)
    pointedEars(head, 0.4, 0.14)
    eyes(head[0] + 0.25, head[1] + 0.1, 0.17)
    add(blob(), bronze, [-1.35, 0.25, 0], [0.7, 0.28, 0.26], [0, 0, -0.5])
    add(cone(), gold, [-2.05, 0.65, 0], [0.2, 0.4, 0.2], [0, 0, 1.05])
  }

  if (id === 'boar') {
    const head: V3 = [1.2, 0.2, 0]
    quadruped(1.05, 0.75, 0.55, head)
    snout(head, 0.35, 0.2)
    pointedEars(head, 0.2, 0.1)
    eyes(head[0] + 0.25, head[1] + 0.12, 0.17)
    for (const z of [0.2, -0.2]) add(cone(), gold, [head[0] + 0.42, head[1] + 0.02, z], [0.05, 0.32, 0.05], [0, 0, -0.5])
    for (let i = 0; i < 6; i++) add(cone(), gold, [0.65 - i * 0.28, 0.82 - Math.abs(i - 2) * 0.03, 0], [0.09, 0.24, 0.05])
  }

  if (id === 'hare') {
    const head: V3 = [1, 0.75, 0]
    quadruped(0.8, 0.55, 0.45, head)
    snout(head, 0.15, 0.12)
    for (const z of [0.13, -0.13]) add(blob(), bronze, [head[0] - 0.14, head[1] + 0.82, z], [0.11, 0.6, 0.08], [0, 0, 0.14])
    eyes(head[0] + 0.25, head[1] + 0.1, 0.17)
    add(blob(), gold, [-0.92, 0.2, 0], [0.2, 0.2, 0.2])
  }

  if (id === 'stag') {
    const head: V3 = [1.3, 1.05, 0]
    quadruped(1.05, 0.52, 1.05, head)
    add(blob(), bronze, [1.1, 0.6, 0], [0.26, 0.55, 0.22], [0, 0, -0.35])
    snout(head, 0.25, 0.13)
    eyes(head[0] + 0.25, head[1] + 0.1, 0.17)
    for (const z of [0.16, -0.16]) {
      const side = Math.sign(z)
      const beam = new CatmullRomCurve3([
        new Vector3(head[0] - 0.05, head[1] + 0.22, z),
        new Vector3(head[0] - 0.2, head[1] + 0.7, z + side * 0.25),
        new Vector3(head[0] + 0.02, head[1] + 1.25, z + side * 0.42),
      ])
      add(new TubeGeometry(beam, 10, 0.04, 5), gold, [0, 0, 0])
      const a = new Vector3(head[0] - 0.16, head[1] + 0.6, z + side * 0.2)
      for (const [dx, dy] of [[0.4, 0.28], [-0.36, 0.34]]) {
        const tine = new CatmullRomCurve3([a, new Vector3(a.x + dx * 0.5, a.y + dy * 0.7, a.z + side * 0.08), new Vector3(a.x + dx, a.y + dy, a.z + side * 0.14)])
        add(new TubeGeometry(tine, 6, 0.03, 5), gold, [0, 0, 0])
      }
    }
  }

  if (id === 'dog') {
    const head: V3 = [1.15, 0.65, 0]
    quadruped(0.95, 0.52, 0.6, head)
    snout(head, 0.32, 0.17)
    eyes(head[0] + 0.25, head[1] + 0.06, 0.17)
    // Beagle ears: long and hanging.
    for (const z of [0.34, -0.34]) add(blob(), bronze, [head[0] - 0.04, head[1] - 0.14, z], [0.17, 0.38, 0.06])
    add(new SphereGeometry(0.42, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2), gold, [head[0] - 0.02, head[1] + 0.05, 0], [1, 0.9, 0.95])
    add(cone(), gold, [head[0] - 0.02, head[1] + 0.5, 0], [0.05, 0.28, 0.05])
    add(new CylinderGeometry(0.42, 0.42, 0.06, 6), gold, [0.1, -0.02, 0.62], [1, 1, 1.25], [Math.PI / 2, 0, 0])
    add(new CylinderGeometry(0.03, 0.03, 1.2, 5), bronze, [-0.45, 0.65, -0.48], [1, 1, 1], [0.1, 0, 0.5])
    add(cone(), bronze, [-1.05, 0.45, 0], [0.09, 0.55, 0.09], [0, 0, 0.75])
  }

  if (id === 'cat') {
    const head: V3 = [1, 0.62, 0]
    quadruped(0.85, 0.42, 0.62, head)
    snout(head, 0.1, 0.1)
    pointedEars(head, 0.28, 0.14)
    eyes(head[0] + 0.25, head[1] + 0.1, 0.17, 0.06)
    const tail = new CatmullRomCurve3([new Vector3(-0.8, 0.1, 0), new Vector3(-1.25, 0.25, 0), new Vector3(-1.3, 0.85, 0), new Vector3(-1.05, 1.2, 0)])
    add(new TubeGeometry(tail, 14, 0.065, 6), bronze, [0, 0, 0])
    // Bow slung across the back.
    add(new TorusGeometry(0.7, 0.03, 6, 22, Math.PI), gold, [-0.05, 0.4, -0.5], [1, 1, 1], [0, 0, 0.35])
    add(new CylinderGeometry(0.008, 0.008, 1.4, 4), gold, [-0.05, 0.4, -0.5], [1, 1, 1], [0, 0, 1.92])
  }

  if (id === 'owl') {
    add(blob(), bronze, [0, 0, 0], [0.82, 1.12, 0.72])
    add(blob(), bronze, [0, 1.25, 0], [0.72, 0.6, 0.62])
    for (const x of [0.3, -0.3]) {
      add(new CylinderGeometry(0.22, 0.22, 0.04, 12), gold, [x, 1.32, 0.56], [1, 1, 1], [Math.PI / 2, 0, 0])
      add(new SphereGeometry(0.08, 8, 8), bronze, [x, 1.32, 0.6])
      add(cone(), gold, [x * 1.5, 1.88, 0], [0.13, 0.42, 0.1], [0, 0, -x * 1.1])
      add(blob(), bronze, [x * 2.85, 0.02, 0], [0.2, 0.88, 0.48], [0, 0, x * 0.35])
      add(cone(), gold, [x * 0.7, -1.18, 0.34], [0.12, 0.26, 0.2], [Math.PI / 2, 0, 0])
    }
    add(cone(), gold, [0, 1.13, 0.68], [0.08, 0.22, 0.08], [Math.PI, 0, 0])
  }

  if (id === 'heron') {
    add(blob(), bronze, [0, 0.8, 0], [0.82, 0.48, 0.4], [0, 0, 0.2])
    add(cone(), bronze, [-1, 0.45, 0], [0.26, 0.8, 0.16], [0, 0, 1.3])
    for (const z of [0.14, -0.14]) add(new CylinderGeometry(0.035, 0.03, 1.9, 5), gold, [0, -0.5, z])
    const neck = new CatmullRomCurve3([
      new Vector3(0.65, 0.95, 0),
      new Vector3(1.05, 1.45, 0),
      new Vector3(0.72, 1.85, 0),
      new Vector3(1.02, 2.38, 0),
    ])
    add(new TubeGeometry(neck, 22, 0.085, 6), bronze, [0, 0, 0])
    add(blob(), bronze, [1.08, 2.46, 0], [0.22, 0.17, 0.15])
    add(cone(), gold, [1.58, 2.4, 0], [0.065, 0.78, 0.065], [0, 0, -Math.PI / 2 - 0.08])
    add(cone(), gold, [0.68, 2.56, 0], [0.04, 0.55, 0.04], [0, 0, 1.2])
    eyes(1.18, 2.5, 0.12, 0.03)
  }

  return totem
}

export function disposeTotem(totem: Group) {
  totem.traverse((node) => {
    if (node instanceof Mesh) node.geometry.dispose()
  })
  const materials = new Set<Material>()
  totem.traverse((node) => {
    if (node instanceof Mesh) materials.add(node.material as Material)
  })
  materials.forEach((material) => material.dispose())
}
