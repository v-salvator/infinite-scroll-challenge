const RepoCell = ({ repo }) => {
  return (
    <div className="repo-cell">
      <div className="repo-cell__name">{repo.full_name}</div>
      <div className="repo-cell__link">
        <span>Link: </span>
        <a href={repo.html_url}>{repo.html_url}</a>
      </div>
      <div className="repo-cell__lang">
        <span>Language: </span>
        <span>{repo.language}</span>
      </div>
    </div>
  );
};

export default RepoCell;
