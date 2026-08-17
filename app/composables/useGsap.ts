type Gsap = typeof import('gsap').gsap

let gsapPromise: Promise<Gsap> | null = null

/** Charge GSAP à la demande (évite de le mettre dans le bundle global). */
export function useGsap() {
  if (!gsapPromise) {
    gsapPromise = import('gsap').then((mod) => mod.gsap)
  }
  return gsapPromise
}
