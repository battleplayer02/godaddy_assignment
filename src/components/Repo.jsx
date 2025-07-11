const Repo = ({ repoData, onRepoClick }) => {
    return (
        <div 
            className="repo-card" 
            onClick={() => onRepoClick(repoData)}
            style={{ cursor: 'pointer' }}
        >
            <h3>{repoData.name}</h3>
            <p>{repoData.description || 'No description available'}</p>
            <div className="repo-stats">
                <span>⭐ {repoData.stargazers_count}</span>
                <span>🍴 {repoData.forks_count}</span>
                <span>👀 {repoData.watchers_count}</span>
            </div>
        </div>
    )
}

export default Repo