type TransitionFn = () => Promise<void>

const ROUTE_ORDER = ['/refonte', '/refonte/projets', '/refonte/contact']

let leaveFn: TransitionFn | null = null
let enterFn: TransitionFn | null = null
let initialized = false

export interface RefonteTransitionApi {
  navigateTo: (to: string) => Promise<void>
  isTransitioning: Ref<boolean>
  swipeDirection: Ref<number>
}

export const REFONTE_TRANSITION_KEY: InjectionKey<RefonteTransitionApi> = Symbol('refonte-transition')

async function getBarba() {
  const { default: barba } = await import('@barba/core')
  return barba
}

function resolveDirection(from: string, to: string) {
  const normalize = (path: string) => {
    if (path === '/refonte') return '/refonte'
    if (path.startsWith('/refonte/projets')) return '/refonte/projets'
    if (path.startsWith('/refonte/contact')) return '/refonte/contact'
    return path
  }

  const fromKey = normalize(from)
  const toKey = normalize(to)
  const fromIdx = ROUTE_ORDER.indexOf(fromKey)
  const toIdx = ROUTE_ORDER.indexOf(toKey)

  if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return 1
  return toIdx > fromIdx ? 1 : -1
}

export async function initRefonteBarba() {
  if (!import.meta.client || initialized) return
  initialized = true

  const barba = await getBarba()
  barba.init({
    transitions: [
      {
        name: 'refonte-swipe',
        sync: true,
        leave: () => leaveFn?.() ?? Promise.resolve(),
        enter: () => enterFn?.() ?? Promise.resolve()
      }
    ],
    prevent: () => true
  })
}

function setRefonteTransitionHandlers(handlers: {
  leave: TransitionFn
  enter: TransitionFn
}) {
  leaveFn = handlers.leave
  enterFn = handlers.enter
}

export async function runRefonteTransition(
  navigate: () => Promise<void> | void,
  opts?: { from?: string; to?: string; direction?: Ref<number>; onBeforeEnter?: () => void; onAfterEnter?: () => void }
) {
  if (!import.meta.client) {
    await navigate()
    return
  }

  if (opts?.from && opts?.to && opts.direction) {
    opts.direction.value = resolveDirection(opts.from, opts.to)
  }

  try {
    await initRefonteBarba()

    if (leaveFn) await leaveFn()
    await navigate()
    await nextTick()
    opts?.onBeforeEnter?.()
    await nextTick()
    if (enterFn) await enterFn()
    opts?.onAfterEnter?.()
  } catch (error) {
    console.error('[refonte-transition]', error)
    useState('refonte-transitioning', () => false).value = false
    const el = document.querySelector('.refonte-main') as HTMLElement | null
    if (el) {
      el.style.visibility = ''
      el.style.transform = ''
      el.style.opacity = ''
    }
  }
}

/** Enregistre les handlers une seule fois — à appeler depuis RefonteShell. */
export function provideRefonteTransition(
  pageRef: Ref<HTMLElement | null>,
  opts?: { onBeforeEnter?: () => void; onAfterEnter?: () => void }
): RefonteTransitionApi {
  const router = useRouter()
  const isTransitioning = useState('refonte-transitioning', () => false)
  const swipeDirection = ref(1)

  async function animateLeave() {
    const el = pageRef.value
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const { gsap } = await import('gsap')
    const out = swipeDirection.value * -100

    await gsap.to(el, {
      xPercent: out,
      opacity: 0.55,
      duration: 0.42,
      ease: 'power3.in'
    })
  }

  async function animateEnter() {
    const el = pageRef.value
    if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const { gsap } = await import('gsap')
    const from = swipeDirection.value * 100

    gsap.set(el, { xPercent: from, opacity: 0.55 })
    await gsap.to(el, {
      xPercent: 0,
      opacity: 1,
      duration: 0.48,
      ease: 'power3.out'
    })
    gsap.set(el, { clearProps: 'transform,opacity' })
  }

  setRefonteTransitionHandlers({
    leave: async () => {
      isTransitioning.value = true
      await animateLeave()
    },
    enter: async () => {
      try {
        await animateEnter()
      } finally {
        isTransitioning.value = false
        if (pageRef.value) pageRef.value.style.visibility = ''
      }
    }
  })

  onMounted(async () => {
    await initRefonteBarba()
  })

  onUnmounted(() => {
    leaveFn = null
    enterFn = null
  })

  async function navigateTo(to: string) {
    const from = router.currentRoute.value.path
    if (from === to) return

    await runRefonteTransition(
      async () => { await router.push(to) },
      {
        from,
        to,
        direction: swipeDirection,
        onBeforeEnter: () => opts?.onBeforeEnter?.(),
        onAfterEnter: () => opts?.onAfterEnter?.()
      }
    )
  }

  const api: RefonteTransitionApi = {
    navigateTo,
    isTransitioning,
    swipeDirection
  }

  provide(REFONTE_TRANSITION_KEY, api)
  return api
}

export function useRefonteTransition(): RefonteTransitionApi {
  const injected = inject(REFONTE_TRANSITION_KEY, null)
  if (injected) return injected

  const router = useRouter()
  return {
    navigateTo: async (to: string) => { await router.push(to) },
    isTransitioning: ref(false),
    swipeDirection: ref(1)
  }
}
