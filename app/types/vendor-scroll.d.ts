declare module 'locomotive-scroll' {
  export interface LenisOptions {
    smoothWheel?: boolean
    lerp?: number
    duration?: number
  }

  export interface LocomotiveScrollOptions {
    lenisOptions?: LenisOptions
    autoStart?: boolean
    scrollCallback?: (args: { scroll: number }) => void
  }

  export default class LocomotiveScroll {
    constructor(options?: LocomotiveScrollOptions)
    lenisInstance: {
      on: (event: string, callback: (args: { scroll: number }) => void) => void
      off: (event: string, callback: (args: { scroll: number }) => void) => void
      scroll: number
    }
    resize: () => void
    destroy: () => void
    scrollTo: (target: string | number | HTMLElement, options?: { duration?: number; offset?: number }) => void
    start: () => void
    stop: () => void
  }
}

declare module 'scrollmagic' {
  export class Scene {
    constructor(options?: Record<string, unknown>)
    addTo(controller: Controller): Scene
    on(event: string, callback: (...args: unknown[]) => void): Scene
    destroy(resetScenes?: boolean): void
  }

  export class Controller {
    constructor(options?: Record<string, unknown>)
    addScene(scene: Scene): Controller
    update(force?: boolean): void
    destroy(resetScenes?: boolean): void
  }
}

declare module '@barba/core' {
  export interface BarbaTransition {
    name?: string | string[]
    sync?: boolean
    once?(data: Record<string, unknown>): Promise<void> | void
    before?(data: Record<string, unknown>): Promise<void> | void
    leave?(data: Record<string, unknown>): Promise<void> | void
    enter?(data: Record<string, unknown>): Promise<void> | void
    after?(data: Record<string, unknown>): Promise<void> | void
  }

  export interface BarbaInitOptions {
    transitions?: BarbaTransition[]
    prevent?: (data: { el: HTMLElement }) => boolean
  }

  const barba: {
    init: (options?: BarbaInitOptions) => void
    go: (href: string) => void
  }

  export default barba
}
