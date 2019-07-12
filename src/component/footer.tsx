import React, { useState, useEffect } from 'react';
import forkIcon from '../media/github-repo-forked.svg';
import starIcon from '../media/github-star.svg';

// Footer component which links to GitHub repo and displays repo stats.
const Footer: React.FC = () => {
  const [repoInfo, setRepoInfo] = useState([0, 0]);

  // Fetches repo information from GitHub.
  useEffect(() => {
    const fetchRepoInfo = async (): Promise<number[]> => {
      const url = 'https://api.github.com/repos/jbberinger/visual-barbell-calculator';
      const headers = new Headers({
        'Authorization': `${process.env.REACT_APP_GITHUB_AUTHORIZATION_TOKEN}`,
      });
      const result = await fetch(url, { headers: headers });
      const json = await result.json();
      return [json.stargazers_count, json.forks_count];
    };

    fetchRepoInfo().then(res => setRepoInfo(res));
  }, []);

  return (
    <footer className='footer-container'>
      <a href="https://github.com/jbberinger/visual-barbell-calculator" target="_blank" rel="noopener noreferrer"><h5>Designed & Built by Justin Beringer</h5>
        <div className='footer-repo-container'>
          <div className='footer-icon-container'>
            <img src={forkIcon} className="footer-icon-fork" alt="instagram icon" />
            <div className='footer-repo-info'>{` ${repoInfo[0]}`}</div>
          </div>
          <div className='footer-icon-container'>
            <img src={starIcon} className="footer-icon-star" alt="instagram icon" />
            <div className='footer-repo-info'>{` ${repoInfo[1]}`}</div>
          </div>
        </div>
      </a>
    </footer>
  )
}

export default Footer;