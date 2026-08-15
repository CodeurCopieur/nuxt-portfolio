<script setup lang="ts">
import L from 'leaflet'
import type { Map as LeafletMap, Marker } from 'leaflet'
import type { MapPin } from '~/utils/experience-map'
import { MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM } from '~/utils/experience-map'
import { getCareerPinPalette } from '~/utils/career-pin-colors'
import { CAREER_METRO_STATIONS } from '~/data/career-metro-overlay'

const props = withDefaults(
  defineProps<{
    pins: MapPin[]
    selectedPinId?: string | null
    hideLegend?: boolean
    variant?: 'game' | 'refonte'
  }>(),
  { variant: 'game' }
)

const isRefonte = computed(() => props.variant === 'refonte')

const emit = defineEmits<{
  select: [pin: MapPin]
}>()

const mapContainer = ref<HTMLElement | null>(null)
const mapInstance = shallowRef<LeafletMap | null>(null)
const activePinId = ref<string | null>(null)
const mapLoaded = ref(false)
const mapError = ref(false)
const errorMessage = ref('')

let metroStationMarkers: Marker[] = []

let resizeObserver: ResizeObserver | null = null
let initTimer: ReturnType<typeof setTimeout> | null = null

const workplaceLegend = computed(() =>
  props.pins.map((pin) => {
    const palette = getCareerPinPalette(pin.level)
    return {
      id: pin.id,
      company: pin.company,
      swatch: palette.swatch,
      ring: palette.ring
    }
  })
)

function escapeHtml(text: string) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function getPinStyle(level: number, isActive: boolean) {
  const palette = getCareerPinPalette(level)
  if (isActive) {
    if (isRefonte.value) {
      return {
        dot: 'linear-gradient(135deg, #c85a48, #b8432f)',
        ring: 'rgba(184, 67, 47, 0.45)'
      }
    }
    return {
      dot: 'linear-gradient(135deg, #67e8f9, #22d3ee)',
      ring: 'rgba(34, 211, 238, 0.55)'
    }
  }
  return palette
}

function pinForStation(station: (typeof CAREER_METRO_STATIONS)[number]): MapPin | undefined {
  return props.pins.find(
    (pin) => Math.abs(pin.lat - station.lat) < 0.0015 && Math.abs(pin.lng - station.lng) < 0.0015
  )
}

function buildMetroStationHtml(
  workplace: string,
  lines: { number: string; color: string }[],
  pinLevel: number,
  isActive = false
) {
  const label = escapeHtml(workplace.length > 24 ? `${workplace.slice(0, 22)}…` : workplace)
  const pinStyle = getPinStyle(pinLevel, isActive)
  const badges = lines
    .map(
      (line) =>
        `<span class="metro-station__line" style="background:${line.color}" title="Ligne ${escapeHtml(line.number)}">${escapeHtml(line.number)}</span>`
    )
    .join('')
  const labelHtml = isActive
    ? `<div class="metro-station__workplace">${label}</div>`
    : ''
  return `
    <div class="metro-station ${isActive ? 'metro-station--active' : ''}">
      ${labelHtml}
      <div class="metro-station__marker">
        <div class="metro-station__pulse" style="--pin-ring: ${pinStyle.ring}"></div>
        <div class="metro-station__dot" style="background: ${pinStyle.dot}; box-shadow: 0 0 0 4px ${pinStyle.ring}"></div>
      </div>
      <div class="metro-station__lines">${badges}</div>
    </div>
  `
}

function clearMetroLayers() {
  metroStationMarkers.splice(0).forEach((marker) => marker.remove())
}

function updateMetroLayers() {
  const map = mapInstance.value
  if (!map) return

  clearMetroLayers()

  for (const station of CAREER_METRO_STATIONS) {
    const pin = pinForStation(station)
    if (!pin) continue

    const marker = L.marker([station.lat, station.lng], {
      icon: L.divIcon({
        className: 'metro-station-icon-wrap',
        html: buildMetroStationHtml(
          pin.company,
          station.lines,
          pin.level,
          activePinId.value === pin.id
        ),
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      }),
      interactive: true,
      riseOnHover: true,
      pane: 'metroPane',
      zIndexOffset: activePinId.value === pin.id ? 1000 : 0
    })
    marker.on('click', () => {
      setActivePin(pin.id)
      emit('select', pin)
    })
    marker.on('mouseover', () => {
      if (!props.selectedPinId) setActivePin(pin.id)
    })
    marker.on('mouseout', () => {
      setActivePin(props.selectedPinId ?? null)
    })
    marker.addTo(map)
    metroStationMarkers.push(marker)
  }
}

