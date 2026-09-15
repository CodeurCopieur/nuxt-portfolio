export type RfCvdMode = 'standard' | 'deuteranopia' | 'protanopia' | 'tritanopia'

export type RfA11yPrefs = {
  contrast: boolean
  bigText: boolean
  underline: boolean
  motion: boolean
  cvd: RfCvdMode
}

export const RF_A11Y_STORAGE_KEY = 'rf-a11y'
export const RF_A11Y_CHANGE_EVENT = 'rf-a11y-change'

type RfScrollSnap = { y: number, top: number, el: Element | null }
let lastScrollSnap: RfScrollSnap = { y: 0, top: 0, el: null }

function snapshotScroll() {
  if (!import.meta.client) return
  const y = window.scrollY
  const probeY = Math.round(window.innerHeight * 0.4)
  const skip = '.rf-a11y, .refonte-nav, .refonte-hud, .refonte-scroll-rail'
  const hit = document.elementsFromPoint(Math.round(window.innerWidth / 2), probeY).find((node) => {
    if (!(node instanceof HTMLElement)) return false
    if (node.closest(skip)) return false
    return Boolean(node.closest('.refonte-main, .refonte-root'))
  }) ?? null
  lastScrollSnap = {
    y,
    el: hit,
    top: hit instanceof HTMLElement ? hit.getBoundingClientRect().top : probeY
  }
}

export function restoreRfScrollSnap() {
  if (!import.meta.client) return
  const snap = lastScrollSnap
  if (snap.el instanceof HTMLElement && snap.el.isConnected) {
    const delta = snap.el.getBoundingClientRect().top - snap.top
    if (Math.abs(delta) > 1) {
      window.scrollBy({ top: delta, left: 0, behavior: 'auto' })
      return
    }
  }
  window.scrollTo({ top: snap.y, behavior: 'auto' })
}

/** OS + option du panneau. */
export function rfMotionReduced(): boolean {
  if (!import.meta.client) return false
  return (
    document.documentElement.classList.contains('rf-a11y-motion')
    || window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

const DEFAULT_PREFS: RfA11yPrefs = {
  contrast: false,
  bigText: false,
  underline: false,
  motion: false,
  cvd: 'standard'
}

function readStored(): RfA11yPrefs {
  if (!import.meta.client) return { ...DEFAULT_PREFS }
  try {
    const raw = localStorage.getItem(RF_A11Y_STORAGE_KEY)
    if (!raw) return { ...DEFAULT_PREFS }
    const parsed = JSON.parse(raw) as Partial<RfA11yPrefs>
    return {
      contrast: Boolean(parsed.contrast),
      bigText: Boolean(parsed.bigText),
      underline: Boolean(parsed.underline),
      motion: Boolean(parsed.motion),
      cvd:
        parsed.cvd === 'deuteranopia'
        || parsed.cvd === 'protanopia'
        || parsed.cvd === 'tritanopia'
          ? parsed.cvd
          : 'standard'
    }
  } catch {
    return { ...DEFAULT_PREFS }
  }
}

function applyToDocument(prefs: RfA11yPrefs) {
  if (!import.meta.client) return
  snapshotScroll()
  const root = document.documentElement
  root.classList.toggle('rf-a11y-contrast', prefs.contrast)
  root.classList.toggle('rf-a11y-text', prefs.bigText)
  root.classList.toggle('rf-a11y-links', prefs.underline)
  root.classList.toggle('rf-a11y-motion', prefs.motion)
  if (prefs.cvd === 'standard') root.removeAttribute('data-rf-cvd')
  else root.setAttribute('data-rf-cvd', prefs.cvd)
  window.dispatchEvent(new CustomEvent(RF_A11Y_CHANGE_EVENT))
}

function persist(prefs: RfA11yPrefs) {
  try {
    localStorage.setItem(RF_A11Y_STORAGE_KEY, JSON.stringify(prefs))
  } catch {
    /* stockage indisponible */
  }
}

export function useRefonteA11y() {
  const prefs = useState<RfA11yPrefs>('rf-a11y', () => ({ ...DEFAULT_PREFS }))

  function commit(next: RfA11yPrefs) {
    prefs.value = next
    applyToDocument(next)
    persist(next)
  }

  function setFlag(key: Exclude<keyof RfA11yPrefs, 'cvd'>, value: boolean) {
    commit({ ...prefs.value, [key]: value })
  }

  function setCvd(cvd: RfCvdMode) {
    commit({ ...prefs.value, cvd })
  }

  function reset() {
    commit({ ...DEFAULT_PREFS })
  }

  onMounted(() => {
    const stored = readStored()
    prefs.value = stored
    applyToDocument(stored)
  })

  return { prefs, setFlag, setCvd, reset }
}
