import React, { useState, useContext } from 'react';
import './codeSnippetModal.css';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { getTeamData } from '../../api/teamApi';

const CodeSnippetModal = ({ toggleModal }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teams, setTeams] = useState([]);
  const [isPublic, setIsPublic] = useState(false);

  const { userId } = useContext(AuthContext);

  React.useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await getTeamData(userId);
        setTeams(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Error fetching teams:', error);
        setTeams([]);
      }
    };

    fetchTeams();
  }, [userId]);

  const handleCreateSnippet = async () => {
    try {
      await axios.post('http://localhost:3002/code/create', {
        title,
        description,
        code,
        language,
        team: selectedTeam,
        isPublic,
        createdBy: userId,
      });

      toggleModal();
    } catch (error) {
      console.error('Error creating code snippet:', error);
    }
  };

  return (
    <div className="modal fade show custom-modal" style={{ display: 'block' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Create Code Snippet</h5>
            <button type="button" className="close custom-close-btn" onClick={toggleModal}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form>
              <div className="form-group">
                <label>Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter snippet title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  className="form-control"
                  placeholder="Enter snippet description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>Code</label>
                <textarea
                  className="form-control code-textarea"
                  placeholder="Enter your code here"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows="10"
                />
              </div>
              <div className="form-group">
                <label>Programming Language</label>
                <select
                  className="form-control"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="cpp">C++</option>
                  <option value="csharp">C#</option>
                  <option value="php">PHP</option>
                  <option value="ruby">Ruby</option>
                  <option value="swift">Swift</option>
                  <option value="kotlin">Kotlin</option>
                  <option value="go">Go</option>
                </select>
              </div>
              <div className="form-group">
                <label>Select Team (Optional)</label>
                <select
                  className="form-control"
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                >
                  <option value="">Choose Team</option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                  />
                  <label className="form-check-label" htmlFor="isPublic">
                    Make this snippet public
                  </label>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger custom-btn" onClick={toggleModal}>
              Cancel
            </button>
            <button type="button" className="btn btn-success custom-btn" onClick={handleCreateSnippet}>
              Create Snippet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeSnippetModal; 