<template>
  <div class="h-full w-full" role="region" aria-label="Book list section">
    <div class="flex h-1/2 flex-col justify-start gap-5">
      <div class="flex items-center justify-between gap-10 pr-2">
        <strong class="text-3xl" id="books-heading">Your books</strong>

        <div class="flex items-end gap-5">
          <strong id="sort-label">Sort by:</strong>

          <select
            class=":border-blue-400 rounded-md border-2 border-blue-400 bg-white p-1 focus:border-2 focus:border-blue-500 focus:outline-none"
            v-model="sort"
            @change="$emit('sortOptionSelected', sort)"
            aria-labelledby="sort-label"
          >
            <option value="title">Title</option>
            <option value="published">Publication date</option>
            <option value="stock">Stock number</option>
          </select>

          <select
            class=":border-blue-400 rounded-md border-2 border-blue-400 bg-white p-1 focus:border-2 focus:border-blue-500 focus:outline-none"
            v-model="order"
            @change="$emit('orderOptionSelected', order)"
            aria-label="Sort order"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      <div v-if="books.length">
        <div
          class="h-148 flex flex-col justify-between"
          role="list"
          aria-labelledby="books-heading"
        >
          <BookOverviewItem
            v-for="book in books"
            :key="book.id"
            :book="book"
            :selectedBookId="selectedBookId"
            role="listitem"
            @click="(selectBook(book), $emit('selectBook', book.id))"
          />
        </div>
      </div>

      <div v-else class="my-10 text-3xl text-gray-400" role="status" aria-live="polite">
        No books found.
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Book } from '../types/types.interface'
import BookOverviewItem from './BookOverviewItem.vue'

const selectedBookId = ref<number | null>(null)
const sort = ref<string>('title')
const order = ref<string>('asc')

defineProps({
  books: {
    type: Array as () => Book[],
    required: true,
  },
})

const selectBook = (book: Book) => {
  selectedBookId.value = book.id
}
</script>
