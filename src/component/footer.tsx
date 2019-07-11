import React, { useState, useContext, ChangeEvent, useEffect } from 'react';
import { CalculatorContext } from '../context/calculator-context';
import { SettingsContext, WeightUnit } from '../context/settings-context';
import forkIcon from '../media/github-repo-forked.svg';
import starIcon from '../media/github-star.svg';

const Footer: React.FC = () => {
  const [repoInfo, setRepoInfo] = useState([0, 0]);

  // Fetches repo information
  useEffect(() => {
    const fetchRepoInfo = async (): Promise<number[]> => {
      const url = 'https://api.github.com/repos/jbberinger/visual-barbell-calculator';
      const headers = new Headers({
        'Authorization': `${process.env.REACT_APP_GITHUB_AUTHORIZATION_TOKEN}`,
      });
      const result = await fetch(url, { headers: headers });
      const json = await result.json();
      console.log(json);
      return [json.stargazers_count, json.forks_count];
    };

    fetchRepoInfo().then(res => setRepoInfo(res));
  }, []);

  return (
    <footer className='footer-container'>
      <a href="https://github.com/jbberinger/visual-barbell-calculator" target="_blank" rel="noopener noreferrer"><h5>Designed & Built by Justin Beringer</h5>
        <div className='footer-repo-container'>
          <div className='footer-icon-container'>
            <img src={forkIcon} className="footer-icon" alt="instagram icon" />
            <div className='footer-repo-info'>{` ${repoInfo[0]}`}</div>
          </div>
          <div className='footer-icon-container'>
            <img src={starIcon} className="footer-icon" alt="instagram icon" />
            <div className='footer-repo-info'>{` ${repoInfo[1]}`}</div>
          </div>
        </div>
      </a>
    </footer>
  )

}

//a8084076dcaa9195477b533db7c0a27a49b38977

export default Footer;