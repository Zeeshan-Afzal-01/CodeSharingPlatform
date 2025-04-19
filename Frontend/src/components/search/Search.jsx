import React, { useEffect, useState } from 'react';
import { FaSearch, FaUser, FaCode, FaUsers ,FaUserPlus} from 'react-icons/fa';

import './Search.css';
import { getAllUserData } from '../../api/userApi';
import { getAllTeamsData } from '../../api/teamApi';

const API_URL = "http://localhost:3002";

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState({ message: '', getData: [], success: false });
  const [teamData, setTeamData] = useState([]);
  const [searchResults, setSearchResults] = useState({
    users: [],
    snippets: [],
    teams: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  
  // Mock data for snippets
  const snippets = [
    { _id: 1, title: 'React Hooks Example', language: 'JavaScript', author: 'John Doe' },
    { _id: 2, title: 'CSS Grid Layout', language: 'CSS', author: 'Jane Smith' }
  ];

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
  
    setIsLoading(true);
    try {
      const [userResponse, teamResponse] = await Promise.all([
        getAllUserData(),
        getAllTeamsData()
      ]);
      
      setData(userResponse);
      setTeamData(teamResponse.data || []);
  
      // Now that we have the data, filter the results
      const filteredResults = {
        users: (userResponse.getData || []).filter(user =>
          user.fullname.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          user.username.toLowerCase().startsWith(searchQuery.toLowerCase())
        ),
        snippets: snippets.filter(snippet =>
          snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          snippet.language.toLowerCase().includes(searchQuery.toLowerCase())
        ),
        teams: (teamResponse.data || []).filter(team =>
          team.name.toLowerCase().startsWith(searchQuery.toLowerCase())
        )
      };
  
      setSearchResults(filteredResults);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTeamRequest = async (teamId) => {
    try {
      // Here you would typically make an API call to request joining the team
      // For now, we'll just show an alert
      alert(`Request to join team ${teamId} has been sent!`);
    } catch (error) {
      console.error('Failed to send team request:', error);
      alert('Failed to send team request. Please try again.');
    }
  };

  const renderResults = () => {
    if (isLoading) {
      return <div className="loading-spinner">Searching...</div>;
    }

    if (!searchQuery) {
      return (
        <div className="search-header">
          <h1>Search Anything</h1>
          <p>Find users, code snippets, or teams</p>
        </div>
      );
    }

    const hasResults = Object.values(searchResults).some(results => results.length > 0);
    if (!hasResults) {
      return <div className="no-results">No results found for "{searchQuery}"</div>;
    }

    return (
      <div className="search-results">
       {(activeTab === 'all' || activeTab === 'users') && searchResults.users.length > 0 && (
  <div className="result-section">
    <h2><FaUser /> Users</h2>
    <div className="result-cards">
      {searchResults.users.map(user => (
        <div key={user._id} className="result-card">
          <div className="user-avatar">
            <img src={`${API_URL}/${user.profilePic}`} alt="" />
          </div>
          <div className="card-content">
            <h3>{user.fullname}</h3>
            <p>@{user.username} • {user.location}</p>
          </div>
          {/* Add Friend Button */}
          <button className="add-friend-btn">
            <FaUserPlus />
          </button>
        </div>
      ))}
    </div>
  </div>
)}

        {(activeTab === 'all' || activeTab === 'snippets') && searchResults.snippets.length > 0 && (
          <div className="result-section">
            <h2><FaCode /> Code Snippets</h2>
            <div className="result-cards">
              {searchResults.snippets.map(snippet => (
                <div key={snippet._id} className="result-card">
                  <div className="card-content">
                    <h3>{snippet.title}</h3>
                    <p>{snippet.language} • By {snippet.author}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {(activeTab === 'all' || activeTab === 'teams') && searchResults.teams.length > 0 && (
          <div className="result-section">
            <h2><FaUsers /> Teams</h2>
            <div className="result-cards">
              {searchResults.teams.map(team => (
                <div key={team._id} className="result-card">
                  <div className="card-content">
                    <h3>{team.name}</h3>
                    <p>{team.members?.length || 0} members • {team.role || 'No role specified'}</p>
                  </div>
                  <div className="team-actions">
                    <button 
                      className="open-team-btn"
                      onClick={() => window.location.href = `/teams/${team._id}`}
                    >
                      Open Team
                    </button>
                    <button 
                      className="request-team-btn"
                      onClick={() => handleTeamRequest(team._id)}
                    >
                      Request to Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search users, snippets, or teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button
            type="submit"
            className="search-button"
            disabled={!searchQuery.trim() || isLoading}
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      <div className="search-tabs">
        <button
          className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <FaSearch /> All
        </button>
        <button
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          <FaUser /> Users
        </button>
        <button
          className={`tab-button ${activeTab === 'snippets' ? 'active' : ''}`}
          onClick={() => setActiveTab('snippets')}
        >
          <FaCode /> Snippets
        </button>
        <button
          className={`tab-button ${activeTab === 'teams' ? 'active' : ''}`}
          onClick={() => setActiveTab('teams')}
        >
          <FaUsers /> Teams
        </button>
      </div>

      {renderResults()}
    </div>
  );
};

export default Search; 