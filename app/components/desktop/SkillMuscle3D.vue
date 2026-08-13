<script setup lang="ts">
import * as THREE from 'three'
import { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { useContent } from '@/composables/useContent'
import { sortCompetenceCategories } from '~/data/competence-categories'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const { sections } = useContent()

const categoryOrder = computed(() => sections.value.competences_order ?? [])
const competences = computed(() => sections.value.competences)

const visibleCategories = computed(() =>
  sortCompetenceCategories(categoryOrder.value)
    .map((cat) => ({
      ...cat,
      skills: competences.value[cat.key] ?? [],
      count: (competences.value[cat.key] ?? []).length
    }))
    .filter((cat) => cat.skills.length > 0)
)

const totalSkills = computed(() =>
  visibleCategories.value.reduce((sum, cat) => sum + cat.count, 0)
)

const selectedKey = ref<string | null>(null)

const maxCount = computed(() =>
  Math.max(1, ...visibleCategories.value.map((c) => c.count))
)

const ACCENT_COLORS: Record<string, number> = {
  sky: 0x38bdf8,
  indigo: 0x6366f1,
  emerald: 0x10b981,
  purple: 0xa855f7,
  pink: 0xec4899,
  teal: 0x14b8a6,
  orange: 0xf97316,
  violet: 0x8b5cf6
}

interface MoonRef {
  mesh: THREE.Mesh
  pivot: THREE.Group
  label: CSS2DObject | null
  speed: number
  fixed: boolean
}

interface PlanetSystem {
  categoryKey: string
  pivot: THREE.Group
  planet: THREE.Mesh
  orbitRing: THREE.Mesh
  moons: MoonRef[]
  orbitRadius: number
  orbitSpeed: number
  phase: number
}

let renderer: THREE.WebGLRenderer | null = null
let labelRenderer: CSS2DRenderer | null = null
let scene: THREE.Scene | null = null
let camera: THREE.PerspectiveCamera | null = null
let animationId = 0
let solarGroup: THREE.Group | null = null
let sunMesh: THREE.Mesh | null = null
let sunGlow: THREE.Mesh | null = null
let sunLight: THREE.PointLight | null = null
let starField: THREE.Points | null = null
let galaxyArms: THREE.Points | null = null
let planetSystems: PlanetSystem[] = []
let planetPickTargets: THREE.Object3D[] = []
let targetRotY = 0
let currentRotY = 0
let autoSpin = 0
let frozenGroupRot = 0
let liveOrbitAngles: Record<string, number> = {}
let frozenOrbitAngles: Record<string, number> = {}
const cameraPos = new THREE.Vector3(0, 4.2, 9.5)
const cameraLook = new THREE.Vector3(0, 0, 0)
const cameraTargetPos = new THREE.Vector3(0, 4.2, 9.5)
const cameraTargetLook = new THREE.Vector3(0, 0, 0)
const tempWorld = new THREE.Vector3()

const selectedCategory = computed(() =>
  visibleCategories.value.find((c) => c.key === selectedKey.value) ?? null
)

function createMoonLabel(text: string) {
  const el = document.createElement('div')
  el.className = 'skills-galaxy-moon-label'
  el.textContent = text
  return new CSS2DObject(el)
}

function createPlanetLabel(text: string) {
  const el = document.createElement('div')
  el.className = 'skills-galaxy-planet-label'
  el.textContent = text
  return new CSS2DObject(el)
}

function colorForCategory(key: string, accent: string) {
  const cat = visibleCategories.value.find((c) => c.key === key)
  return ACCENT_COLORS[cat?.accent ?? accent] ?? ACCENT_COLORS.indigo!
}

/** Plus de compétences → planète nettement plus grande */
function getPlanetSize(count: number, isActive: boolean) {
  const ratio = count / maxCount.value
  const base = 0.13 + Math.pow(ratio, 0.72) * 0.42
  return base + (isActive ? 0.05 : 0)
}

function getOrbitRadius(index: number, planetSize: number) {
  return 1.15 + index * 0.55 + planetSize * 0.65
}

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))

