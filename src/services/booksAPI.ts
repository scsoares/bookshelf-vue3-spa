import type { Book } from '@/types/types.interface'

const BASE_URL = import.meta.env.BASE_URL

//I extracted total count of books in the getBooks call to define totalPages in Appp.vue and send it to BookListing.vue

export const getBooks = async (
  page: number,
  size: number,
  sortBy: string,
  order: 'asc' | 'desc',
  query?: string,
): Promise<{ data: Book[]; total: number }> => {
  try {
    const response = await fetch(
      `${BASE_URL}/books?_page=${page}&_limit=${size}&_sort=${sortBy}&_order=${order}&q=${query}`,
    )
    if (!response.ok) {
      throw new Error('Error fetching books.')
    }
    const data: Book[] = await response.json()
    const total = Number(response.headers.get('X-Total-Count'))
    return { data, total }
  } catch (error) {
    console.error('Error fetching books:', error)
    throw error
  }
}

export const getBookById = async (id: number): Promise<Book> => {
  try {
    const response = await fetch(`${BASE_URL}/books/${id}`)
    if (!response.ok) {
      throw new Error('Error fetching book by id.')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error fetching book by id:', error)
    throw error
  }
}

export const createBook = async (newBook: any): Promise<Book> => {
  try {
    const response = await fetch(`${BASE_URL}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBook),
    })
    if (!response.ok) {
      throw new Error('Error creating book.')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error creating book:', error)
    throw error
  }
}

export const editBook = async (id: number | undefined, newBookData: Book): Promise<Book> => {
  try {
    const response = await fetch(`${BASE_URL}/books/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newBookData),
    })

    if (!response.ok) {
      throw new Error('Error editing book.')
    }
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Error editing book:', error)
    throw error
  }
}

export const deleteBook = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${BASE_URL}/books/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Error deleting book.')
    }
  } catch (error) {
    console.error('Error deleting book:', error)
    throw error
  }
}
