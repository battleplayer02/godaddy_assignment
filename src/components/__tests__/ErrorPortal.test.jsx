import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import ErrorPortal from '../ErrorPortal'

// Mock createPortal
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom')
  return {
    ...actual,
    createPortal: (children, container) => children
  }
})

describe('ErrorPortal', () => {
  const mockError = {
    status: 403,
    message: 'API rate limit exceeded',
    documentation_url: 'https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting'
  }

  const defaultProps = {
    error: mockError,
    isOpen: true,
    onClose: vi.fn()
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing when not open', () => {
    render(<ErrorPortal {...defaultProps} isOpen={false} />)
    
    expect(screen.queryByText('⚠️ API Error')).not.toBeInTheDocument()
  })

  it('renders nothing when no error provided', () => {
    render(<ErrorPortal {...defaultProps} error={null} />)
    
    expect(screen.queryByText('⚠️ API Error')).not.toBeInTheDocument()
  })

  it('renders error title', () => {
    render(<ErrorPortal {...defaultProps} />)
    
    expect(screen.getByText('⚠️ API Error')).toBeInTheDocument()
  })

  it('renders error message', () => {
    render(<ErrorPortal {...defaultProps} />)
    
    expect(screen.getByText('Failed to fetch repositories')).toBeInTheDocument()
  })

  it('renders error details', () => {
    render(<ErrorPortal {...defaultProps} />)
    
    expect(screen.getByText('Status Code:')).toBeInTheDocument()
    expect(screen.getByText('403')).toBeInTheDocument()
    expect(screen.getByText('Error Message:')).toBeInTheDocument()
    expect(screen.getByText('API rate limit exceeded')).toBeInTheDocument()
  })

  it('renders documentation link when provided', () => {
    render(<ErrorPortal {...defaultProps} />)
    
    const docLink = screen.getByText('View GitHub API Documentation')
    expect(docLink).toBeInTheDocument()
    expect(docLink).toHaveAttribute('href', mockError.documentation_url)
  })

  it('does not render documentation link when not provided', () => {
    const errorWithoutDoc = {
      ...mockError,
      documentation_url: null
    }
    
    render(<ErrorPortal {...defaultProps} error={errorWithoutDoc} />)
    
    expect(screen.queryByText('View GitHub API Documentation')).not.toBeInTheDocument()
  })

  it('renders action buttons', () => {
    render(<ErrorPortal {...defaultProps} />)
    
    expect(screen.getByText('🔄 Retry')).toBeInTheDocument()
    expect(screen.getByText('Close')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    const mockOnClose = vi.fn()
    render(<ErrorPortal {...defaultProps} onClose={mockOnClose} />)
    
    const closeButton = screen.getByText('×')
    fireEvent.click(closeButton)
    
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('calls onClose when close action button is clicked', () => {
    const mockOnClose = vi.fn()
    render(<ErrorPortal {...defaultProps} onClose={mockOnClose} />)
    
    const closeActionButton = screen.getByText('Close')
    fireEvent.click(closeActionButton)
    
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('renders fallback error message when no message provided', () => {
    const errorWithoutMessage = {
      ...mockError,
      message: null
    }
    
    render(<ErrorPortal {...defaultProps} error={errorWithoutMessage} />)
    
    expect(screen.getByText('An unexpected error occurred while fetching data from GitHub API.')).toBeInTheDocument()
  })

  it('renders fallback status when no status provided', () => {
    const errorWithoutStatus = {
      ...mockError,
      status: null
    }
    
    render(<ErrorPortal {...defaultProps} error={errorWithoutStatus} />)
    
    expect(screen.getByText('Unknown')).toBeInTheDocument()
  })

  it('has correct portal structure', () => {
    render(<ErrorPortal {...defaultProps} />)
    
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('renders error icon', () => {
    render(<ErrorPortal {...defaultProps} />)
    
    expect(screen.getByText('🚨')).toBeInTheDocument()
  })
}) 