function getOrbitPhase(index: number, key: string) {
  const seed = key.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return index * GOLDEN_ANGLE + seed * 0.017
}

function getOrbitTilt(index: number) {
  return Math.sin(index * 1.65 + 0.4) * 0.24
}

function snapshotOrbitAngles() {
  const snap: Record<string, number> = { ...liveOrbitAngles }
  planetSystems.forEach((sys) => {
    snap[sys.categoryKey] = sys.pivot.rotation.y
  })
  return snap
}

function disposeObject3D(obj: THREE.Object3D) {
  obj.traverse((child) => {
    if (child instanceof CSS2DObject) {
      child.element.remove()
    }
    if (child instanceof THREE.Mesh) {
      child.geometry.dispose()
      const mat = child.material
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
      else mat.dispose()
    }
  })
}

function clearSolarSystem() {
  planetSystems.forEach((sys) => {
    solarGroup?.remove(sys.pivot)
    solarGroup?.remove(sys.orbitRing)
    disposeObject3D(sys.pivot)
    disposeObject3D(sys.orbitRing)
  })
  planetSystems = []
  planetPickTargets = []
}

function buildStarField() {
  if (!scene) return

  if (starField) {
    scene.remove(starField)
    starField.geometry.dispose()
    ;(starField.material as THREE.Material).dispose()
  }
  if (galaxyArms) {
    scene.remove(galaxyArms)
    galaxyArms.geometry.dispose()
    ;(galaxyArms.material as THREE.Material).dispose()
  }

  const starCount = 2400
  const starPos = new Float32Array(starCount * 3)
  const starColors = new Float32Array(starCount * 3)
  const palette = [
    new THREE.Color(0xffffff),
    new THREE.Color(0xc4d4ff),
    new THREE.Color(0xfff4c4),
    new THREE.Color(0xa5b4fc)
  ]

  for (let i = 0; i < starCount; i++) {
    const r = 18 + Math.random() * 32
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta)
    starPos[i * 3 + 1] = (Math.random() - 0.5) * 8
    starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)

    const c = palette[Math.floor(Math.random() * palette.length)]!
    starColors[i * 3] = c.r
    starColors[i * 3 + 1] = c.g
    starColors[i * 3 + 2] = c.b
  }

  const starGeo = new THREE.BufferGeometry()
  starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3))
  starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3))
  starField = new THREE.Points(
    starGeo,
    new THREE.PointsMaterial({
      size: 0.045,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      sizeAttenuation: true
    })
  )
  scene.add(starField)

  const armCount = 1600
  const armPos = new Float32Array(armCount * 3)
  for (let i = 0; i < armCount; i++) {
    const t = i / armCount
    const spiral = t * Math.PI * 5
    const radius = 2 + t * 16
    const spread = (Math.random() - 0.5) * 1.4
    armPos[i * 3] = Math.cos(spiral) * radius + spread
    armPos[i * 3 + 1] = (Math.random() - 0.5) * 0.35
    armPos[i * 3 + 2] = Math.sin(spiral) * radius + spread
  }

  galaxyArms = new THREE.Points(
    new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(armPos, 3)),
    new THREE.PointsMaterial({
      color: 0x818cf8,
      size: 0.028,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  )
  galaxyArms.rotation.x = Math.PI * 0.42
  scene.add(galaxyArms)
}

function buildSun() {
  if (!solarGroup) return

  if (sunMesh) {
    solarGroup.remove(sunMesh)
    sunMesh.geometry.dispose()
    ;(sunMesh.material as THREE.Material).dispose()
  }
  if (sunGlow) {
    solarGroup.remove(sunGlow)
    sunGlow.geometry.dispose()
    ;(sunGlow.material as THREE.Material).dispose()
  }

  const strength = Math.min(1, totalSkills.value / 40)

  sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.38 + strength * 0.1, 32, 32),
    new THREE.MeshStandardMaterial({
      color: 0xffd166,
      emissive: 0xff9500,
      emissiveIntensity: 1.1 + strength * 0.5,
      metalness: 0.2,
      roughness: 0.35
    })
  )
  solarGroup.add(sunMesh)

  sunGlow = new THREE.Mesh(
    new THREE.SphereGeometry(0.62 + strength * 0.14, 32, 32),
    new THREE.MeshBasicMaterial({
      color: 0xffb347,
      transparent: true,
      opacity: 0.14,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    })
  )
  solarGroup.add(sunGlow)

  if (sunLight) sunLight.intensity = 2.4 + strength * 1.2
}

