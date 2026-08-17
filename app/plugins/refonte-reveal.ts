import type { Directive } from 'vue'

interface RevealOptions {
  index?: number
  total?: number
  reverse?: boolean
  stagger?: number
  delay?: number
  distance?: number
  axis?: 'y' | 'x'
  duration?: number
}

type RevealBinding = RevealOptions | number | undefined

const observers = new WeakMap<Element, IntersectionObserver>()

function computeDelay(opts: RevealOptions) {
  const stagger = opts.stagger ?? 70
  const base = opts.delay ?? 0

  if (opts.total && opts.total > 1 && opts.index != null) {
    const order = opts.reverse ? opts.total - 1 - opts.index : opts.index
    return order * stagger + base
  }

  return base
}

function applyReveal(el: HTMLElement, opts: RevealOptions) {
  const axis = opts.axis ?? 'y'
  const distance = opts.distance ?? 26
  const duration = opts.duration ?? 720
  const delay = computeDelay(opts)

  el.style.setProperty('--rf-reveal-duration', `${duration}ms`)
  el.style.setProperty('--rf-reveal-delay', `${delay}ms`)
  el.style.setProperty('--rf-reveal-x', axis === 'x' ? `${distance}px` : '0px')
  el.style.setProperty('--rf-reveal-y', axis === 'y' ? `${distance}px` : '0px')
  el.classList.add('rf-reveal')

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    el.classList.add('rf-reveal--in')
    return
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          el.classList.add('rf-reveal--in')
          observer.unobserve(el)
        }
      }
    },
    { threshold: 0.16, rootMargin: '0px 0px -8% 0px' }
  )

  observer.observe(el)
  observers.set(el, observer)
}

/**
 * Directive universelle : enregistrée côté serveur ET client pour que le SSR
 * puisse résoudre `v-reveal` (sinon Vue plante sur `getSSRProps` d'une
 * directive non résolue). Le comportement réel (IntersectionObserver) ne
 * s'exécute que côté client, `mounted` n'étant jamais appelé pendant le SSR.
 */
const reveal: Directive<HTMLElement, RevealBinding> = {
  getSSRProps() {
    return {}
  },
  mounted(el, binding) {
    if (!import.meta.client) return
    const raw = binding.value
    const opts: RevealOptions = typeof raw === 'number' ? { delay: raw } : (raw ?? {})
    applyReveal(el, opts)
  },
  updated(el, binding) {
    if (!import.meta.client) return
    if (el.classList.contains('rf-reveal--in')) return
    const raw = binding.value
    const opts: RevealOptions = typeof raw === 'number' ? { delay: raw } : (raw ?? {})
    const delay = computeDelay(opts)
    el.style.setProperty('--rf-reveal-delay', `${delay}ms`)
  },
  unmounted(el) {
    if (!import.meta.client) return
    observers.get(el)?.disconnect()
    observers.delete(el)
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('reveal', reveal)
})
