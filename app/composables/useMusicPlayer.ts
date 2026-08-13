import { getMusicTracks } from '~/data/music-tracks'

let audio: HTMLAudioElement | null = null
let audioCtx: AudioContext | null = null
let analyser: AnalyserNode | null = null
let sourceNode: MediaElementAudioSourceNode | null = null
let eventsBound = false

function resolveSrc(src: string) {
  if (src.startsWith('http')) return src
  const path = src.startsWith('/') ? src : `/${src}`
  return encodeURI(path).replace(/#/g, '%23')
}

export function useMusicPlayer() {
  const tracks = getMusicTracks()
  const currentIndex = useState('music-index', () => 0)
  const isPlaying = useState('music-playing', () => false)
  const volume = useState('music-volume', () => 0.72)
  const currentTime = useState('music-time', () => 0)
  const duration = useState('music-duration', () => 0)
  const isReady = useState('music-ready', () => false)
  const loadError = useState('music-error', () => '')

  const currentTrack = computed(() => tracks[currentIndex.value] ?? tracks[0]!)

  function syncTime() {
    const el = getAudio()
    if (!el) return
    currentTime.value = el.currentTime || 0
    if (Number.isFinite(el.duration) && el.duration > 0) {
      duration.value = el.duration
    }
  }

  function bindAudioEventsOnce(el: HTMLAudioElement) {
    if (eventsBound) return
    eventsBound = true

    el.addEventListener('loadedmetadata', () => {
      duration.value = el.duration || 0
      isReady.value = true
      loadError.value = ''
    })
    el.addEventListener('durationchange', () => {
      if (Number.isFinite(el.duration)) duration.value = el.duration
    })
    el.addEventListener('timeupdate', syncTime)
    el.addEventListener('ended', () => next())
    el.addEventListener('play', () => {
      isPlaying.value = true
    })
    el.addEventListener('pause', () => {
      isPlaying.value = false
    })
    el.addEventListener('error', () => {
      isPlaying.value = false
      isReady.value = false
      loadError.value = 'Impossible de lire ce fichier audio.'
    })
  }

  function getAudio() {
    if (!import.meta.client) return null
    if (!audio) {
      audio = new Audio()
      audio.preload = 'auto'
      bindAudioEventsOnce(audio)
    }
    return audio
  }

  function loadTrack(index: number, autoplay = false) {
    const el = getAudio()
    if (!el || tracks.length === 0) return

    const i = ((index % tracks.length) + tracks.length) % tracks.length
    currentIndex.value = i
    const track = tracks[i]!
    isReady.value = false
    loadError.value = ''
    currentTime.value = 0
    duration.value = 0

    if (track.src.startsWith('http')) {
      el.crossOrigin = 'anonymous'
    } else {
      el.removeAttribute('crossorigin')
    }

    el.src = resolveSrc(track.src)
    el.volume = volume.value
    el.load()

    if (autoplay) {
      void playAudio()
    }
  }

  async function playAudio() {
    const el = getAudio()
    if (!el) return

    if (!el.src && tracks.length > 0) {
      loadTrack(currentIndex.value, false)
    }

    try {
      await ensureAnalyser()
      await el.play()
      syncTime()
    } catch {
      isPlaying.value = false
    }
  }

  async function ensureAnalyser() {
    if (!import.meta.client) return null
    const el = getAudio()
    if (!el) return null

    if (!audioCtx) {
      audioCtx = new AudioContext()
    }
    if (audioCtx.state === 'suspended') {
      await audioCtx.resume()
    }

    if (!analyser) {
      analyser = audioCtx.createAnalyser()
      analyser.fftSize = 256
      analyser.smoothingTimeConstant = 0.82
    }

    if (!sourceNode) {
      try {
        sourceNode = audioCtx.createMediaElementSource(el)
        sourceNode.connect(analyser)
        analyser.connect(audioCtx.destination)
      } catch {
        /* Déjà connecté ou indisponible — lecture directe via <audio> */
      }
    }

    return analyser
  }

  function toggle() {
    const el = getAudio()
    if (!el) return

    if (!el.src) {
      loadTrack(currentIndex.value, true)
      return
    }

    if (el.paused) {
      void playAudio()
    } else {
      el.pause()
    }
  }

  function play() {
    void playAudio()
  }

  function pause() {
    getAudio()?.pause()
  }

  function next() {
    loadTrack(currentIndex.value + 1, isPlaying.value)
  }

  function prev() {
    const el = getAudio()
    if (el && el.currentTime > 3) {
      el.currentTime = 0
      syncTime()
      return
    }
    loadTrack(currentIndex.value - 1, isPlaying.value)
  }

  function selectTrack(index: number) {
    loadTrack(index, isPlaying.value)
  }

  function seek(ratio: number) {
    const el = getAudio()
    if (!el) return
    const dur = el.duration || duration.value
    if (!dur || !Number.isFinite(dur)) return
    el.currentTime = Math.max(0, Math.min(1, ratio)) * dur
    syncTime()
  }

  function setVolume(v: number) {
    volume.value = Math.max(0, Math.min(1, v))
    const el = getAudio()
    if (el) el.volume = volume.value
  }

  function initTrack(index: number) {
    loadTrack(index, false)
  }

  function formatTime(sec: number) {
    if (!Number.isFinite(sec) || sec < 0) return '0:00'
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return {
    tracks,
    currentIndex,
    currentTrack,
    isPlaying,
    isReady,
    loadError,
    volume,
    currentTime,
    duration,
    initTrack,
    toggle,
    play,
    pause,
    next,
    prev,
    selectTrack,
    seek,
    setVolume,
    formatTime,
    ensureAnalyser
  }
}