function refreshMetroStationIcons() {
  metroStationMarkers.forEach((marker) => {
    const { lat, lng } = marker.getLatLng()
    const station = CAREER_METRO_STATIONS.find(
      (s) => Math.abs(s.lat - lat) < 0.0001 && Math.abs(s.lng - lng) < 0.0001
    )
    const pin = station ? pinForStation(station) : undefined
    if (!station || !pin) return
    marker.setIcon(
      L.divIcon({
        className: 'metro-station-icon-wrap',
        html: buildMetroStationHtml(
          pin.company,
          station.lines,
          pin.level,
          pin.id === activePinId.value
        ),
        iconSize: [0, 0],
        iconAnchor: [0, 0]
      })
    )
  })
}

function setActivePin(pinId: string | null) {
  activePinId.value = pinId
  if (!mapInstance.value) return
  refreshMetroStationIcons()
}

function collectPinLatLngs(): L.LatLngExpression[] {
  return props.pins
    .filter((pin) => Number.isFinite(pin.lat) && Number.isFinite(pin.lng))
    .map((pin) => [pin.lat, pin.lng] as L.LatLngExpression)
}

const DETAIL_PANEL_PADDING_LEFT = 400

function fitAllLocations(animate = true) {
  const map = mapInstance.value
  if (!map) return

  const latLngs = collectPinLatLngs()
  if (latLngs.length === 0) return

  if (latLngs.length === 1) {
    map.setView(latLngs[0]!, 14, { animate })
    return
  }

  map.fitBounds(L.latLngBounds(latLngs), {
    padding: [52, 52],
    maxZoom: 13,
    animate
  })
}

function focusSelectedPin(pin: MapPin) {
  const map = mapInstance.value
  if (!map) return

  const delta = 0.008
  const bounds = L.latLngBounds(
    [pin.lat - delta, pin.lng - delta],
    [pin.lat + delta, pin.lng + delta]
  )

  map.fitBounds(bounds, {
    maxZoom: 14,
    paddingTopLeft: L.point(isRefonte.value ? 48 : DETAIL_PANEL_PADDING_LEFT, 56),
    paddingBottomRight: L.point(48, 48),
    animate: true
  })
}

function updateMapView() {
  if (!props.selectedPinId) {
    fitAllLocations(false)
  }
}

function destroyMap() {
  if (initTimer) {
    clearTimeout(initTimer)
    initTimer = null
  }
  resizeObserver?.disconnect()
  resizeObserver = null
  clearMetroLayers()
  mapInstance.value?.remove()
  mapInstance.value = null
}

function scheduleInvalidate() {
  const map = mapInstance.value
  if (!map) return
  nextTick(() => {
    map.invalidateSize()
    setTimeout(() => map.invalidateSize(), 100)
    setTimeout(() => map.invalidateSize(), 400)
    setTimeout(() => map.invalidateSize(), 900)
  })
}

function initMap() {
  if (mapInstance.value || !mapContainer.value) return false

  try {
    if (mapInstance.value) {
      mapInstance.value.remove()
      mapInstance.value = null
    }

    const map = L.map(mapContainer.value, {
      center: MAP_DEFAULT_CENTER,
      zoom: MAP_DEFAULT_ZOOM,
      zoomControl: false,
      scrollWheelZoom: true,
      attributionControl: true
    })

    map.createPane('metroPane')
    const metroPane = map.getPane('metroPane')
    if (metroPane) metroPane.style.zIndex = '380'

    L.control.zoom({ position: 'topright' }).addTo(map)

    L.tileLayer(
      isRefonte.value
        ? 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png'
        : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      {
        subdomains: 'abcd',
        maxZoom: 20,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
      }
    ).addTo(map)

    mapInstance.value = map
    updateMetroLayers()
    updateMapView()
    scheduleInvalidate()

    resizeObserver = new ResizeObserver(() => {
      map.invalidateSize({ animate: false })
    })
    resizeObserver.observe(mapContainer.value)

    mapLoaded.value = true
    mapError.value = false
    errorMessage.value = ''
    return true
  } catch (err) {
    console.error('[CareerMap]', err)
    mapError.value = true
    errorMessage.value = err instanceof Error ? err.message : 'Erreur inconnue'
    return false
  }
}

