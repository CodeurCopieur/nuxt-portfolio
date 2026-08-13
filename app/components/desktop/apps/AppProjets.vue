<script setup lang="ts">
import { useDesktopStore } from '@/store/useDesktop'
import { useGamificationStore } from '@/store/useGamification'

type Project = {
  slug: string
  title: string
  year?: string
  org?: string
  summary?: string
  stack?: string[]
  tags?: string[]
  cover?: string
  link?: string
  github?: string
}

type FilterId = 'all' | 'todo' | 'done' | `org:${string}`

const { sections } = useContent()
const desktop = useDesktopStore()
const gamification = useGamificationStore()

const projets = computed(() => sections.value.projets as Project[])
const activeFilter = ref<FilterId>('all')
const selectedSlug = ref<string | null>(null)
const searchQuery = ref('')

const PERSONAL_ORG = 'Projet personnel'

function normalizeOrg(org?: string) {
  if (!org || org === 'Projet per') return PERSONAL_ORG
  return org
}

const orgFolders = computed(() => {
  const orgs = new Set<string>()
  for (const p of projets.value) {
    const org = normalizeOrg(p.org)
    if (org) orgs.add(org)
  }
  return [...orgs].sort((a, b) => {
    if (a === PERSONAL_ORG) return -1
    if (b === PERSONAL_ORG) return 1
    return a.localeCompare(b, 'fr')
  })
})

function folderLabel(org: string) {
  return org
}

function folderIcon(org: string) {
  return org === PERSONAL_ORG ? '🏠' : '📁'
}

const sidebarItems = computed(() => {
  const todo = projets.value.filter((p) => !gamification.viewedProjects.includes(p.slug)).length
  const done = projets.value.length - todo

  return {
    library: [
      { id: 'all' as FilterId, label: 'Tous les projets', icon: '▦', count: projets.value.length },
      { id: 'todo' as FilterId, label: 'À explorer', icon: '📄', count: todo },
      { id: 'done' as FilterId, label: 'Consultés', icon: '✓', count: done }
    ],
    folders: orgFolders.value.map((org) => ({
      id: `org:${org}` as FilterId,
      label: folderLabel(org),
      title: org,
      icon: folderIcon(org),
      count: projets.value.filter((p) => normalizeOrg(p.org) === org).length
    }))
  }
})

const filteredProjets = computed(() => {
  let list = projets.value

  if (activeFilter.value === 'todo') {
    list = list.filter((p) => !gamification.viewedProjects.includes(p.slug))
  } else if (activeFilter.value === 'done') {
    list = list.filter((p) => gamification.viewedProjects.includes(p.slug))
  } else if (activeFilter.value.startsWith('org:')) {
    const org = activeFilter.value.slice(4)
    list = list.filter((p) => normalizeOrg(p.org) === org)
  }

  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q)
        || p.org?.toLowerCase().includes(q)
        || p.stack?.some((s) => s.toLowerCase().includes(q))
    )
  }

  return list
})

const selectedProject = computed(() =>
  projets.value.find((p) => p.slug === selectedSlug.value) ?? null
)

const panelTitle = computed(() => {
  if (activeFilter.value === 'todo') return 'À explorer'
  if (activeFilter.value === 'done') return 'Consultés'
  if (activeFilter.value.startsWith('org:')) return folderLabel(activeFilter.value.slice(4))
  return 'Tous les projets'
})

function fileName(slug: string) {
  const base = slug.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim()
  return `${base}.md`
}

function isCompleted(slug: string) {
  return gamification.viewedProjects.includes(slug)
}

function selectProject(slug: string) {
  selectedSlug.value = slug
}

function openProject(slug: string) {
  desktop.openApp('project', { slug })
}

function setFilter(id: FilterId) {
  activeFilter.value = id
}

watch(filteredProjets, (list) => {
  if (!list.length) {
    selectedSlug.value = null
    return
  }
  if (!list.some((p) => p.slug === selectedSlug.value)) {
    selectedSlug.value = list[0]!.slug
  }
}, { immediate: true })

onMounted(() => {
  gamification.hydrate()
})
</script>

