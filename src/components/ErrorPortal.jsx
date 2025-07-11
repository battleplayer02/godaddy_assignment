import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import '../style/ErrorPortal.css'

const ErrorPortal = ({ error, isOpen, onClose }) => {
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

    if (!isOpen || !error) return null

    return createPortal(
        <div className="error-portal-overlay" onClick={onClose}>
            <div className="error-portal-content" onClick={(e) => e.stopPropagation()}>
                <div className="error-portal-header">
                    <h2>⚠️ API Error</h2>
                    <button className="error-close-btn" onClick={onClose}>×</button>
                </div>
                
                <div className="error-portal-body">
                    <div className="error-icon">
                        🚨
                    </div>
                    
                    <h3 className="error-title">
                        Failed to fetch repositories
                    </h3>
                    
                    <div className="error-details">
                        <div className="error-item">
                            <strong>Status Code:</strong> {error.status || 'Unknown'}
                        </div>
                        <div className="error-item">
                            <strong>Error Message:</strong>
                        </div>
                        <div className="error-message">
                            {error.message || 'An unexpected error occurred while fetching data from GitHub API.'}
                        </div>
                        
                        {error.documentation_url && (
                            <div className="error-item">
                                <strong>Documentation:</strong>
                                <a 
                                    href={error.documentation_url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="error-link"
                                >
                                    View GitHub API Documentation
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="error-actions">
                        <button 
                            className="error-retry-btn"
                            onClick={() => {
                                onClose()
                                window.location.reload()
                            }}
                        >
                            🔄 Retry
                        </button>
                        <button 
                            className="error-close-action-btn"
                            onClick={onClose}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    )
}

export default ErrorPortal 