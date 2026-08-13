<script setup lang="ts">

import BootScreen from '@/components/desktop/BootScreen.vue'

import MenuBar from '@/components/desktop/MenuBar.vue'

import Dock from '@/components/desktop/Dock.vue'
import DesktopControlCenter from '@/components/desktop/DesktopControlCenter.vue'
import WindowManager from '@/components/desktop/WindowManager.vue'
import ParcoursCommuteSidebar from '@/components/desktop/ParcoursCommuteSidebar.vue'

import AchievementToast from '@/components/gamification/AchievementToast.vue'

import type { DesktopAppId } from '~/data/desktop-apps'

import { useDesktopStore } from '@/store/useDesktop'



const desktop = useDesktopStore()

const route = useRoute()

const router = useRouter()



onMounted(() => {

  desktop.hydrateBoot()
  desktop.hydrateWallpaper()



  const app = route.query.app as string | undefined

  const slug = route.query.slug as string | undefined



  function openFromQuery() {

    if (app === 'project' && slug) {

      desktop.openApp('project', { slug })

    } else if (app && ['about', 'parcours', 'skills', 'projets', 'mail'].includes(app)) {

      desktop.openApp(app as DesktopAppId)

    }

    router.replace({ path: '/game' })

  }



  if (app && desktop.booted) {

    openFromQuery()

  } else if (app && !desktop.booted) {

    watch(() => desktop.booted, (booted) => {

      if (booted) openFromQuery()

    }, { once: true })

  }

})



function openApp(appId: DesktopAppId) {

  desktop.openApp(appId)

}

</script>



<template>

  <BootScreen />



  <div

    v-if="desktop.booted"

    class="desktop-shell fixed inset-0 overflow-hidden select-none"

  >

    <div class="desktop-wallpaper absolute inset-0" :style="desktop.wallpaperStyle" />

    <div class="desktop-noise absolute inset-0 opacity-[0.02]" />



    <MenuBar @logout="desktop.logout()" />

    <ClientOnly>
      <DesktopControlCenter />
    </ClientOnly>

    <WindowManager />

    <ClientOnly>
      <ParcoursCommuteSidebar />
    </ClientOnly>

    <Dock @open="openApp" />



    <ClientOnly>

      <AchievementToast />

    </ClientOnly>

  </div>

</template>



<style scoped>

.desktop-shell {

  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', system-ui, sans-serif;

}



/* Fond dynamique via desktop.wallpaperStyle */

.desktop-wallpaper {
  transition: background 0.45s ease;
}



.desktop-noise {

  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");

}

</style>

