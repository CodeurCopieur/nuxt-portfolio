import { defineStore } from 'pinia'
import {
  DESKTOP_APPS,
  getDesktopApp,
  type DesktopAppId
} from '~/data/desktop-apps'
import { useGamificationStore } from '@/store/useGamification'
import { buildMapPins, findPinById } from '~/utils/experience-map'
import {
  buildCustomWallpaperBackground,
  DEFAULT_WALLPAPER_ID,
  getWallpaperById
} from '~/data/desktop-wallpapers'

const BOOT_KEY = 'widdy-os-booted'
const WALLPAPER_KEY = 'widdy-os-wallpaper'

export interface DesktopWindow {
  id: string
  appId: DesktopAppId
  title: string
  icon: string
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  minimized: boolean
  maximized: boolean
  payload?: { slug?: string; pinId?: string }
}

let windowCounter = 0

function nextId() {
  windowCounter += 1
  return `win-${windowCounter}-${Date.now()}`
}

export const useDesktopStore = defineStore('desktop', () => {
  const booted = ref(false)
  const booting = ref(false)
  const windows = ref<DesktopWindow[]>([])
  const topZ = ref(10)
  const focusedId = ref<string | null>(null)
  const parcoursCommuteOpen = ref(true)
  const parcoursPinSelected = ref(false)
  const parcoursCommuteKey = ref(0)
  const wallpaperId = ref(DEFAULT_WALLPAPER_ID)
  const customWallpaperColor = ref('#2d1b69')

  const wallpaperStyle = computed(() => {
    if (wallpaperId.value === 'custom') {
      return { background: buildCustomWallpaperBackground(customWallpaperColor.value) }
    }
    const preset = getWallpaperById(wallpaperId.value)
    return { background: preset?.background ?? getWallpaperById(DEFAULT_WALLPAPER_ID)!.background }
  })

  function persistWallpaper() {
    if (!import.meta.client) return
    localStorage.setItem(
      WALLPAPER_KEY,
      JSON.stringify({
        id: wallpaperId.value,
        customColor: customWallpaperColor.value
      })
    )
  }

  function hydrateWallpaper() {
    if (!import.meta.client) return
    try {
      const raw = localStorage.getItem(WALLPAPER_KEY)
      if (!raw) return
      const saved = JSON.parse(raw) as { id?: string; customColor?: string }
      if (saved.id) wallpaperId.value = saved.id
      if (saved.customColor) customWallpaperColor.value = saved.customColor
    } catch {
      /* ignore */
    }
  }

  function setWallpaper(id: string) {
    wallpaperId.value = id
    persistWallpaper()
  }

  function setCustomWallpaperColor(color: string) {
    customWallpaperColor.value = color
    wallpaperId.value = 'custom'
    persistWallpaper()
  }

  const parcoursWindowVisible = computed(() =>
    windows.value.some((w) => w.appId === 'parcours' && !w.minimized)
  )

  const parcoursCommuteActive = computed(
    () => parcoursWindowVisible.value && parcoursCommuteOpen.value && !parcoursPinSelected.value
  )

  function resetParcoursCommute() {
    parcoursCommuteOpen.value = true
    parcoursPinSelected.value = false
    parcoursCommuteKey.value += 1
  }

  function dismissParcoursCommute() {
    parcoursCommuteOpen.value = false
  }

  function setParcoursPinSelected(selected: boolean) {
    parcoursPinSelected.value = selected
  }

  function hydrateBoot() {
    if (!import.meta.client) return
    booted.value = sessionStorage.getItem(BOOT_KEY) === '1'
  }

  async function boot() {
    if (booted.value || booting.value) return
    booting.value = true
    await new Promise((r) => setTimeout(r, 2200))
    booted.value = true
    booting.value = false
    sessionStorage.setItem(BOOT_KEY, '1')
    const gamification = useGamificationStore()
    gamification.hydrate()
    gamification.visitZone('home')
  }

  function logout() {
    booted.value = false
    booting.value = false
    windows.value = []
    focusedId.value = null
    sessionStorage.removeItem(BOOT_KEY)
  }

  function cascadeOffset(index: number) {
    return { x: 120 + index * 28, y: 40 + index * 28 }
  }

  function focusWindow(id: string) {
    topZ.value += 1
    const win = windows.value.find((w) => w.id === id)
    if (win) {
      win.zIndex = topZ.value
      win.minimized = false
      focusedId.value = id
    }
  }

  function triggerGamification(appId: DesktopAppId, payload?: { slug?: string; pinId?: string }) {
    const gamification = useGamificationStore()
    gamification.hydrate()

    if (appId === 'about') {
      gamification.visitZone('home')
      gamification.discoverHomeSection('projects')
      gamification.discoverHomeSection('experiences')
    } else if (appId === 'parcours') {
      gamification.visitZone('parcours')
    } else if (appId === 'skills') {
      gamification.visitZone('home')
      gamification.discoverHomeSection('skills')
    } else if (appId === 'projets') {
      gamification.visitZone('projets')
    } else if (appId === 'mail') {
      gamification.visitZone('contact')
    } else if (appId === 'project' && payload?.slug) {
      gamification.visitZone('projets')
      try {
        const { sections } = useContent()
        gamification.viewProject(payload.slug, sections.value.projets.length)
      } catch {
        gamification.viewProject(payload.slug, 0)
      }
    }
  }

  function getInitialWindowBounds(appId: DesktopAppId, def: ReturnType<typeof getDesktopApp>, index: number) {
    const offset = cascadeOffset(index)

    if (import.meta.client && appId === 'experience') {
      const expIndex = windows.value.filter((w) => w.appId === 'experience').length
      return {
        x: offset.x + 160 + expIndex * 28,
        y: offset.y + 48 + expIndex * 28,
        width: def.defaultWidth,
        height: def.defaultHeight
      }
    }

    if (import.meta.client && (appId === 'parcours' || appId === 'skills' || appId === 'projets')) {
      const menuBar = 28
      const dockArea = 96
      const margin = 20
      const maxWidth = 1320
      const maxHeight = appId === 'parcours' ? 900 : 920
      const width = Math.max(def.minWidth, Math.min(window.innerWidth - margin * 2, maxWidth))
      const height = Math.max(
        def.minHeight,
        Math.min(window.innerHeight - menuBar - dockArea - margin * 2, maxHeight)
      )
      return {
        x: Math.max(margin, Math.round((window.innerWidth - width) / 2)),
        y: Math.max(menuBar + margin, Math.round((window.innerHeight - dockArea - height) / 2)),
        width,
        height
      }
    }

    return {
      x: offset.x,
      y: offset.y,
      width: def.defaultWidth,
      height: def.defaultHeight
    }
  }

  function openApp(appId: DesktopAppId, payload?: { slug?: string; pinId?: string }) {
    if (appId === 'project' && payload?.slug) {
      const existing = windows.value.find(
        (w) => w.appId === 'project' && w.payload?.slug === payload.slug
      )
      if (existing) {
        focusWindow(existing.id)
        triggerGamification(appId, payload)
        return existing.id
      }
    } else if (appId === 'experience' && payload?.pinId) {
      const existing = windows.value.find(
        (w) => w.appId === 'experience' && w.payload?.pinId === payload.pinId
      )
      if (existing) {
        focusWindow(existing.id)
        return existing.id
      }
    } else if (appId !== 'project' && appId !== 'experience') {
      const existing = windows.value.find((w) => w.appId === appId)
      if (existing) {
        focusWindow(existing.id)
        if (appId === 'parcours') resetParcoursCommute()
        triggerGamification(appId, payload)
        return existing.id
      }
    }

    const def = getDesktopApp(appId)
    const bounds = getInitialWindowBounds(appId, def, windows.value.length)
    topZ.value += 1

    let title = def.title
    if (appId === 'project' && payload?.slug) {
      title = payload.slug.replace(/-/g, ' ')
    } else if (appId === 'experience' && payload?.pinId) {
      try {
        const { sections } = useContent()
        const pin = findPinById(buildMapPins(sections.value.experiences), payload.pinId)
        if (pin) title = pin.company
      } catch {
        title = 'Expérience'
      }
    }

    const win: DesktopWindow = {
      id: nextId(),
      appId,
      title,
      icon: def.icon,
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
      zIndex: topZ.value,
      minimized: false,
      maximized: false,
      payload
    }

    windows.value.push(win)
    focusedId.value = win.id
    if (appId === 'parcours') resetParcoursCommute()
    triggerGamification(appId, payload)
    return win.id
  }

  function closeWindow(id: string) {
    minimizeWindow(id)
  }

  function minimizeWindow(id: string) {
    const win = windows.value.find((w) => w.id === id)
    if (!win) return
    if (win.maximized) win.maximized = false
    win.minimized = true
    if (win.appId === 'parcours') {
      parcoursPinSelected.value = false
    }
    if (focusedId.value === id) {
      const next = [...windows.value].reverse().find((w) => w.id !== id && !w.minimized)
      focusedId.value = next?.id ?? null
    }
  }

  function restoreWindow(id: string) {
    const win = windows.value.find((w) => w.id === id)
    if (win?.appId === 'parcours') resetParcoursCommute()
    focusWindow(id)
  }

  function toggleMaximize(id: string) {
    const win = windows.value.find((w) => w.id === id)
    if (win) win.maximized = !win.maximized
    focusWindow(id)
  }

  function moveWindow(id: string, x: number, y: number) {
    const win = windows.value.find((w) => w.id === id)
    if (win && !win.maximized) {
      win.x = Math.max(0, x)
      win.y = Math.max(0, y)
    }
  }

  function resizeWindow(id: string, width: number, height: number) {
    const win = windows.value.find((w) => w.id === id)
    const def = win ? getDesktopApp(win.appId) : DESKTOP_APPS[0]
    if (win && !win.maximized) {
      win.width = Math.max(def.minWidth, width)
      win.height = Math.max(def.minHeight, height)
    }
  }

  const visibleWindows = computed(() => windows.value.filter((w) => !w.minimized))
  const minimizedWindows = computed(() => windows.value.filter((w) => w.minimized))
  const taskbarWindows = computed(() => windows.value)

  return {
    booted,
    booting,
    windows,
    visibleWindows,
    minimizedWindows,
    taskbarWindows,
    focusedId,
    parcoursCommuteActive,
    parcoursCommuteKey,
    wallpaperId,
    customWallpaperColor,
    wallpaperStyle,
    resetParcoursCommute,
    dismissParcoursCommute,
    setParcoursPinSelected,
    hydrateWallpaper,
    setWallpaper,
    setCustomWallpaperColor,
    hydrateBoot,
    boot,
    logout,
    openApp,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    toggleMaximize,
    focusWindow,
    moveWindow,
    resizeWindow
  }
})
