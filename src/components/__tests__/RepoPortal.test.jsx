import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import RepoPortal from '../RepoPortal'

// Mock createPortal
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom')
  return {
    ...actual,
    createPortal: (children, container) => children
  }
})

describe('RepoPortal', () => {
  const mockRepo = {
    id: 1,
    name: 'test-repo',
    description: 'A test repository description',
    language: 'JavaScript',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-12-01T00:00:00Z',
    size: 1024,
    stargazers_count: 100,
    forks_count: 50,
    watchers_count: 25,
    open_issues_count: 10,
    html_url: 'https://github.com/test/repo',
    homepage: 'https://test-repo.com'
  }

  const defaultProps = {
    repo: mockRepo,
    isOpen: true,
    onClose: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing when not open', () => {
    render(<RepoPortal {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText('test-repo')).not.toBeInTheDocument()
  })

  it('renders nothing when no repo provided', () => {
    render(<RepoPortal {...defaultProps} repo={null} />)
    
    expect(screen.queryByText('test-repo')).not.toBeInTheDocument()
  })

  it('renders repository name in header', () => {
    render(<RepoPortal {...defaultProps} />)
    
    expect(screen.getByText('test-repo')).toBeInTheDocument()
  })

  it('renders repository description', () => {
    render(<RepoPortal {...defaultProps} />)
    
    expect(screen.getByText('A test repository description')).toBeInTheDocument()
  })

  it('renders repository details', () => {
    render(<RepoPortal {...defaultProps} />)
    
    expect(screen.getByText('Language:')).toBeInTheDocument()
    expect(screen.getByText('JavaScript')).toBeInTheDocument()
    expect(screen.getByText('Created:')).toBeInTheDocument()
    expect(screen.getByText('Last Updated:')).toBeInTheDocument()
    expect(screen.getByText('Size:')).toBeInTheDocument()
    expect(screen.getByText('1024 KB')).toBeInTheDocument()
  })

  it('renders repository stats', () => {
    render(<RepoPortal {...defaultProps} />)
    
    expect(screen.getByText('⭐ 100')).toBeInTheDocument()
    expect(screen.getByText('🍴 50')).toBeInTheDocument()
    expect(screen.getByText('👀 25')).toBeInTheDocument()
    expect(screen.getByText('📁 10')).toBeInTheDocument()
  })

  it('renders action buttons', () => {
    render(<RepoPortal {...defaultProps} />)
    
    expect(screen.getByText('View on GitHub')).toBeInTheDocument()
    expect(screen.getByText('Visit Homepage')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const mockOnClose = vi.fn()
    render(<RepoPortal {...defaultProps} onClose={mockOnClose} />)
    
    const closeButton = screen.getByText('×')
    fireEvent.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('renders fallback description when no description provided', () => {
    const repoWithoutDescription = {
      ...mockRepo,
      description: null
    }
    
    render(<RepoPortal {...defaultProps} repo={repoWithoutDescription} />)
    
    expect(screen.getByText('No description available')).toBeInTheDocument()
  })

  it('renders fallback language when no language provided', () => {
    const repoWithoutLanguage = {
      ...mockRepo,
      language: null
    }
    
    render(<RepoPortal {...defaultProps} repo={repoWithoutLanguage} />)
    
    expect(screen.getByText('Not specified')).toBeInTheDocument()
  })

  it('does not render homepage button when no homepage', () => {
    const repoWithoutHomepage = {
      ...mockRepo,
      homepage: null
    }
    
    render(<RepoPortal {...defaultProps} repo={repoWithoutHomepage} />)
    
    expect(screen.getByText('View on GitHub')).toBeInTheDocument()
    expect(screen.queryByText('Visit Homepage')).not.toBeInTheDocument()
  })

  it('has correct portal structure', () => {
    render(<RepoPortal {...defaultProps} />)
    
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
}) 