function waitForContainer(attempt = 0) {
  if (mapInstance.value || mapLoaded.value || mapError.value) return

  const el = mapContainer.value
  if (el) {
    const rect = el.getBoundingClientRect()
    if (rect.width >= 80 && rect.height >= 80) {
      if (initMap()) return
    }
  }

  if (attempt < 80) {
    initTimer = setTimeout(() => waitForContainer(attempt + 1), 150)
  } else if (!mapError.value) {
    mapError.value = true
    errorMessage.value = 'La fenêtre n\'a pas de taille suffisante pour afficher la carte.'
  }
}

function retry() {
  mapError.value = false
  mapLoaded.value = false
  errorMessage.value = ''
  destroyMap()
  waitForContainer(0)
}

watch(
  () => props.selectedPinId,
  (id) => {
    setActivePin(id ?? null)
    const map = mapInstance.value
    if (!map) return

    nextTick(() => {
      map.invalidateSize({ animate: false })

      if (id) {
        const pin = props.pins.find((p) => p.id === id)
        if (pin) {
          setTimeout(() => focusSelectedPin(pin), 50)
        }
        return
      }

      setTimeout(() => fitAllLocations(true), 50)
    })
  }
)

watch(
  () => props.pins,
  () => {
    if (mapInstance.value) {
      setActivePin(props.selectedPinId ?? null)
      updateMetroLayers()
      updateMapView()
    }
  },
  { deep: true }
)

onMounted(() => {
  waitForContainer(0)
})

onUnmounted(() => {
  destroyMap()
})

function resetView() {
  setActivePin(null)
  const map = mapInstance.value
  if (!map) return

  nextTick(() => {
    map.invalidateSize({ animate: false })
    fitAllLocations(true)
    updateMetroLayers()
  })
}

defineExpose({
  invalidate: () => scheduleInvalidate(),
  resetView
})
</script>

<template>
  <div
    class="career-map flex flex-col w-full h-full min-h-[480px] rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-black/40"
    :class="{ 'career-map--refonte': isRefonte }"
  >
    <div ref="mapContainer" class="career-map__canvas flex-1 w-full min-h-[480px]" />
    <div class="career-map__vignette pointer-events-none" aria-hidden="true" />
    <div class="career-map__glow pointer-events-none" aria-hidden="true" />

    <div
      v-if="!mapLoaded && !mapError"
      class="absolute inset-0 z-[2] flex items-center justify-center"
      :class="isRefonte ? 'bg-[#f7f2ea]' : 'bg-[#0d1117]'"
    >
      <div class="flex flex-col items-center gap-3" :class="isRefonte ? 'text-[#7a7268]' : 'text-white/50'">
        <div
          class="w-8 h-8 border-2 rounded-full animate-spin"
          :class="isRefonte ? 'border-[rgba(26,22,18,0.12)] border-t-[#b8432f]' : 'border-white/20 border-t-cyan-400'"
        />
        <span class="text-xs tracking-wide">Chargement de la carte…</span>
      </div>
    </div>

    <div
      v-if="mapError"
      class="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-4 bg-[#0d1117] p-6 text-center"
    >
      <p class="text-sm text-red-300">Impossible de charger la carte.</p>
      <p v-if="errorMessage" class="text-xs text-white/40 max-w-xs">{{ errorMessage }}</p>
      <button
        type="button"
        class="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-sm font-medium border border-cyan-500/30 transition-colors"
        @click="retry"
      >
        Réessayer
      </button>
    </div>

    <div v-if="!hideLegend" class="absolute top-3 left-4 z-[400] flex flex-col gap-2 pointer-events-none">
      <div class="career-map__legend">
        <p class="career-map__legend-title">Carte du parcours</p>
        <p class="career-map__legend-sub">
          {{ isRefonte ? 'Synchronisée avec le scroll' : 'Cliquez un point pour voir le détail' }}
        </p>
      </div>
    </div>

    <div class="career-map__footer absolute bottom-3 right-4 z-[400] pointer-events-none flex flex-col items-end gap-2 max-w-[min(calc(100%-2rem),240px)]">
      <div
        v-if="mapLoaded && workplaceLegend.length"
        class="career-map__color-legend w-full"
      >
        <p class="career-map__color-legend-title">Lieux de travail</p>
        <ul class="career-map__color-legend-list">
          <li
            v-for="item in workplaceLegend"
            :key="item.id"
            class="career-map__color-legend-item"
            :class="{ 'career-map__color-legend-item--active': selectedPinId === item.id }"
          >
            <span
              class="career-map__color-swatch"
              :style="{ background: item.swatch, boxShadow: `0 0 0 2px ${item.ring}` }"
            />
            <span class="career-map__color-label">{{ item.company }}</span>
          </li>
        </ul>
      </div>

      <p class="career-map__attribution">
        {{ isRefonte ? 'Paris & Île-de-France' : 'Carte CARTO Dark · Paris & Île-de-France' }}
      </p>
    </div>
  </div>
