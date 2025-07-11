import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import App from '../App'

// Mock fetch
global.fetch = vi.fn()

// Mock components to isolate App testing
vi.mock('../components/Header', () => ({
  default: function MockHeader() {
    return <div data-testid="header">Header</div>
  }
}))

vi.mock('../components/Repo', () => ({
  default: function MockRepo({ repoData, onRepoClick }) {
    return (
      <div 
        data-testid="repo-card" 
        onClick={() => onRepoClick(repoData)}
      >
        {repoData.name}
      </div>
    )
  }
}))

vi.mock('../components/RepoPortal', () => ({
  default: function MockRepoPortal({ repo, isOpen, onClose }) {
    if (!isOpen || !repo) return null
    return (
      <div data-testid="repo-portal">
        <button onClick={onClose}>Close Portal</button>
        {repo.name}
      </div>
    )
  }
}))

vi.mock('../components/ErrorPortal', () => ({
  default: function MockErrorPortal({ error, isOpen, onClose }) {
    if (!isOpen || !error) return null
    return (
      <div data-testid="error-portal">
        <button onClick={onClose}>Close Error</button>
        {error.message}
      </div>
    )
  }
}))

describe('App', () => {
  const mockRepos = [
    {
      id: 1,
      name: 'repo-1',
      description: 'First repository',
      stargazers_count: 100,
      forks_count: 50,
      watchers_count: 25
    },
    {
      id: 2,
      name: 'repo-2',
      description: 'Second repository',
      stargazers_count: 200,
      forks_count: 100,
      watchers_count: 50
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset fetch mock
    fetch.mockClear()
  })

  it('renders header', () => {
    render(<App />)
    
    expect(screen.getByTestId('header')).toBeInTheDocument()
  })

  it('shows loading state initially', () => {
    render(<App />)
    
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('fetches and displays repositories on mount', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepos,
      headers: {
        get: () => '<https://api.github.com/orgs/godaddy/repos?page=1&per_page=10>; rel="last"'
      }
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('repo-1')).toBeInTheDocument()
      expect(screen.getByText('repo-2')).toBeInTheDocument()
    })
  })

  it('handles API errors correctly', async () => {
    const errorResponse = {
      ok: false,
      status: 403,
      json: async () => ({
        message: 'API rate limit exceeded',
        documentation_url: 'https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting'
      })
    }

    fetch.mockResolvedValueOnce(errorResponse)

    render(<App />)

    await waitFor(() => {
      expect(screen.getByTestId('error-portal')).toBeInTheDocument()
      expect(screen.getByText('API rate limit exceeded')).toBeInTheDocument()
    })
  })

  it('opens repo portal when repo is clicked', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepos,
      headers: {
        get: () => '<https://api.github.com/orgs/godaddy/repos?page=1&per_page=10>; rel="last"'
      }
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('repo-1')).toBeInTheDocument()
    })

    const repoCard = screen.getByText('repo-1')
    fireEvent.click(repoCard)

    expect(screen.getByTestId('repo-portal')).toBeInTheDocument()
    expect(screen.getByText('Close Portal')).toBeInTheDocument()
  })

  it('closes repo portal when close button is clicked', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepos,
      headers: {
        get: () => '<https://api.github.com/orgs/godaddy/repos?page=1&per_page=10>; rel="last"'
      }
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('repo-1')).toBeInTheDocument()
    })

    const repoCard = screen.getByText('repo-1')
    fireEvent.click(repoCard)

    expect(screen.getByTestId('repo-portal')).toBeInTheDocument()

    const closeButton = screen.getByText('Close Portal')
    fireEvent.click(closeButton)

    expect(screen.queryByTestId('repo-portal')).not.toBeInTheDocument()
  })

  it('closes error portal when close button is clicked', async () => {
    const errorResponse = {
      ok: false,
      status: 403,
      json: async () => ({
        message: 'API rate limit exceeded',
        documentation_url: 'https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting'
      })
    }

    fetch.mockResolvedValueOnce(errorResponse)

    render(<App />)

    await waitFor(() => {
      expect(screen.getByTestId('error-portal')).toBeInTheDocument()
    })

    const closeButton = screen.getByText('Close Error')
    fireEvent.click(closeButton)

    expect(screen.queryByTestId('error-portal')).not.toBeInTheDocument()
  })

  it('shows pagination when repositories are loaded', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockRepos,
      headers: {
        get: () => '<https://api.github.com/orgs/godaddy/repos?page=1&per_page=10>; rel="last"'
      }
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('repo-1')).toBeInTheDocument()
    })

    // Check for pagination buttons
    expect(screen.getByText('‹')).toBeInTheDocument()
    expect(screen.getByText('›')).toBeInTheDocument()
  })

  it('handles network errors', async () => {
    fetch.mockRejectedValueOnce(new Error('Network error'))

    render(<App />)

    await waitFor(() => {
      expect(screen.getByTestId('error-portal')).toBeInTheDocument()
    })
  })

  it('shows no repositories message when empty response', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
      headers: {
        get: () => null
      }
    })

    render(<App />)

    await waitFor(() => {
      expect(screen.getByText('No repositories found.')).toBeInTheDocument()
    })
  })
}) 