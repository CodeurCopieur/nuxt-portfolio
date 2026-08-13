import { defineStore } from 'pinia'
import {
  ACHIEVEMENTS,
  HOME_SECTIONS,
  ZONES,
  getLevelProgress,
  type ZoneId
} from '~/data/gamification'

const STORAGE_KEY = 'widdy-portfolio-gamification'

interface PersistedState {
  xp: number
  visitedZones: ZoneId[]
  viewedProjects: string[]
  unlockedAchievements: string[]
  homeSectionsSeen: string[]
  contactSent: boolean
}

interface ToastPayload {
  id: string
  title: string
  description: string
  icon: string
  xp: number
}

function defaultState(): PersistedState {
  return {
    xp: 0,
    visitedZones: [],
    viewedProjects: [],
    unlockedAchievements: [],
    homeSectionsSeen: [],
    contactSent: false
  }
}

export const useGamificationStore = defineStore('gamification', () => {
  const state = ref<PersistedState>(defaultState())
  const toast = ref<ToastPayload | null>(null)
  const hydrated = ref(false)

  const xp = computed(() => state.value.xp)
  const levelInfo = computed(() => getLevelProgress(state.value.xp))
  const visitedZones = computed(() => state.value.visitedZones)
  const viewedProjects = computed(() => state.value.viewedProjects)
  const unlockedAchievements = computed(() => state.value.unlockedAchievements)
  const homeSectionsSeen = computed(() => state.value.homeSectionsSeen)

  const explorationPercent = computed(() => {
    const zoneWeight = ZONES.length
    const sectionWeight = HOME_SECTIONS.length
    const projectWeight = 3
    const contactWeight = 1
    const total = zoneWeight + sectionWeight + projectWeight + contactWeight
    let done = state.value.visitedZones.length
    done += state.value.homeSectionsSeen.length
    done += Math.min(state.value.viewedProjects.length, projectWeight)
    if (state.value.contactSent) done += contactWeight
    return Math.round((done / total) * 100)
  })

  const nextQuestHint = computed(() => {
    if (!state.value.visitedZones.includes('home')) return ZONES[0].questDescription
    if (!state.value.homeSectionsSeen.includes('skills')) return 'Ouvrez l\'app Compétences sur le bureau'
    if (!state.value.visitedZones.includes('parcours')) return 'Ouvrez la Carte Parcours sur le bureau'
    if (!state.value.visitedZones.includes('projets')) return 'Ouvrez le dossier Projets'
    if (state.value.viewedProjects.length < 1) return 'Consultez un projet en détail'
    if (!state.value.visitedZones.includes('contact')) return 'Ouvrez l\'app Mail'
    if (!state.value.contactSent) return 'Envoyez un message pour la quête finale'
    return 'Portfolio 100 % exploré — bravo !'
  })

  function persist() {
    if (!import.meta.client) return
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.value))
  }

  function hydrate() {
    if (!import.meta.client || hydrated.value) return
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) state.value = { ...defaultState(), ...JSON.parse(raw) }
    } catch {
      state.value = defaultState()
    }
    hydrated.value = true
  }

  function showToast(achievementId: string) {
    const def = ACHIEVEMENTS.find((a) => a.id === achievementId)
    if (!def) return
    toast.value = {
      id: def.id,
      title: def.title,
      description: def.description,
      icon: def.icon,
      xp: def.xp
    }
    setTimeout(() => {
      if (toast.value?.id === achievementId) toast.value = null
    }, 4500)
  }

  function addXp(amount: number) {
    if (amount <= 0) return
    state.value.xp += amount
    persist()
  }

  function unlockAchievement(id: string) {
    if (state.value.unlockedAchievements.includes(id)) return false
    const def = ACHIEVEMENTS.find((a) => a.id === id)
    if (!def) return false
    state.value.unlockedAchievements.push(id)
    addXp(def.xp)
    showToast(id)
    checkFullClear()
    persist()
    return true
  }

  function visitZone(zoneId: ZoneId) {
    if (state.value.visitedZones.includes(zoneId)) return
    const zone = ZONES.find((z) => z.id === zoneId)
    state.value.visitedZones.push(zoneId)
    addXp(zone?.xp ?? 0)

    const achievementMap: Record<ZoneId, string> = {
      home: 'first_steps',
      parcours: 'map_explorer',
      projets: 'mission_hunter',
      contact: 'guild_member'
    }
    unlockAchievement(achievementMap[zoneId])
    checkFullClear()
    persist()
  }

  function discoverHomeSection(sectionId: string) {
    if (state.value.homeSectionsSeen.includes(sectionId)) return
    const section = HOME_SECTIONS.find((s) => s.id === sectionId)
    if (!section) return
    state.value.homeSectionsSeen.push(sectionId)
    addXp(section.xp)

    if (sectionId === 'skills') unlockAchievement('skill_reader')
    if (sectionId === 'experiences') unlockAchievement('timeline_master')
    checkFullClear()
    persist()
  }

  function viewProject(slug: string, totalProjects: number) {
    if (!slug) return
    const isNew = !state.value.viewedProjects.includes(slug)
    if (isNew) {
      state.value.viewedProjects.push(slug)
      addXp(20)
    }
    updateProjectAchievements(totalProjects)
    persist()
  }

  function updateProjectAchievements(totalProjects: number) {
    const count = state.value.viewedProjects.length
    if (count >= 1) unlockAchievement('project_scout')
    if (count >= 3) unlockAchievement('project_veteran')
    if (totalProjects > 0 && count >= totalProjects) unlockAchievement('project_legend')
    checkFullClear()
  }

  function completeContactQuest() {
    if (state.value.contactSent) return
    state.value.contactSent = true
    unlockAchievement('final_quest')
    checkFullClear()
    persist()
  }

  function checkFullClear() {
    const allZones = ZONES.every((z) => state.value.visitedZones.includes(z.id))
    const allSections = HOME_SECTIONS.every((s) => state.value.homeSectionsSeen.includes(s.id))
    if (allZones && allSections && state.value.contactSent) {
      unlockAchievement('full_clear')
    }
  }

  function handleRoute(path: string, params: Record<string, string | string[]>, totalProjects = 0) {
    hydrate()
    if (!path.startsWith('/game')) return

    if (path === '/game' || path === '/game/') visitZone('home')
    else if (path === '/game/parcours') visitZone('parcours')
    else if (path === '/game/projets') visitZone('projets')
    else if (path === '/game/contact') visitZone('contact')
    else if (path.startsWith('/game/projets/') && params.slug) {
      visitZone('projets')
      viewProject(String(params.slug), totalProjects)
    }
  }

  function dismissToast() {
    toast.value = null
  }

  function resetProgress() {
    state.value = defaultState()
    persist()
  }

  return {
    xp,
    levelInfo,
    visitedZones,
    viewedProjects,
    unlockedAchievements,
    homeSectionsSeen,
    explorationPercent,
    nextQuestHint,
    toast,
    hydrated,
    hydrate,
    visitZone,
    discoverHomeSection,
    viewProject,
    completeContactQuest,
    handleRoute,
    dismissToast,
    resetProgress
  }
})