<template>
  <div class="missions h-full min-h-0 flex overflow-hidden">
    <!-- Sidebar -->
    <aside class="missions__sidebar shrink-0 flex flex-col">
      <div class="missions__sidebar-section">
        <p class="missions__section-label">Bibliothèque</p>
        <ul>
          <li v-for="item in sidebarItems.library" :key="item.id">
            <button
              type="button"
              class="missions__nav-item"
              :class="{ 'missions__nav-item--active': activeFilter === item.id }"
              @click="setFilter(item.id)"
            >
              <span class="missions__nav-icon" aria-hidden="true">{{ item.icon }}</span>
              <span class="missions__nav-label" :title="item.title ?? item.label">{{ item.label }}</span>
              <span class="missions__nav-count">{{ item.count }}</span>
            </button>
          </li>
        </ul>
      </div>

      <div v-if="sidebarItems.folders.length" class="missions__sidebar-section missions__sidebar-section--folders">
        <p class="missions__section-label">Dossiers</p>
        <ul class="missions__folder-list">
          <li v-for="item in sidebarItems.folders" :key="item.id">
            <button
              type="button"
              class="missions__nav-item missions__nav-item--folder"
              :class="{ 'missions__nav-item--active': activeFilter === item.id }"
              @click="setFilter(item.id)"
            >
              <span class="missions__nav-icon" aria-hidden="true">{{ item.icon }}</span>
              <span class="missions__nav-label missions__nav-label--folder">{{ item.label }}</span>
              <span class="missions__nav-count">{{ item.count }}</span>
            </button>
          </li>
        </ul>
      </div>
    </aside>

    <!-- Gallery -->
    <section class="missions__gallery min-w-0 flex flex-col">
      <header class="missions__gallery-head shrink-0">
        <h2 class="missions__gallery-title">{{ panelTitle }}</h2>
        <div class="missions__search">
          <svg class="missions__search-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M7 2a5 5 0 1 1 0 10A5 5 0 0 1 7 2zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7z" />
            <path d="M10.5 10.5 14 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" fill="none" />
          </svg>
          <input
            v-model="searchQuery"
            type="search"
            class="missions__search-input"
            placeholder="Rechercher"
            aria-label="Rechercher un projet"
          >
        </div>
      </header>

      <div class="missions__grid-wrap flex-1 min-h-0">
        <div v-if="filteredProjets.length" class="missions__files">
          <button
            v-for="project in filteredProjets"
            :key="project.slug"
            type="button"
            class="missions__file"
            :class="{ 'missions__file--selected': selectedSlug === project.slug }"
            @click="selectProject(project.slug)"
            @dblclick="openProject(project.slug)"
          >
            <span class="missions__file-icon-wrap">
              <svg class="missions__file-icon" viewBox="0 0 48 56" fill="none" aria-hidden="true">
                <path
                  d="M8 4h20l12 12v36a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z"
                  fill="white"
                  stroke="rgba(0,0,0,0.08)"
                  stroke-width="1"
                />
                <path d="M28 4v12h12" fill="rgba(0,0,0,0.04)" stroke="rgba(0,0,0,0.08)" stroke-width="1" />
                <rect x="10" y="22" width="22" height="2" rx="1" fill="#d1d5db" />
                <rect x="10" y="28" width="18" height="2" rx="1" fill="#e5e7eb" />
                <rect x="10" y="34" width="20" height="2" rx="1" fill="#e5e7eb" />
                <text x="24" y="48" text-anchor="middle" fill="#6366f1" font-size="8" font-weight="700" font-family="system-ui,sans-serif">MD</text>
              </svg>
              <span v-if="isCompleted(project.slug)" class="missions__file-badge" title="Projet consulté">✓</span>
            </span>
            <span class="missions__file-name">{{ fileName(project.slug) }}</span>
          </button>
        </div>

        <div v-else class="missions__empty">
          <p>Aucun projet trouvé</p>
        </div>
      </div>
    </section>

    <!-- Detail -->
    <aside class="missions__detail flex flex-col min-h-0">
      <template v-if="selectedProject">
        <div class="missions__detail-card">
          <div class="missions__detail-preview">
            <svg class="missions__detail-file-icon" viewBox="0 0 48 56" fill="none" aria-hidden="true">
              <path
                d="M8 4h20l12 12v36a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z"
                fill="white"
                stroke="rgba(0,0,0,0.08)"
                stroke-width="1"
              />
              <path d="M28 4v12h12" fill="rgba(0,0,0,0.04)" stroke="rgba(0,0,0,0.08)" stroke-width="1" />
              <rect x="10" y="22" width="22" height="2" rx="1" fill="#d1d5db" />
              <rect x="10" y="28" width="18" height="2" rx="1" fill="#e5e7eb" />
              <rect x="10" y="34" width="20" height="2" rx="1" fill="#e5e7eb" />
              <text x="24" y="48" text-anchor="middle" fill="#6366f1" font-size="8" font-weight="700" font-family="system-ui,sans-serif">MD</text>
            </svg>
            <p class="missions__detail-filename">{{ fileName(selectedProject.slug) }}</p>
          </div>

          <div class="missions__detail-body">
            <span
              class="missions__detail-status"
              :class="isCompleted(selectedProject.slug) ? 'missions__detail-status--done' : ''"
            >
              {{ isCompleted(selectedProject.slug) ? '✓ Projet consulté' : '📄 Projet à explorer' }}
            </span>
            <h3 class="missions__detail-title">{{ selectedProject.title }}</h3>
            <p class="missions__detail-meta">{{ selectedProject.org }} · {{ selectedProject.year }}</p>
            <p class="missions__detail-summary">{{ selectedProject.summary }}</p>

            <div v-if="selectedProject.stack?.length" class="missions__detail-stack">
              <span v-for="tech in selectedProject.stack.slice(0, 4)" :key="tech" class="missions__stack-chip">
                {{ tech }}
              </span>
              <span v-if="selectedProject.stack.length > 4" class="missions__stack-chip missions__stack-chip--more">
                +{{ selectedProject.stack.length - 4 }}
              </span>
            </div>
          </div>
        </div>

        <button type="button" class="missions__open-btn" @click="openProject(selectedProject.slug)">
          Ouvrir le projet
        </button>
        <p class="missions__xp-hint">+20 XP · double-clic sur un fichier pour ouvrir</p>
      </template>

      <div v-else class="missions__detail-placeholder">
        <div class="missions__placeholder-card">
          <svg class="missions__placeholder-icon" viewBox="0 0 48 56" fill="none" aria-hidden="true">
            <path d="M8 4h20l12 12v36a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V8a4 4 0 0 1 4-4z" fill="white" stroke="rgba(0,0,0,0.1)" />
            <path d="M28 4v12h12" fill="rgba(0,0,0,0.04)" />
            <text x="24" y="48" text-anchor="middle" fill="#6366f1" font-size="8" font-weight="700" font-family="system-ui,sans-serif">MD</text>
          </svg>
          <p>Sélectionnez un fichier projet</p>
        </div>
      </div>
    </aside>
  </div>
