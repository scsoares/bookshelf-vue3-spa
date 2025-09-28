<template>
  <DeleteBookConfirmationModal
    :isOpen="isDeleteOpen"
    :bookTitle="selectedBook ? selectedBook.title : ''"
    :bookAuthor="selectedBook ? selectedBook.author : ''"
    @closeDelete="isDeleteOpen = false"
    @confirmDelete="handleDeleteBook"
  />
  <EditBookModal
    :isOpen="isEditOpen"
    :bookToEdit="selectedBook ? selectedBook : null"
    @closeEdit="isEditOpen = false"
    @confirmEdit="handleConfirmedEdit"
  />

  <div
    v-if="selectedBook"
    class="py-auto text-align-start m-2 flex h-1/3 w-96 flex-col items-center justify-center rounded-2xl border-2 border-blue-400 p-4"
    role="region"
    aria-labelledby="book-details-heading"
  >
    <h2 id="book-details-heading" class="mb-4 text-2xl font-bold">Book details</h2>
    <p><strong>Title:</strong> {{ selectedBook.title }}</p>
    <p><strong>Author:</strong> {{ selectedBook.author }}</p>
    <p><strong>Publication date:</strong> {{ reverseDate(selectedBook.published) }}</p>
    <p><strong>Category:</strong> {{ selectedBook.category }}</p>
    <p class="mt-4 text-2xl">
      <strong>{{ selectedBook.stock }}</strong> in stock
    </p>

    <div class="mt-4 flex gap-3">
      <button
        class="rounded-lg bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        @click="
          () => {
            isEditOpen = true
          }
        "
        aria-label="Edit this book"
      >
        Edit book
      </button>
      <button
        class="rounded-lg bg-red-500 px-4 py-2 font-bold text-white hover:bg-red-700"
        @click="
          () => {
            isDeleteOpen = true
          }
        "
        aria-label="Delete this book"
      >
        Delete book
      </button>
    </div>
  </div>

  <div
    v-else
    class="m-2 flex h-1/3 w-96 flex-col items-center justify-center rounded-xl border-2 border-blue-400 p-4"
    role="region"
    aria-label="No book selected"
  >
    <h2 class="mb-4 text-center text-xl font-bold">Select a book to see its details.</h2>
    <img
      class="mx-auto h-60 w-60"
      src="@/assets/images/undraw_road-to-knowledge_f9zn.svg"
      alt="Book Illustration"
    />
  </div>
</template>

<script setup lang="ts">
import type { Book } from '../types/types.interface'
import { ref, watch, defineProps } from 'vue'
import { getBookById, deleteBook } from '../services/booksAPI'
import reverseDate from '../utils/reverseDate'
import DeleteBookConfirmationModal from './DeleteBookConfirmationModal.vue'
import EditBookModal from './EditBookModal.vue'

const selectedBook = ref<Book | null>(null)
const isDeleteOpen = ref(false)
const isEditOpen = ref(false)

const props = defineProps({
  selectedBookId: {
    type: Number,
    required: false,
  },
})

const emit = defineEmits<{
  (e: 'bookDeleted', wasBookDeleted: boolean, msg: string): void
  (e: 'bookEdited', wasBookEdited: boolean, msg: string): void
}>()

const getBookDetails = async (bookId: number) => {
  try {
    const data = await getBookById(bookId)
    selectedBook.value = data
  } catch (error) {
    console.log('Error fetching book details')
  }
}

const handleDeleteBook = async () => {
  if (selectedBook.value) {
    try {
      await deleteBook(selectedBook.value.id)
      selectedBook.value = null
      isDeleteOpen.value = false
      emit('bookDeleted', true, 'Book was deleted succesfully')
    } catch (error) {
      emit('bookDeleted', false, 'Book was not deleted. Try again')
    }
  }
}

const handleConfirmedEdit = (editedBook: Book) => {
  if (editedBook) {
    selectedBook.value = {
      ...selectedBook.value,
      ...editedBook,
    }
    isEditOpen.value = false
    emit('bookEdited', true, 'Book was edited succesfully')
  } else {
    emit('bookEdited', false, 'Book was not edited. Try again.')
  }
}

watch(
  () => props.selectedBookId,
  (newId) => {
    if (newId) getBookDetails(newId)
  },
  { immediate: true },
)
</script>
