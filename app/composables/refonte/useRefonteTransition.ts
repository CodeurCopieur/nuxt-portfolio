type TransitionFn = () => Promise<void>

const ROUTE_ORDER = ['/refonte', '/refonte/projets', '/refonte/contact']

let leaveFn: TransitionFn | null = null
let enterFn: TransitionFn | null = null
let initialized = false
const swipeDirection = ref(1)

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

/** Barba orchestre les transitions ; Nuxt gère le routing (pas de PJAX). */
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

export function setRefonteTransitionHandlers(handlers: {
  leave: TransitionFn
  enter: TransitionFn
}) {
  leaveFn = handlers.leave
  enterFn = handlers.enter
}

export async function runRefonteTransition(
  navigate: () => Promise<void> | void,
  opts?: { from?: string; to?: string }
) {
  if (!import.meta.client) {
    await navigate()
    return
  }

  if (opts?.from && opts?.to) {
    swipeDirection.value = resolveDirection(opts.from, opts.to)
  }

  await initRefonteBarba()

  await leaveFn?.()
  await navigate()
  await nextTick()
  await enterFn?.()
}

export function useRefonteTransition() {
  const router = useRouter()
  const pageRef = inject<Ref<HTMLElement | null>>('refonte-page')
  const isTransitioning = useState('refonte-transitioning', () => false)

  async function animateLeave() {
    const el = pageRef?.value
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
    const el = pageRef?.value
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

  onMounted(async () => {
    await initRefonteBarba()
    setRefonteTransitionHandlers({
      leave: async () => {
        isTransitioning.value = true
        await animateLeave()
      },
      enter: async () => {
        await animateEnter()
        isTransitioning.value = false
      }
    })
  })

  async function navigateTo(to: string) {
    const from = router.currentRoute.value.path
    if (from === to) return
    await runRefonteTransition(async () => {
      await router.push(to)
    }, { from, to })
  }

  return { navigateTo, isTransitioning, swipeDirection }
}