</template>

<style scoped>
.missions {
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif;
  background: rgba(246, 246, 248, 0.92);
  color: #1d1d1f;
}

.missions__sidebar {
  width: 248px;
  border-right: 1px solid rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.55);
  backdrop-filter: blur(12px);
}

.missions__sidebar-section {
  padding: 12px 10px 8px;
}

.missions__sidebar-section--folders {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  padding-top: 4px;
}

.missions__section-label {
  font-size: 11px;
  font-weight: 600;
  color: rgba(60, 60, 67, 0.6);
  padding: 0 8px 6px;
  letter-spacing: 0.01em;
}

.missions__folder-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  scrollbar-width: thin;
}

.missions__nav-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  border: none;
  border-radius: 8px;
  background: transparent;
  color: #1d1d1f;
  font-size: 13px;
  text-align: left;
  cursor: pointer;
  transition: background 0.12s;
}

.missions__nav-item:hover {
  background: rgba(0, 0, 0, 0.05);
}

.missions__nav-item--active {
  background: rgba(0, 122, 255, 0.14);
  color: #007AFF;
  font-weight: 600;
}

.missions__nav-icon {
  width: 18px;
  text-align: center;
  flex-shrink: 0;
  font-size: 13px;
  line-height: 1;
}

.missions__nav-item--folder {
  align-items: flex-start;
  padding-top: 7px;
  padding-bottom: 7px;
}

.missions__nav-label--folder {
  font-size: 12px;
  white-space: normal;
  overflow: visible;
  display: block;
  -webkit-line-clamp: unset;
  -webkit-box-orient: unset;
}

.missions__nav-label {
  flex: 1;
  min-width: 0;
  line-height: 1.25;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  word-break: break-word;
}

.missions__nav-count {
  font-size: 12px;
  color: rgba(60, 60, 67, 0.55);
  font-variant-numeric: tabular-nums;
}

.missions__nav-item--active .missions__nav-count {
  color: rgba(0, 122, 255, 0.75);
}

.missions__gallery {
  flex: 1;
  background: rgba(255, 255, 255, 0.35);
  border-right: 1px solid rgba(0, 0, 0, 0.06);
}

.missions__gallery-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px 10px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.missions__gallery-title {
  font-size: 15px;
  font-weight: 700;
  color: #1d1d1f;
}

.missions__search {
  position: relative;
  width: min(180px, 40%);
}

.missions__search-icon {
  position: absolute;
  left: 8px;
  top: 50%;
  transform: translateY(-50%);
  width: 13px;
  height: 13px;
  color: rgba(60, 60, 67, 0.45);
  pointer-events: none;
}

.missions__search-input {
  width: 100%;
  height: 28px;
  padding: 0 10px 0 28px;
  border: none;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.06);
  font-size: 12px;
  color: #1d1d1f;
  outline: none;
}

.missions__search-input::placeholder {
  color: rgba(60, 60, 67, 0.45);
}

