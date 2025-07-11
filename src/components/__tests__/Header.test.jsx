import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import Header from '../Header'

describe('Header', () => {
  it('renders the header with correct title', () => {
    render(<Header />)
    
    expect(screen.getByText('GoDaddy GitHub Repositories')).toBeInTheDocument()
  })

  it('renders the subtitle text', () => {
    render(<Header />)
    
    expect(screen.getByText('Explore open source projects by GoDaddy')).toBeInTheDocument()
  })

  it('renders header with correct structure', () => {
    render(<Header />)
    
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
    expect(header).toHaveClass('header')
  })

  it('contains h1 element with title', () => {
    render(<Header />)
    
    const title = screen.getByRole('heading', { level: 1 })
    expect(title).toBeInTheDocument()
    expect(title).toHaveTextContent('GoDaddy GitHub Repositories')
  })
}) 