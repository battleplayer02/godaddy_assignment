import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'

const RepoPortal = ({ repo, isOpen, onClose }) => {
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                onClose()
            }
        }

        if (isOpen) {
            document.addEventListener('keydown', handleEscape)
            document.body.style.overflow = 'hidden'
        }

        return () => {
            document.removeEventListener('keydown', handleEscape)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, onClose])

    if (!isOpen || !repo) return null

    return createPortal(
        <div className="portal-overlay" onClick={onClose}>
            <div 
                className="portal-content" 
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-labelledby="repo-title"
                aria-describedby="repo-description"
            >
                <div className="portal-header">
                    <h2 id="repo-title">{repo.name}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>
                
                <div className="portal-body">
                    <p className="repo-description" id="repo-description">{repo.description || 'No description available'}</p>
                    
                    <div className="repo-details">
                        <div className="detail-item">
                            <strong>Language:</strong> {repo.language || 'Not specified'}
                        </div>
                        <div className="detail-item">
                            <strong>Created:</strong> {new Date(repo.created_at).toLocaleDateString()}
                        </div>
                        <div className="detail-item">
                            <strong>Last Updated:</strong> {new Date(repo.updated_at).toLocaleDateString()}
                        </div>

                        <div className="detail-item">
                            <strong>Size:</strong> {repo.size} KB
                        </div>
                    </div>

                    <div className="repo-stats-grid">
                        <div className="stat-card">
                            <span className="stat-number">⭐ {repo.stargazers_count}</span>
                            <span className="stat-label">Stars</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">🍴 {repo.forks_count}</span>
                            <span className="stat-label">Forks</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">👀 {repo.watchers_count}</span>
                            <span className="stat-label">Watchers</span>
                        </div>
                        <div className="stat-card">
                            <span className="stat-number">📁 {repo.open_issues_count}</span>
                            <span className="stat-label">Open Issues</span>
                        </div>
                    </div>

                    <div className="repo-actions">
                        <a 
                            href={repo.html_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="action-btn primary"
                        >
                            View on GitHub
                        </a>
                        {repo.homepage && (
                            <a 
                                href={repo.homepage} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="action-btn secondary"
                            >
                                Visit Homepage
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}

export default RepoPortal 