.missions__search-input:focus {
  background: rgba(0, 0, 0, 0.08);
  box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.25);
}

.missions__grid-wrap {
  overflow-y: auto;
  scrollbar-width: thin;
}

.missions__files {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(76px, 1fr));
  gap: 4px 8px;
  padding: 12px 14px 16px;
  align-content: start;
}

.missions__file {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px 4px 8px;
  border: none;
  border-radius: 8px;
  background: transparent;
  cursor: pointer;
  text-align: center;
  transition: background 0.12s;
}

.missions__file:hover {
  background: rgba(0, 122, 255, 0.08);
}

.missions__file--selected {
  background: rgba(0, 122, 255, 0.16);
}

.missions__file-icon-wrap {
  position: relative;
  width: 44px;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.missions__file-icon {
  width: 40px;
  height: auto;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.12));
}

.missions__file-badge {
  position: absolute;
  top: -2px;
  right: -4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #10b981;
  color: white;
  font-size: 9px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}

.missions__file-name {
  width: 100%;
  font-size: 10px;
  line-height: 1.25;
  color: #1d1d1f;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.missions__file--selected .missions__file-name {
  color: #007AFF;
  font-weight: 600;
}

.missions__empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 160px;
  color: rgba(60, 60, 67, 0.55);
  font-size: 13px;
}

.missions__detail {
  flex: 0 0 min(420px, 40%);
  width: min(420px, 40%);
  min-width: 340px;
  max-width: 480px;
  padding: 12px 14px 16px;
  background: rgba(255, 255, 255, 0.45);
  backdrop-filter: blur(12px);
  min-height: 0;
}

.missions__detail-card {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.08);
}

.missions__detail-preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px 14px 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(0, 0, 0, 0.02);
}

.missions__detail-file-icon {
  width: 48px;
  height: auto;
  filter: drop-shadow(0 3px 8px rgba(0, 0, 0, 0.1));
}

.missions__detail-filename {
  font-size: 11px;
  font-weight: 600;
  color: #007AFF;
  text-align: center;
  word-break: break-all;
  line-height: 1.3;
}

.missions__detail-body {
  flex: 1;
  min-height: 0;
  padding: 16px;
  overflow-y: auto;
  scrollbar-width: thin;
}

.missions__detail-status {
  display: inline-block;
  font-size: 10px;
  font-weight: 700;
  padding: 3px 8px;
  border-radius: 999px;
  background: rgba(251, 191, 36, 0.18);
  color: #b45309;
  margin-bottom: 8px;
}

.missions__detail-status--done {
  background: rgba(16, 185, 129, 0.15);
  color: #047857;
}

.missions__detail-title {
  font-size: 17px;
  font-weight: 700;
  line-height: 1.3;
  color: #1d1d1f;
}

.missions__detail-meta {
  margin-top: 6px;
  font-size: 13px;
  color: rgba(60, 60, 67, 0.65);
}

.missions__detail-summary {
  margin-top: 12px;
  font-size: 13px;
  line-height: 1.55;
  color: rgba(60, 60, 67, 0.88);
}

.missions__detail-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 12px;
}

.missions__stack-chip {
  font-size: 11px;
  font-weight: 600;
  padding: 5px 10px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.06);
  color: rgba(60, 60, 67, 0.85);
}

.missions__stack-chip--more {
  background: rgba(0, 122, 255, 0.12);
  color: #007AFF;
}

.missions__open-btn {
  width: 100%;
  margin-top: 12px;
  height: 36px;
  border: none;
  border-radius: 10px;
  background: #007AFF;
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, transform 0.15s;
}

.missions__open-btn:hover {
  background: #0066d6;
  transform: translateY(-1px);
}

.missions__xp-hint {
  margin-top: 8px;
  font-size: 10px;
  text-align: center;
  color: rgba(60, 60, 67, 0.5);
}

.missions__detail-placeholder {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.missions__placeholder-card {
  width: 100%;
  min-height: 180px;
  border-radius: 16px;
  border: 1px dashed rgba(0, 0, 0, 0.12);
  background: rgba(255, 255, 255, 0.55);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  text-align: center;
  font-size: 12px;
  color: rgba(60, 60, 67, 0.55);
}

.missions__placeholder-icon {
  width: 40px;
  height: auto;
  opacity: 0.5;
}

@media (max-width: 960px) {
  .missions__detail {
    flex-basis: 320px;
    width: 320px;
    min-width: 280px;
    max-width: 36%;
  }
}

@media (max-width: 780px) {
  .missions__detail {
    display: none;
  }

  .missions__files {
    grid-template-columns: repeat(auto-fill, minmax(68px, 1fr));
  }
}

@media (max-width: 640px) {
  .missions__sidebar {
    width: 200px;
  }
}
</style>
