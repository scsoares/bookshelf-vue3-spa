<template>
  <Header />
  <Toast
    :message="toastMessage"
    :isVisible="isToastVisible"
    @hideToast="isToastVisible = false"
    :isToastSuccess="isToastSuccess"
  />
  <div class="flex h-full w-full flex-col justify-center bg-white lg:flex-row">
    <div class="w-full flex-col items-center justify-start p-10 lg:h-screen lg:w-1/2 lg:flex-col">
      <BookListing
        :books="books"
        role="region"
        aria-label="Book list with sorting options"
        @sortOptionSelected="changeSortOption"
        @orderOptionSelected="changeOrderOption"
        @selectBook="seeBookDetails"
      />

      <div class="mt-5 flex w-full flex-col items-center justify-between lg:mt-0 lg:flex-row">
        <div class="w-full lg:w-1/2">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search books by title, author or category"
            aria-label="Search books"
            class="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div
          class="mt-4 flex items-center justify-center gap-10"
          role="navigation"
          aria-label="Pagination Navigation"
        >
          <div class="flex items-center justify-center gap-6">
            <div
              v-if="page > 2"
              class="cursor-pointer text-3xl text-blue-500"
              role="button"
              tabindex="0"
              aria-label="Go to first page"
              @click="page = 1"
            >
              &lt;&lt;
            </div>
            <div
              v-if="page !== 1"
              class="cursor-pointer text-3xl text-blue-500"
              role="button"
              tabindex="0"
              aria-label="Go to previous page"
              @click="page--"
            >
              &lt;
            </div>
          </div>

          <div class="text-2xl" aria-live="polite">
            page {{ books.length ? page : 0 }} of {{ totalPages }}
          </div>

          <div class="flex items-center justify-center gap-6">
            <div
              v-if="books.length !== 0 && page !== totalPages"
              class="cursor-pointer text-3xl text-blue-500"
              role="button"
              tabindex="0"
              aria-label="Go to next page"
              @click="page++"
            >
              &gt;
            </div>
            <div
              v-if="books.length !== 0 && page < totalPages - 1"
              class="cursor-pointer text-3xl text-blue-500"
              role="button"
              tabindex="0"
              aria-label="Go to last page"
              @click="page = totalPages"
            >
              &gt;&gt;
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="align-center mt-5 flex h-screen flex-col items-center">
      <BookDetailsCard
        :selectedBookId="selectedBookId"
        role="region"
        aria-label="Book details"
        @bookDeleted="handleDeleteConfirmed"
        @bookEdited="handleEditConfirmed"
      />
      <CreateBookCard
        role="region"
        aria-label="Create new book form"
        @bookCreated="handleCreationConfirmed"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import Header from './components/Header.vue'
import BookListing from './components/BookListing.vue'
import BookDetailsCard from './components/BookDetailsCard.vue'
import CreateBookCard from './components/CreateBookCard.vue'
import { getBooks } from './services/booksAPI'
import type { Book } from './types/types.interface'
import Toast from './components/Toast.vue'

const books = ref<Book[]>([])
const errorMessage = ref<string | null>(null)
const selectedBookId = ref<number>()
const page = ref<number>(1)
const itemsPerPage = 10
const sortBy = ref<string>('title')
const orderBy = ref<'asc' | 'desc'>('asc')
const totalPages = ref<number>(1)
const searchQuery = ref<string>('')
const debouncedSearchQuery = ref('')
let debounceTimeout: number | undefined
const toastMessage = ref('')
const isToastVisible = ref(false)
const isToastSuccess = ref(true)

const listBooks = async (
  page: number,
  itemsPerPage: number,
  sort: string,
  order: 'asc' | 'desc',
  query: string,
) => {
  try {
    const data = await getBooks(page, itemsPerPage, sort, order, query)
    books.value = data.data
    totalPages.value = Math.ceil(data.total / itemsPerPage)
  } catch (error) {
    errorMessage.value = 'Error fetching books.'
  }
}

const seeBookDetails = (bookId: number) => {
  selectedBookId.value = bookId
}

const showToast = (isSuccess: boolean, message: string) => {
  isToastVisible.value = true
  isToastSuccess.value = isSuccess
  toastMessage.value = message
}

const filters = computed(() => ({
  page: page.value,
  sortBy: sortBy.value,
  orderBy: orderBy.value,
  query: debouncedSearchQuery.value,
}))

const handleDeleteConfirmed = async (wasBookDeleted: boolean, msg: string) => {
  if (!wasBookDeleted) {
    showToast(false, msg)
    return
  }
  await listBooks(page.value, itemsPerPage, sortBy.value, orderBy.value, (searchQuery.value = ''))
  showToast(true, msg)
}

const handleCreationConfirmed = async (wasBookCreated: boolean, msg: string) => {
  if (!wasBookCreated) {
    showToast(false, msg)
    return
  }
  await listBooks(
    (page.value = 1),
    itemsPerPage,
    sortBy.value,
    orderBy.value,
    (searchQuery.value = ''),
  )
  showToast(true, msg)
}

const handleEditConfirmed = async (wasBookEdited: boolean, msg: string) => {
  if (!wasBookEdited) {
    showToast(false, msg)
    return
  }
  await listBooks(
    (page.value = 1),
    itemsPerPage,
    sortBy.value,
    orderBy.value,
    (searchQuery.value = ''),
  )
  showToast(true, msg)
}

const changeSortOption = (sort: string) => {
  page.value = 1
  sortBy.value = sort
}

const changeOrderOption = (order: 'asc' | 'desc') => {
  page.value = 1
  orderBy.value = order
}

watch(
  filters,
  async (newVal, oldVal) => {
    if (
      newVal.page !== oldVal?.page ||
      newVal.sortBy !== oldVal?.sortBy ||
      newVal.orderBy !== oldVal?.orderBy ||
      newVal.query !== oldVal?.query
    ) {
      await listBooks(newVal.page, itemsPerPage, newVal.sortBy, newVal.orderBy, newVal.query)
    }
  },
  { immediate: true },
)

watch(
  () => books.value.length,
  async (newLength, oldLength) => {
    if (newLength !== oldLength) {
      await listBooks(page.value, itemsPerPage, sortBy.value, orderBy.value, searchQuery.value)
    }
  },
)

watch(searchQuery, (newVal) => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  debounceTimeout = window.setTimeout(() => {
    debouncedSearchQuery.value = newVal
    page.value = 1
  }, 500)
})
</script>