function buildPlanets(categories: typeof visibleCategories.value) {
  if (!solarGroup) return
  clearSolarSystem()

  categories.forEach((cat, index) => {
    const color = colorForCategory(cat.key, cat.accent)
    const isActive = selectedKey.value === cat.key
    const dimmed = selectedKey.value !== null && !isActive
    const planetSize = getPlanetSize(cat.count, isActive)
    const orbitRadius = getOrbitRadius(index, planetSize)
    const orbitSpeed = 0.09 / (1 + index * 0.22)
    const phase = getOrbitPhase(index, cat.key)
    const tilt = getOrbitTilt(index)

    const orbitOpacity = isActive ? 0.65 : dimmed ? 0.06 : 0.14 + (cat.count / maxCount.value) * 0.12
    const orbitRing = new THREE.Mesh(
      new THREE.TorusGeometry(orbitRadius, 0.004, 8, 128),
      new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: orbitOpacity
      })
    )
    orbitRing.rotation.x = Math.PI / 2 + tilt
    orbitRing.userData.categoryKey = cat.key
    orbitRing.userData.pickable = false
    solarGroup!.add(orbitRing)

    const pivot = new THREE.Group()
    pivot.rotation.x = tilt
    const savedAngle = selectedKey.value
      ? frozenOrbitAngles[cat.key]
      : liveOrbitAngles[cat.key]
    if (savedAngle !== undefined) pivot.rotation.y = savedAngle
    solarGroup!.add(pivot)

    const planet = new THREE.Mesh(
      new THREE.SphereGeometry(planetSize, 24, 24),
      new THREE.MeshStandardMaterial({
        color,
        emissive: color,
        emissiveIntensity: isActive ? 0.95 : dimmed ? 0.08 : 0.28,
        metalness: 0.55,
        roughness: 0.35,
        transparent: dimmed,
        opacity: dimmed ? 0.35 : 1
      })
    )
    planet.position.x = orbitRadius
    planet.userData.categoryKey = cat.key
    planet.userData.pickable = true
    pivot.add(planet)

    const pickSphere = new THREE.Mesh(
      new THREE.SphereGeometry(planetSize * 2.2, 12, 12),
      new THREE.MeshBasicMaterial({ visible: false })
    )
    pickSphere.userData.categoryKey = cat.key
    pickSphere.userData.pickable = true
    planet.add(pickSphere)
    planetPickTargets.push(pickSphere, planet)

    if (isActive) {
      const planetLabel = createPlanetLabel(cat.label)
      planetLabel.position.set(0, planetSize + 0.22, 0)
      planet.add(planetLabel)
    }

    if (cat.count >= 4) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(planetSize * 1.55, 0.008, 6, 64),
        new THREE.MeshBasicMaterial({
          color,
          transparent: true,
          opacity: isActive ? 0.5 : 0.22
        })
      )
      ring.rotation.x = Math.PI / 2.3
      ring.userData.pickable = false
      planet.add(ring)
    }

    const moons: MoonRef[] = []
    cat.skills.forEach((skill, skillIndex) => {
      const moonPivot = new THREE.Group()
      planet.add(moonPivot)

      let moonRadius: number
      if (isActive) {
        moonRadius = planetSize + 0.42 + Math.floor(skillIndex / 8) * 0.18
        moonPivot.rotation.y = 0
        moonPivot.position.set(0, 0, 0)
      } else {
        moonRadius = planetSize + 0.14 + (skillIndex % 3) * 0.06
        moonPivot.rotation.y = (skillIndex / cat.skills.length) * Math.PI * 2
      }

      const moon = new THREE.Mesh(
        new THREE.SphereGeometry(isActive ? 0.055 : 0.032, 14, 14),
        new THREE.MeshStandardMaterial({
          color: 0xe2e8f0,
          emissive: color,
          emissiveIntensity: isActive ? 1.1 : dimmed ? 0.1 : 0.35,
          metalness: 0.4,
          roughness: 0.4,
          transparent: dimmed,
          opacity: dimmed ? 0.25 : 1
        })
      )

      if (isActive) {
        const angle = (skillIndex / cat.skills.length) * Math.PI * 2 - Math.PI / 2
        moon.position.set(
          Math.cos(angle) * moonRadius,
          Math.sin(angle * 2) * 0.06,
          Math.sin(angle) * moonRadius
        )
      } else {
        moon.position.x = moonRadius
      }

      moon.userData.categoryKey = cat.key
      moon.userData.skillName = skill
      moon.userData.pickable = isActive
      moonPivot.add(moon)

      let label: CSS2DObject | null = null
      if (isActive) {
        label = createMoonLabel(skill)
        label.position.set(0, 0.1, 0)
        moon.add(label)
      }

      moons.push({
        mesh: moon,
        pivot: moonPivot,
        label,
        speed: 0.35 + (skillIndex % 5) * 0.08,
        fixed: isActive
      })
    })

    planetSystems.push({
      categoryKey: cat.key,
      pivot,
      planet,
      orbitRing,
      moons,
      orbitRadius,
      orbitSpeed,
      phase
    })
  })
}

