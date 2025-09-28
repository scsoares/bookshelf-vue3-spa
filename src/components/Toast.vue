<template>
  <teleport to="body">
    <div
      v-if="isVisible"
      class="fixed bottom-5 right-5 z-50 max-w-xs rounded-lg bg-green-600 px-4 py-3 text-white"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {{ message }}
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps<{
  message: string
  duration?: number
  isVisible: boolean
}>()

const emit = defineEmits<{
  (e: 'hideToast'): void
}>()

const hide = () => {
  emit('hideToast')
}

watch(
  () => props.isVisible,
  (visible) => {
    if (visible) {
      const duration = props.duration ?? 3000
      setTimeout(hide, duration)
    }
  },
)
</script>
