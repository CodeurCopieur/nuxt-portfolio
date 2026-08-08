<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin-auth' })

await navigateTo('/admin/meta', { replace: true })
</script>
