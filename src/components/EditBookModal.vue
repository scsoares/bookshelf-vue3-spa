<template>
  <teleport to="body">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
      :aria-labelledby="'edit-modal-title'"
      :aria-describedby="'edit-modal-desc'"
      @keydown.esc.prevent="emit('closeEdit')"
    >
      <div class="rounded-xl bg-white p-12 shadow-lg" tabindex="0">
        <h2 id="edit-modal-title" class="mb-4 text-xl font-bold">Edit book:</h2>
        <p id="edit-modal-desc" class="sr-only">
          Edit the book details in the form below. All the fields are required.
        </p>

        <form @submit.prevent="handleEditBook" class="flex flex-col gap-4">
          <label for="edit-title" class="sr-only">Title</label>
          <input
            v-model="title"
            id="edit-title"
            type="text"
            placeholder="Title"
            class="rounded-lg border p-2"
            required
            aria-required="true"
          />

          <label for="edit-author" class="sr-only">Author</label>
          <input
            v-model="author"
            id="edit-author"
            type="text"
            placeholder="Author"
            class="rounded-lg border p-2"
            required
            aria-required="true"
          />

          <label for="edit-published" class="sr-only">Publication date</label>
          <input
            v-model="published"
            id="edit-published"
            type="date"
            placeholder="Publication date"
            class="rounded-lg border bg-white p-2"
            required
            aria-required="true"
            :max="today"
          />

          <label for="edit-category" class="sr-only">Category</label>
          <select
            v-model="category"
            id="edit-category"
            class="rounded-lg border p-2"
            required
            aria-required="true"
          >
            <option disabled value="">Select a category</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.name">
              {{ cat.name }}
            </option>
          </select>

          <label for="edit-stock" class="sr-only">Stock</label>
          <input
            v-model.number="stock"
            id="edit-stock"
            type="number"
            placeholder="Stock"
            class="rounded-lg border p-2"
            required
            min="1"
            aria-required="true"
          />

          <div class="flex w-full justify-between">
            <button
              type="button"
              @click="$emit('closeEdit')"
              class="rounded-lg bg-gray-200 px-4 py-2 text-black hover:bg-gray-300"
              aria-label="Close edit form"
            >
              Close
            </button>
            <button
              type="submit"
              class="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              aria-label="Save changes to book"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { categories } from '@/utils/categories'
import { editBook } from '@/services/booksAPI'
import type { Book } from '@/types/types.interface'
import { today } from '@/utils/today'

const props = defineProps<{
  isOpen: boolean
  bookToEdit: Book | null
}>()

const emit = defineEmits<{
  (e: 'closeEdit'): void
  (e: 'confirmEdit', editedBookObj: any): void
}>()

const title = ref(props.bookToEdit?.title || '')
const author = ref(props.bookToEdit?.author || '')
const published = ref(props.bookToEdit?.published || '')
const category = ref(props.bookToEdit?.category || '')
const stock = ref(props.bookToEdit?.stock || 1)

const handleEditBook = async () => {
  if (!props.bookToEdit) return

  const editBookData = {
    title: title.value,
    author: author.value,
    published: published.value,
    category: category.value,
    stock: stock.value,
  }

  try {
    await editBook(props.bookToEdit.id, editBookData)
    emit('confirmEdit', editBookData)
  } catch (error) {
    console.error('Error editing book:', error)
  }
}

watch(
  () => props.bookToEdit,
  (newBook) => {
    if (newBook) {
      title.value = newBook.title
      author.value = newBook.author
      published.value = newBook.published
      category.value = newBook.category
      stock.value = newBook.stock
    }
  },
  { immediate: true },
)
</script>
