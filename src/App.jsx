import { useEffect, useState } from 'react'
import './style/App.css'
import Repo from './components/Repo'
import RepoPortal from './components/RepoPortal'
import ErrorPortal from './components/ErrorPortal'
import Header from './components/Header'

function App() {
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedRepo, setSelectedRepo] = useState(null)
  const [isPortalOpen, setIsPortalOpen] = useState(false)
  const [totalRepos, setTotalRepos] = useState(0)
  const [error, setError] = useState(null)
  const [isErrorPortalOpen, setIsErrorPortalOpen] = useState(false)
  const perPage = 10 // GitHub supports up to 100

  useEffect(() => {
    const fetchRepos = async () => {
      setLoading(true)
      setError(null) // Clear previous errors
      
      try {
        const response = await fetch(`https://api.github.com/orgs/godaddy/repos?page=${currentPage}&per_page=${perPage}`)
        
        // Check if response is not successful (not in 2xx range)
        if (!response.ok) {
          const errorData = await response.json()
          throw {
            status: response.status,
            message: errorData.message || `HTTP ${response.status}: ${response.statusText}`,
            documentation_url: errorData.documentation_url
          }
        }
        
        // Get total count from headers
        const totalCount = response.headers.get('Link')
        if (totalCount) {
          const match = totalCount.match(/page=(\d+)&per_page=\d+>; rel="last"/)
          if (match) {
            setTotalRepos(parseInt(match[1]) * perPage)
          }
        }
        
        const json = await response.json()
        setData(json)
        console.log(json)
      } catch (err) {
        console.error("Failed to fetch repos:", err)
        
        // Set error state
        const errorInfo = {
          status: err.status || 'Unknown',
          message: err.message || 'An unexpected error occurred while fetching data from GitHub API.',
          documentation_url: err.documentation_url
        }
        
        setError(errorInfo)
        setIsErrorPortalOpen(true)
        setData([]) // Clear data on error
      } finally {
        setLoading(false)
      }
    }

    fetchRepos()
  }, [currentPage]) // refetch on page change

  // Calculate total pages
  const totalPages = Math.ceil(totalRepos / perPage) || 1

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 7 // Show max 7 page numbers
    
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

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(prev => prev - 1)
  }

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(prev => prev + 1)
  }

  const handlePageClick = (page) => {
    if (typeof page === 'number') {
      setCurrentPage(page)
    }
  }

  const handleRepoClick = (repo) => {
    setSelectedRepo(repo)
    setIsPortalOpen(true)
  }

  const handleClosePortal = () => {
    setIsPortalOpen(false)
    setSelectedRepo(null)
  }

  const handleCloseErrorPortal = () => {
    setIsErrorPortalOpen(false)
    setError(null)
  }

  return (
    <>
      <Header />

      {loading ? (
        <p style={{ textAlign: 'center', marginTop: '20px' }}>Loading...</p>
      ) : (
        <div className='grid-container'>
          {data.map(repo => (
            <Repo 
              key={repo.id} 
              repoData={repo} 
              onRepoClick={handleRepoClick}
            />
          ))}
        </div>
      )}

      {!loading && data.length === 0 && !error && (
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#586069' }}>
          No repositories found.
        </p>
      )}

      {!loading && data.length > 0 && (
        <div className="pagination">
          <button 
            className="page-btn" 
            onClick={handlePrev} 
            disabled={currentPage === 1}
          >
            ‹
          </button>
          
          {getPageNumbers().map((pageNum, index) => (
            <button
              key={index}
              className={`page-btn ${currentPage === pageNum ? 'active' : ''} ${pageNum === '...' ? 'ellipsis' : ''}`}
              onClick={() => handlePageClick(pageNum)}
              disabled={pageNum === '...'}
            >
              {pageNum}
            </button>
          ))}
          
          <button 
            className="page-btn" 
            onClick={handleNext}
            disabled={currentPage === totalPages}
          >
            ›
          </button>
        </div>
      )}

      <RepoPortal 
        repo={selectedRepo}
        isOpen={isPortalOpen}
        onClose={handleClosePortal}
      />

      <ErrorPortal 
        error={error}
        isOpen={isErrorPortalOpen}
        onClose={handleCloseErrorPortal}
      />
    </>
  )
}

export default App