</template>

<style>
.career-map {
  position: relative;
  background: radial-gradient(ellipse at 50% 0%, rgba(56, 189, 248, 0.08), transparent 60%), #0d1117;
}

.career-map__canvas {
  z-index: 1;
}

.career-map__vignette {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: radial-gradient(ellipse at center, transparent 40%, rgba(0, 0, 0, 0.45) 100%);
}

.career-map__glow {
  position: absolute;
  inset: 0;
  z-index: 2;
  background: linear-gradient(180deg, rgba(13, 17, 23, 0.35) 0%, transparent 18%, transparent 82%, rgba(13, 17, 23, 0.5) 100%);
}

.career-map__legend {
  padding: 8px 12px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3);
}

.career-map__legend-title {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: rgba(255, 255, 255, 0.9);
}

.career-map__legend-sub {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.45);
  margin-top: 2px;
}

.career-map__attribution {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
  background: rgba(0, 0, 0, 0.5);
  padding: 0.25rem 0.65rem;
  border-radius: 999px;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}

.career-map__color-legend {
  padding: 8px 10px;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.35);
}

.career-map__color-legend-title {
  font-size: 10px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: rgba(255, 255, 255, 0.45);
  margin-bottom: 6px;
}

.career-map__color-legend-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.career-map__color-legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
}

.career-map__color-legend-item--active .career-map__color-label {
  color: rgba(103, 232, 249, 0.95);
}

.career-map__color-swatch {
  flex-shrink: 0;
  width: 11px;
  height: 11px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.92);
}

.career-map__color-label {
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.82);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.2;
}

.career-map__canvas.leaflet-container,
.career-map__canvas .leaflet-container {
  width: 100% !important;
  height: 100% !important;
  min-height: 480px;
  background: #0d1117;
  font-family: inherit;
}

.career-map__canvas .leaflet-control-zoom {
  border: none !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
  border-radius: 10px !important;
  overflow: hidden;
}

.career-map__canvas .leaflet-control-zoom a {
  background: rgba(15, 23, 42, 0.85) !important;
  color: rgba(255, 255, 255, 0.85) !important;
  border: none !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
  width: 32px !important;
  height: 32px !important;
  line-height: 32px !important;
  font-size: 16px !important;
  backdrop-filter: blur(8px);
  transition: background 0.15s, color 0.15s;
}

.career-map__canvas .leaflet-control-zoom a:hover {
  background: rgba(56, 189, 248, 0.2) !important;
  color: #67e8f9 !important;
}

.career-map__canvas .leaflet-control-zoom-in {
  border-radius: 10px 10px 0 0 !important;
}

.career-map__canvas .leaflet-control-zoom-out {
  border-radius: 0 0 10px 10px !important;
  border-bottom: none !important;
}

.career-map__canvas .leaflet-control-attribution {
  background: rgba(0, 0, 0, 0.35) !important;
  color: rgba(255, 255, 255, 0.35) !important;
  font-size: 8px !important;
  backdrop-filter: blur(4px);
  border-radius: 6px 0 0 0;
  padding: 2px 6px !important;
}

.career-map__canvas .leaflet-control-attribution a {
  color: rgba(103, 232, 249, 0.6) !important;
}

.metro-station-icon-wrap {
  background: transparent !important;
  border: none !important;
  cursor: pointer !important;
}

.metro-station {
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: translate(-50%, -100%);
  pointer-events: auto;
  cursor: pointer;
  gap: 5px;
  padding-bottom: 2px;
  filter: drop-shadow(0 6px 16px rgba(0, 0, 0, 0.55));
  transition: transform 0.2s ease, filter 0.2s ease;
}

.metro-station:hover {
  transform: translate(-50%, -100%) scale(1.08);
  filter: drop-shadow(0 8px 20px rgba(56, 189, 248, 0.25));
}

.metro-station--active {
  transform: translate(-50%, -100%) scale(1.14);
  filter: drop-shadow(0 8px 24px rgba(34, 211, 238, 0.35));
  z-index: 1000 !important;
}

