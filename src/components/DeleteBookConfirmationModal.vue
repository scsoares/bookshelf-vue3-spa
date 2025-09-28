<template>
  <teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="'delete-modal-title'"
      :aria-describedby="'delete-modal-desc'"
      @keydown.esc.prevent="emit('closeDelete')"
    >
      <div class="mx-5 rounded-xl bg-white p-6 shadow-lg lg:mx-0" tabindex="0">
        <h2 id="delete-modal-title" class="mb-4 text-xl font-bold">Confirm Deletion</h2>
        <p id="delete-modal-desc" class="mb-4">
          Are you sure you want to delete
          <strong>{{ bookTitle }}</strong> by <strong>{{ bookAuthor }}</strong
          >?
        </p>
        <div class="flex justify-end space-x-4">
          <button
            class="rounded-lg bg-gray-300 px-4 py-2 hover:bg-gray-400"
            @click="emit('closeDelete')"
            aria-label="Cancel deletion"
          >
            Cancel
          </button>
          <button
            class="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
            @click="emit('confirmDelete')"
            aria-label="Confirm deletion"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  bookTitle: {
    type: String,
    required: true,
  },
  bookAuthor: {
    type: String,
    required: false,
    default: 'Unknown Author',
  },
})

const emit = defineEmits<{
  (e: 'closeDelete'): void
  (e: 'confirmDelete'): void
}>()
</script>
