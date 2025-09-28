<template>
  <div
    :class="[
      'transition-translation m-1 flex cursor-pointer items-center justify-between rounded-xl bg-blue-200 p-3 duration-200 hover:-translate-x-3 hover:bg-blue-100',
      selectedBookId === book.id ? '-translate-x-3 bg-blue-300 hover:bg-blue-300' : '',
    ]"
    role="button"
    tabindex="0"
    :aria-pressed="selectedBookId === book.id"
    :aria-label="`Book titled ${book.title} by ${book.author}${selectedBookId === book.id ? ', selected' : ''}`"
    @click="$emit('click')"
    @keydown.enter.prevent="$emit('click')"
    @keydown.space.prevent="$emit('click')"
  >
    <div class="flex items-center justify-center gap-2">
      <div>
        <img
          v-if="selectedBookId === book.id"
          src="../assets/icons/openBookIcon.svg"
          alt="Open Book Icon"
          class="h-12 w-12"
        />
        <img v-else src="../assets/icons/bookIcon.svg" alt="Closed Book Icon" class="h-12 w-12" />
      </div>
      <div class="flex flex-col">
        <h3 class="max-w-48 truncate text-xl font-bold lg:max-w-96">{{ book.title }}</h3>
        <h4>{{ book.author }}</h4>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Book } from '../types/types.interface'

defineProps({
  book: {
    type: Object as () => Book,
    required: true,
  },
  selectedBookId: {
    type: Number,
    required: false,
  },
})
</script>
