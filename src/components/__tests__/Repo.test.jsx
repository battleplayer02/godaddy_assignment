import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import Repo from '../Repo'

describe('Repo', () => {
  const mockRepoData = {
    id: 1,
    name: 'test-repo',
    description: 'A test repository',
    stargazers_count: 100,
    forks_count: 50,
    watchers_count: 25
  }

  it('renders repository name', () => {
    render(<Repo repoData={mockRepoData} onRepoClick={() => {}} />)
    
    expect(screen.getByText('test-repo')).toBeInTheDocument()
  })

  it('renders repository description', () => {
    render(<Repo repoData={mockRepoData} onRepoClick={() => {}} />)
    
    expect(screen.getByText('A test repository')).toBeInTheDocument()
  })

  it('renders repository stats', () => {
    render(<Repo repoData={mockRepoData} onRepoClick={() => {}} />)
    
    expect(screen.getByText('⭐ 100')).toBeInTheDocument()
    expect(screen.getByText('🍴 50')).toBeInTheDocument()
    expect(screen.getByText('👀 25')).toBeInTheDocument()
  })

  it('calls onRepoClick when clicked', () => {
    const mockOnClick = vi.fn()
    render(<Repo repoData={mockRepoData} onRepoClick={mockOnClick} />)
    
    const repoCard = screen.getByText('test-repo').closest('.repo-card')
    fireEvent.click(repoCard)
    
    expect(mockOnClick).toHaveBeenCalledWith(mockRepoData)
  })

  it('renders fallback description when no description provided', () => {
    const repoWithoutDescription = {
      ...mockRepoData,
      description: null
    }
    
    render(<Repo repoData={repoWithoutDescription} onRepoClick={() => {}} />)
    
    expect(screen.getByText('No description available')).toBeInTheDocument()
  })

  it('has correct styling classes', () => {
    render(<Repo repoData={mockRepoData} onRepoClick={() => {}} />)
    
    const repoCard = screen.getByText('test-repo').closest('.repo-card')
    expect(repoCard).toHaveClass('repo-card')
  })
}) 