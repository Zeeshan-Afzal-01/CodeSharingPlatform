import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Card, Badge } from 'react-bootstrap';
import { FaPlay, FaSave, FaTimes } from 'react-icons/fa';
import Editor from '@monaco-editor/react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import './CodeEditor.css';

const CodeEditor = () => {
  const navigate = useNavigate();
  const { userId } = React.useContext(AuthContext);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPublic, setIsPublic] = useState(false);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/api/team/user/${userId}`);
        if (response.data && Array.isArray(response.data)) {
          setTeams(response.data);
        } else {
          setTeams([]);
        }
      } catch (err) {
        console.error("Error fetching teams:", err);
        setError("Failed to load teams");
        setTeams([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchTeams();
    }
  }, [userId]);

  const handleEditorChange = (value) => {
    setCode(value);
  };

  const handleRunCode = async () => {
    setIsRunning(true);
    try {
      // Here you would typically send the code to a backend service that can execute it
      // For now, we'll just simulate a response
      const response = await axios.post('/api/code/run', {
        code,
        language
      });
      setOutput(response.data.output);
    } catch (error) {
      setOutput('Error running code: ' + error.message);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSave = async () => {
    try {
      await axios.post('/api/code/create', {
        title,
        description,
        code,
        language,
        teamId: selectedTeam,
        isPublic,
        userId
      });
      navigate('/code-snippets');
    } catch (error) {
      console.error('Error saving code snippet:', error);
    }
  };

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
    { value: 'csharp', label: 'C#' },
    { value: 'php', label: 'PHP' },
    { value: 'ruby', label: 'Ruby' },
    { value: 'go', label: 'Go' },
    { value: 'rust', label: 'Rust' },
    { value: 'typescript', label: 'TypeScript' }
  ];

  return (
    <div className="code-editor-container">
      <div className="editor-header">
        <h2>Create New Code Snippet</h2>
        <div className="header-actions">
          <Button variant="outline-danger" onClick={() => navigate('/code-snippets')}>
            <FaTimes className="me-2" /> Cancel
          </Button>
        </div>
      </div>

      <div className="editor-content">
        <div className="editor-form">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter snippet title"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter snippet description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Language</Form.Label>
              <Form.Select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="">Select a language</option>
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Team</Form.Label>
              <Form.Select
                value={selectedTeam}
                onChange={(e) => setSelectedTeam(e.target.value)}
              >
                <option value="">Select a team</option>
                {isLoading ? (
                  <option disabled>Loading teams...</option>
                ) : error ? (
                  <option disabled>{error}</option>
                ) : teams.length === 0 ? (
                  <option disabled>No teams available</option>
                ) : (
                  teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))
                )}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Make this snippet public"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
              />
            </Form.Group>
          </Form>
        </div>

        <div className="editor-main">
          <div className="editor-toolbar">
            <Button
              variant="success"
              onClick={handleRunCode}
              disabled={isRunning}
            >
              <FaPlay className="me-2" />
              {isRunning ? 'Running...' : 'Run Code'}
            </Button>
            <Button variant="primary" onClick={handleSave}>
              <FaSave className="me-2" />
              Save Snippet
            </Button>
          </div>

          <div className="monaco-editor-container">
            <Editor
              height="400px"
              defaultLanguage={language}
              value={code}
              onChange={handleEditorChange}
              theme="vs-dark"
              options={{
                minimap: { enabled: true },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                readOnly: false,
                automaticLayout: true,
              }}
            />
          </div>

          {output && (
            <div className="output-container">
              <h5>Output</h5>
              <pre className="output-content">{output}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CodeEditor; 