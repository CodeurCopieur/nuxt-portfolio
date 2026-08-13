export interface MusicTrack {
  id: string
  title: string
  artist: string
  genre: string
  /** Chemin local : /music/nom-fichier.mp3 (fichiers dans public/music/) */
  src: string
  coverGradient: string
  accent: string
}

/**
 * Playlist Widdy Audio — fichiers dans public/music/
 * Formats : mp3, ogg, wav, m4a, aac
 */
export const MUSIC_TRACKS: MusicTrack[] = [
  {
    id: 'paris-nights',
    title: 'Paris Nights',
    artist: 'DJ Phaphane',
    genre: 'Amapiano',
    src: '/music/DJ Phaphane - Amapiano To The World  Paris Nights.m4a',
    coverGradient: 'from-amber-400 via-orange-500 to-rose-600',
    accent: '#fb923c'
  }
]

/** Piste démo en ligne (secours si playlist vide) */
export const MUSIC_TRACKS_DEMO: MusicTrack[] = [
  {
    id: 'demo-1',
    title: 'Neon Horizon (démo)',
    artist: 'WiddyOS Sound',
    genre: 'Synthwave',
    src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverGradient: 'from-cyan-400 via-blue-600 to-indigo-900',
    accent: '#22d3ee'
  }
]

export function getMusicTracks(): MusicTrack[] {
  return MUSIC_TRACKS.length > 0 ? MUSIC_TRACKS : MUSIC_TRACKS_DEMO
}
