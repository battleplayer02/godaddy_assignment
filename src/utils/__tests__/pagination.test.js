import { describe, it, expect } from 'vitest'

// Mock the pagination logic from App component
const getPageNumbers = (currentPage, totalPages, maxVisiblePages = 7) => {
  const pages = []
  
  if (totalPages <= maxVisiblePages) {
    // Show all pages if total is less than max visible
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Show pages around current page with ellipsis
    if (currentPage <= 4) {
      // Near start
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(totalPages)
    } else if (currentPage >= totalPages - 3) {
      // Near end
      pages.push(1)
      pages.push('...')
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Middle
      pages.push(1)
      pages.push('...')
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(totalPages)
    }
  }
  
  return pages
}

describe('Pagination Logic', () => {
  describe('getPageNumbers', () => {
    it('returns all pages when total pages is less than max visible', () => {
      const result = getPageNumbers(1, 5, 7)
      expect(result).toEqual([1, 2, 3, 4, 5])
    })

    it('returns all pages when total pages equals max visible', () => {
      const result = getPageNumbers(1, 7, 7)
      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7])
    })

    it('shows start pages with ellipsis when current page is near start', () => {
      const result = getPageNumbers(2, 10, 7)
      expect(result).toEqual([1, 2, 3, 4, 5, '...', 10])
    })

    it('shows end pages with ellipsis when current page is near end', () => {
      const result = getPageNumbers(8, 10, 7)
      expect(result).toEqual([1, '...', 6, 7, 8, 9, 10])
    })

    it('shows middle pages with ellipsis on both sides when current page is in middle', () => {
      const result = getPageNumbers(5, 10, 7)
      expect(result).toEqual([1, '...', 4, 5, 6, '...', 10])
    })

    it('handles edge case when current page is exactly at the boundary', () => {
      const result = getPageNumbers(4, 10, 7)
      expect(result).toEqual([1, 2, 3, 4, 5, '...', 10])
    })

    it('handles single page', () => {
      const result = getPageNumbers(1, 1, 7)
      expect(result).toEqual([1])
    })

    it('handles two pages', () => {
      const result = getPageNumbers(1, 2, 7)
      expect(result).toEqual([1, 2])
    })

    it('handles large number of pages', () => {
      const result = getPageNumbers(50, 100, 7)
      expect(result).toEqual([1, '...', 49, 50, 51, '...', 100])
    })
  })

  describe('Page calculation', () => {
    it('calculates total pages correctly', () => {
      const totalRepos = 95
      const perPage = 10
      const totalPages = Math.ceil(totalRepos / perPage)
      expect(totalPages).toBe(10)
    })

    it('calculates total pages with exact division', () => {
      const totalRepos = 100
      const perPage = 10
      const totalPages = Math.ceil(totalRepos / perPage)
      expect(totalPages).toBe(10)
    })

    it('calculates total pages with remainder', () => {
      const totalRepos = 101
      const perPage = 10
      const totalPages = Math.ceil(totalRepos / perPage)
      expect(totalPages).toBe(11)
    })
  })
}) 