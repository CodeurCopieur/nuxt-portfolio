// plugins/swiper.client.ts
import { Swiper } from 'swiper'
import { Navigation, Pagination, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      Swiper,
      Navigation,
      Pagination,
      Autoplay
    }
  }
})