function selectCategory(key: string) {
  const snap = snapshotOrbitAngles()

  if (selectedKey.value === key) {
    selectedKey.value = null
    frozenOrbitAngles = {}
    liveOrbitAngles = snap
  } else {
    if (solarGroup) frozenGroupRot = solarGroup.rotation.y
    frozenOrbitAngles = snap
    selectedKey.value = key
  }

  buildPlanets(visibleCategories.value)
}

function resetExplorer() {
  selectedKey.value = null
  frozenOrbitAngles = {}
  liveOrbitAngles = {}
  targetRotY = 0
  currentRotY = 0
  autoSpin = 0
  frozenGroupRot = 0

  cameraPos.set(0, 4.2, 9.5)
  cameraLook.set(0, 0, 0)
  cameraTargetPos.set(0, 4.2, 9.5)
  cameraTargetLook.set(0, 0, 0)

  if (solarGroup) solarGroup.rotation.y = 0

  buildPlanets(visibleCategories.value)
}

function initThree() {
  if (!canvasRef.value || !containerRef.value) return

  const width = containerRef.value.clientWidth
  const height = containerRef.value.clientHeight

  scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0x020617, 0.028)

  camera = new THREE.PerspectiveCamera(44, width / height, 0.1, 120)
  camera.position.set(0, 4.2, 9.5)

  renderer = new THREE.WebGLRenderer({
    canvas: canvasRef.value,
    antialias: true,
    alpha: true
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.outputColorSpace = THREE.SRGBColorSpace

  labelRenderer = new CSS2DRenderer()
  labelRenderer.setSize(width, height)
  const labelsEl = labelRenderer.domElement
  labelsEl.className = 'skills-galaxy__labels-layer'
  labelsEl.style.pointerEvents = 'none'
  labelsEl.style.zIndex = '2'
  containerRef.value.appendChild(labelsEl)

  solarGroup = new THREE.Group()
  scene.add(solarGroup)

  scene.add(new THREE.AmbientLight(0x1e1b4b, 0.35))

  sunLight = new THREE.PointLight(0xffb347, 2.8, 40)
  sunLight.position.set(0, 0, 0)
  solarGroup.add(sunLight)

  const fill = new THREE.DirectionalLight(0x6366f1, 0.45)
  fill.position.set(-6, 4, -4)
  scene.add(fill)

  buildStarField()
  buildSun()
  buildPlanets(visibleCategories.value)
  animate()
}

function updateCameraTargets(t: number) {
  if (selectedKey.value) {
    const sys = planetSystems.find((s) => s.categoryKey === selectedKey.value)
    if (sys) {
      sys.planet.getWorldPosition(tempWorld)
      const spread = Math.max(1.5, 0.9 + Math.sqrt(sys.moons.length) * 0.38)
      const side = Math.sin(t * 0.25) * 0.15
      cameraTargetPos.set(
        tempWorld.x + side,
        tempWorld.y + spread * 0.42,
        tempWorld.z + spread
      )
      cameraTargetLook.copy(tempWorld)
      return
    }
  }

  cameraTargetPos.set(
    Math.sin(currentRotY * 0.45) * 1.2,
    4 + Math.sin(t * 0.35) * 0.15,
    9.5 + Math.cos(currentRotY * 0.45) * 0.8
  )
  cameraTargetLook.set(0, 0, 0)
}

function animate() {
  if (!scene || !renderer || !camera || !solarGroup) return

  const t = Date.now() * 0.001
  const isZoomed = selectedKey.value !== null

  if (isZoomed) {
    solarGroup.rotation.y = frozenGroupRot
  } else {
    autoSpin += 0.0012
    currentRotY += (targetRotY - currentRotY) * 0.035
    solarGroup.rotation.y = autoSpin + currentRotY
  }

  if (sunMesh) {
    sunMesh.rotation.y += 0.003
    const pulse = 1 + Math.sin(t * 1.8) * 0.04
    sunMesh.scale.setScalar(isZoomed ? pulse * 0.85 : pulse)
  }
  if (sunGlow) {
    sunGlow.scale.setScalar((1 + Math.sin(t * 1.2) * 0.06) * (isZoomed ? 0.7 : 1))
  }

  planetSystems.forEach((sys) => {
    if (isZoomed) {
      const frozen = frozenOrbitAngles[sys.categoryKey]
      if (frozen !== undefined) sys.pivot.rotation.y = frozen
    } else {
      sys.pivot.rotation.y = sys.phase + t * sys.orbitSpeed
      liveOrbitAngles[sys.categoryKey] = sys.pivot.rotation.y
    }

    if (!isZoomed) {
      sys.orbitRing.rotation.z = t * 0.05 * (sys.orbitSpeed / 0.09)
    }

    sys.moons.forEach((moon) => {
      if (!moon.fixed) {
        moon.pivot.rotation.y += moon.speed * 0.012
      }
    })
  })

  if (starField) starField.rotation.y += isZoomed ? 0.00004 : 0.00015
  if (galaxyArms) galaxyArms.rotation.z += isZoomed ? 0.00006 : 0.00025

  updateCameraTargets(t)
  const lerp = isZoomed ? 0.07 : 0.045
  cameraPos.lerp(cameraTargetPos, lerp)
  cameraLook.lerp(cameraTargetLook, lerp)
  camera.position.copy(cameraPos)
  camera.lookAt(cameraLook)

  renderer.render(scene, camera)
  labelRenderer?.render(scene, camera)
  animationId = requestAnimationFrame(animate)
}

function pickObject(e: MouseEvent): THREE.Object3D | null {
  if (!camera || !canvasRef.value || !scene) return null

  scene.updateMatrixWorld(true)

  const rect = canvasRef.value.getBoundingClientRect()
  if (!rect.width || !rect.height) return null

  const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
  const y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  const raycaster = new THREE.Raycaster()
  raycaster.setFromCamera(new THREE.Vector2(x, y), camera)

  const hits = raycaster.intersectObjects(planetPickTargets, false)
  return hits[0]?.object ?? null
}

function resolveCategoryFromHit(hit: THREE.Object3D | null): string | undefined {
  if (!hit) return undefined
  let node: THREE.Object3D | null = hit
  while (node) {
    const key = node.userData.categoryKey as string | undefined
    if (key) return key
    node = node.parent
  }
  return undefined
}

function onMouseMove(e: MouseEvent) {
  if (!containerRef.value || selectedKey.value) return
  const rect = containerRef.value.getBoundingClientRect()
  targetRotY = ((e.clientX - rect.left) / rect.width - 0.5) * 1.4
}

function onClick(e: MouseEvent) {
  const hit = pickObject(e)
  const cat = resolveCategoryFromHit(hit)
  if (cat) selectCategory(cat)
}

function onResize() {
  if (!containerRef.value || !renderer || !camera) return
  const w = containerRef.value.clientWidth
  const h = containerRef.value.clientHeight
  camera.aspect = w / h
  camera.updateProjectionMatrix()
  renderer.setSize(w, h)
  labelRenderer?.setSize(w, h)
}

watch(visibleCategories, () => {
  if (scene) {
    buildSun()
    buildPlanets(visibleCategories.value)
  }
}, { deep: true })

onMounted(() => {
  initThree()
  window.addEventListener('resize', onResize)
  containerRef.value?.addEventListener('mousemove', onMouseMove)
  containerRef.value?.addEventListener('click', onClick)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', onResize)
  containerRef.value?.removeEventListener('mousemove', onMouseMove)
  containerRef.value?.removeEventListener('click', onClick)
  labelRenderer?.domElement.remove()
  clearSolarSystem()
  if (sunMesh && solarGroup) {
    solarGroup.remove(sunMesh)
    sunMesh.geometry.dispose()
    ;(sunMesh.material as THREE.Material).dispose()
  }
  if (sunGlow && solarGroup) {
    solarGroup.remove(sunGlow)
    sunGlow.geometry.dispose()
    ;(sunGlow.material as THREE.Material).dispose()
  }
  if (starField && scene) {
    scene.remove(starField)
    starField.geometry.dispose()
    ;(starField.material as THREE.Material).dispose()
  }
  if (galaxyArms && scene) {
    scene.remove(galaxyArms)
    galaxyArms.geometry.dispose()
    ;(galaxyArms.material as THREE.Material).dispose()
  }
  renderer?.dispose()
})
</script>

<template>
  <div class="skills-galaxy flex flex-col lg:flex-row h-full min-h-[520px]">
    <div ref="containerRef" class="skills-galaxy__canvas flex-1 relative min-h-[400px]">
      <canvas ref="canvasRef" class="skills-galaxy__canvas-el absolute inset-0 w-full h-full" />

      <div class="skills-galaxy__hud absolute top-4 left-4 z-10 pointer-events-none">
        <p class="skills-galaxy__hud-label">
          {{ selectedKey ? 'Exploration planétaire' : 'Galaxie compétences' }}
        </p>
        <p class="skills-galaxy__hud-value">{{ totalSkills }}</p>
        <p class="skills-galaxy__hud-sub">
          <template v-if="selectedCategory">
            {{ selectedCategory.label }} · {{ selectedCategory.count }} compétences
          </template>
          <template v-else>
            {{ visibleCategories.length }} planètes · {{ totalSkills }} satellites
          </template>
        </p>
      </div>

      <p class="absolute bottom-3 left-3 z-10 text-[10px] text-amber-200/35 tracking-wide pointer-events-none">
        {{ selectedKey ? 'Chaque lune affiche une compétence' : 'Clic sur une planète pour zoomer' }}
      </p>
    </div>

    <aside class="skills-galaxy__panel w-full lg:w-72 xl:w-80 shrink-0 border-t lg:border-t-0 lg:border-l border-white/10 p-4 overflow-y-auto">
      <h3 class="text-sm font-bold text-white mb-0.5">Carte stellaire</h3>
      <p class="text-[11px] text-white/45 mb-4">
        Chaque planète est un domaine — ses lunes sont vos compétences
      </p>

      <ul class="space-y-2.5">
        <li
          v-for="(cat, index) in visibleCategories"
          :key="cat.key"
          class="skills-galaxy__card rounded-xl p-3 cursor-pointer transition-all border"
          :class="
            selectedKey === cat.key
              ? 'skills-galaxy__card--active border-amber-300/40 bg-amber-500/10'
              : 'border-white/8 bg-white/[0.04] hover:bg-white/[0.07]'
          "
          @click="selectCategory(cat.key)"
        >
          <div class="flex items-center justify-between mb-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <span class="text-sm shrink-0" aria-hidden="true">{{ ['☿', '♀', '⊕', '♂', '♃', '♄', '♅', '♆'][index] ?? '🪐' }}</span>
              <span
                class="skills-galaxy__swatch shrink-0"
                :class="`bg-gradient-to-br ${cat.gradient}`"
              />
              <span class="text-xs font-semibold text-white truncate">{{ cat.label }}</span>
            </div>
            <span class="text-[10px] text-amber-200/80 tabular-nums font-bold">{{ cat.count }}</span>
          </div>
          <p class="text-[10px] text-white/40 mb-2 leading-snug">{{ cat.description }}</p>
          <div class="h-1 rounded-full bg-white/10 overflow-hidden">
            <div
              class="h-full rounded-full transition-all duration-500"
              :class="`bg-gradient-to-r ${cat.gradient}`"
              :style="{ width: `${(cat.count / maxCount) * 100}%` }"
            />
          </div>
          <div class="flex flex-wrap gap-1 mt-2.5">
            <span
              v-for="skill in cat.skills"
              :key="skill"
              class="text-[9px] px-1.5 py-0.5 rounded-md border transition-colors"
              :class="
                selectedKey === cat.key
                  ? 'border-white/20 bg-white/12 text-white/85'
                  : 'border-white/8 bg-white/5 text-white/55'
              "
            >
              {{ skill }}
            </span>
          </div>
        </li>
      </ul>
    </aside>
  </div>
</template>

<style scoped>
.skills-galaxy__canvas {
  background:
    radial-gradient(ellipse 70% 55% at 50% 45%, rgba(255, 180, 70, 0.12), transparent 55%),
    radial-gradient(ellipse 90% 70% at 20% 80%, rgba(99, 102, 241, 0.14), transparent 50%),
    radial-gradient(ellipse 60% 50% at 85% 15%, rgba(168, 85, 247, 0.1), transparent 45%),
    linear-gradient(180deg, #020617 0%, #0b1024 45%, #030712 100%);
  cursor: grab;
}

.skills-galaxy__canvas:active {
  cursor: grabbing;
}

.skills-galaxy__canvas-el {
  z-index: 1;
}

.skills-galaxy__hud-label {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.14em;
  color: rgba(253, 230, 138, 0.7);
  font-weight: 600;
}

.skills-galaxy__hud-value {
  font-size: 2rem;
  font-weight: 800;
  line-height: 1.1;
  background: linear-gradient(135deg, #fde68a, #fbbf24, #a78bfa);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.skills-galaxy__hud-sub {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.35);
  margin-top: 2px;
}

.skills-galaxy__panel {
  background: rgba(3, 7, 18, 0.9);
  backdrop-filter: blur(16px);
}

.skills-galaxy__swatch {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(251, 191, 36, 0.35);
}

.skills-galaxy__card--active {
  box-shadow: 0 0 24px rgba(251, 191, 36, 0.1);
}

.skills-galaxy__labels-layer * {
  pointer-events: none !important;
}
</style>

<style>
.skills-galaxy__labels-layer {
  position: absolute;
  inset: 0;
  pointer-events: none !important;
  overflow: hidden;
  z-index: 2;
}

.skills-galaxy-moon-label {
  font-size: 10px;
  font-weight: 600;
  color: #fff;
  background: rgba(2, 6, 23, 0.82);
  padding: 3px 8px;
  border-radius: 6px;
  border: 1px solid rgba(253, 230, 138, 0.35);
  white-space: nowrap;
  transform: translate(-50%, -120%);
  box-shadow: 0 0 12px rgba(251, 191, 36, 0.2);
  letter-spacing: 0.02em;
}

.skills-galaxy-planet-label {
  font-size: 12px;
  font-weight: 700;
  color: #fde68a;
  background: rgba(2, 6, 23, 0.75);
  padding: 4px 12px;
  border-radius: 999px;
  border: 1px solid rgba(253, 230, 138, 0.45);
  white-space: nowrap;
  transform: translate(-50%, -50%);
  box-shadow: 0 0 20px rgba(251, 191, 36, 0.25);
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
</style>