.metro-station__marker {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metro-station__pulse {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 36px;
  height: 36px;
  margin: -18px 0 0 -18px;
  border-radius: 50%;
  background: var(--pin-ring);
  opacity: 0;
  animation: metro-pin-pulse 2.5s ease-out infinite;
  pointer-events: none;
}

.metro-station:hover .metro-station__pulse {
  opacity: 0.85;
}

.metro-station--active .metro-station__pulse {
  animation-duration: 1.4s;
  opacity: 1;
}

@keyframes metro-pin-pulse {
  0% { transform: scale(0.5); opacity: 0.6; }
  100% { transform: scale(2.2); opacity: 0; }
}

.metro-station--active .metro-station__workplace {
  border-color: rgba(34, 211, 238, 0.45);
  background: rgba(8, 47, 73, 0.88);
}

.metro-station__workplace {
  padding: 5px 11px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.78);
  color: rgba(255, 255, 255, 0.95);
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  border: 1px solid rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(10px);
  letter-spacing: 0.01em;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.45);
}

.metro-station__dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 3px solid rgba(255, 255, 255, 0.95);
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  transition: transform 0.2s ease;
}

.metro-station--active .metro-station__dot,
.metro-station:hover .metro-station__dot {
  transform: scale(1.1);
}

.metro-station__lines {
  display: flex;
  gap: 3px;
}

.metro-station__line {
  min-width: 15px;
  height: 15px;
  padding: 0 3px;
  border-radius: 4px;
  color: #fff;
  font-size: 8px;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.35);
}

/* Variante refonte — carte claire, papier chaud */
.career-map--refonte {
  min-height: 380px;
  background: var(--rf-paper, #f7f2ea);
  border-color: var(--rf-line, rgba(26, 22, 18, 0.12));
  box-shadow: var(--rf-shadow, 0 24px 80px rgba(26, 22, 18, 0.12));
}

.career-map--refonte .career-map__canvas,
.career-map--refonte .career-map__canvas.leaflet-container {
  min-height: 380px;
  background: #ebe4d6;
}

.career-map--refonte .career-map__vignette {
  background: radial-gradient(ellipse at center, transparent 55%, rgba(247, 242, 234, 0.35) 100%);
}

.career-map--refonte .career-map__glow {
  background: linear-gradient(
    180deg,
    rgba(247, 242, 234, 0.45) 0%,
    transparent 16%,
    transparent 84%,
    rgba(247, 242, 234, 0.35) 100%
  );
}

.career-map--refonte .career-map__legend {
  background: rgba(247, 242, 234, 0.92);
  border-color: var(--rf-line, rgba(26, 22, 18, 0.12));
  box-shadow: var(--rf-shadow, 0 24px 80px rgba(26, 22, 18, 0.12));
}

.career-map--refonte .career-map__legend-title {
  font-family: var(--rf-serif, Fraunces, Georgia, serif);
  color: var(--rf-ink, #1a1612);
}

.career-map--refonte .career-map__legend-sub {
  color: var(--rf-muted, #7a7268);
}

.career-map--refonte .career-map__color-legend {
  background: rgba(247, 242, 234, 0.92);
  border-color: var(--rf-line, rgba(26, 22, 18, 0.12));
}

.career-map--refonte .career-map__color-legend-title {
  color: var(--rf-muted, #7a7268);
}

.career-map--refonte .career-map__color-legend-item--active .career-map__color-label {
  color: var(--rf-accent, #b8432f);
}

.career-map--refonte .career-map__color-label {
  color: var(--rf-ink-soft, #4a433c);
}

.career-map--refonte .career-map__attribution {
  color: var(--rf-muted, #7a7268);
  background: rgba(247, 242, 234, 0.92);
  border-color: var(--rf-line, rgba(26, 22, 18, 0.12));
}

.career-map--refonte .career-map__canvas .leaflet-control-zoom {
  box-shadow: var(--rf-shadow, 0 8px 24px rgba(26, 22, 18, 0.12)) !important;
}

.career-map--refonte .career-map__canvas .leaflet-control-zoom a {
  background: rgba(247, 242, 234, 0.95) !important;
  color: var(--rf-ink, #1a1612) !important;
  border-bottom-color: var(--rf-line, rgba(26, 22, 18, 0.12)) !important;
}

.career-map--refonte .career-map__canvas .leaflet-control-zoom a:hover {
  background: rgba(184, 67, 47, 0.12) !important;
  color: var(--rf-accent, #b8432f) !important;
}

.career-map--refonte .metro-station--active .metro-station__workplace {
  border-color: rgba(184, 67, 47, 0.45);
  background: rgba(247, 242, 234, 0.95);
  color: var(--rf-ink, #1a1612);
}
</style>
