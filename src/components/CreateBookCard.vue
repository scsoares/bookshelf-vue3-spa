<template>
  <div
    class="mt-10 h-1/3 w-full rounded-xl p-4"
    role="region"
    aria-labelledby="create-book-heading"
  >
    <strong id="create-book-heading" class="text-2xl">Add a new book:</strong>
    <form
      @submit.prevent="addBook"
      class="flex flex-col gap-4"
      aria-describedby="create-book-description"
    >
      <p id="create-book-description" class="sr-only">
        Fill out the form to add a new book. All fields are required.
      </p>

      <label for="title" class="sr-only">Book Title</label>
      <input
        v-model="title"
        id="title"
        type="text"
        placeholder="Title"
        class="rounded-lg border border-gray-300 p-2"
        required
        minlength="3"
        aria-required="true"
      />

      <label for="author" class="sr-only">Book Author</label>
      <input
        v-model="author"
        id="author"
        type="text"
        placeholder="Author"
        class="rounded-lg border border-gray-300 p-2"
        required
        minlength="3"
        aria-required="true"
      />

      <label for="published" class="sr-only">Publication date</label>
      <input
        v-model="published"
        id="published"
        type="date"
        placeholder="Publication Date"
        class="rounded-lg border border-gray-300 bg-white p-2"
        required
        aria-required="true"
        :max="today"
      />

      <label for="category" class="sr-only">Book Category</label>
      <select
        v-model="category"
        id="category"
        class="rounded-lg border border-gray-300 p-2"
        required
        aria-required="true"
      >
        <option disabled value="">Select a category</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.name">
          {{ cat.name }}
        </option>
      </select>

      <label for="stock" class="sr-only">Stock</label>
      <input
        v-model.number="stock"
        id="stock"
        type="number"
        placeholder="Stock"
        class="rounded-lg border border-gray-300 p-2"
        required
        min="1"
        aria-required="true"
      />

      <button
        type="submit"
        class="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
        aria-label="Add Book"
      >
        Add Book
      </button>
    </form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { createBook } from '../services/booksAPI'
import { categories } from '@/utils/categories'
import { today } from '@/utils/today'

const title = ref('')
const author = ref('')
const published = ref('')
const category = ref('')
const stock = ref(1)

const emit = defineEmits<{
  (e: 'bookCreated', wasBookCreated: boolean, msg: string): void
}>()

const addBook = async () => {
  const newBook = {
    title: title.value,
    author: author.value,
    published: published.value,
    category: category.value,
    stock: stock.value,
  }

  try {
    await createBook(newBook)
    title.value = ''
    author.value = ''
    published.value = ''
    category.value = ''
    stock.value = 1
    emit('bookCreated', true, 'Book was succesfully created')
  } catch (error) {
    emit('bookCreated', false, 'Book was not created. Try again')
  }
}
</script>
