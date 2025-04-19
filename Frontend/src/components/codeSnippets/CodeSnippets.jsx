import React, { useState, useEffect, useContext } from 'react';
import { Card, Button, Row, Col, Badge } from 'react-bootstrap';
import { FaCode, FaPlus, FaLock, FaUsers } from 'react-icons/fa';
import CodeSnippetModal from './codeSnippetModal';
import { AuthContext } from '../../context/AuthContext';
import { getCodeData } from '../../api/codeApi';
import './CodeSnippets.css';

const CodeSnippets = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [snippets, setSnippets] = useState([]);
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const data = await getCodeData(userId);
        setSnippets(data || []);
      } catch (error) {
        console.error('Error fetching code snippets:', error);
      }
    };

    fetchSnippets();
  }, [userId]);

  const getLanguageBadgeColor = (language) => {
    const colors = {
      javascript: 'primary',
      python: 'success',
      java: 'warning',
      cpp: 'info',
      csharp: 'secondary',
      php: 'danger',
      ruby: 'danger',
      swift: 'warning',
      kotlin: 'info',
      go: 'success'
    };
    return colors[language] || 'secondary';
  };

  return (
    <div className="code-snippets-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Code Snippets</h2>
        <Button 
          variant="primary" 
          onClick={() => setShowCreateModal(true)}
          className="d-flex align-items-center"
        >
          <FaPlus className="me-2" />
          Create Snippet
        </Button>
      </div>

      <Row>
        {snippets.length === 0 ? (
          <Col>
            <Card className="text-center p-5">
              <FaCode className="display-4 text-muted mb-3" />
              <h4>No Code Snippets Yet</h4>
              <p className="text-muted">Create your first code snippet to get started!</p>
            </Card>
          </Col>
        ) : (
          snippets.map((snippet) => (
            <Col key={snippet._id} md={6} lg={4} className="mb-4">
              <Card className="h-100">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <Card.Title className="mb-0">{snippet.title}</Card.Title>
                    <Badge bg={getLanguageBadgeColor(snippet.language)}>
                      {snippet.language}
                    </Badge>
                  </div>
                  <Card.Text className="text-muted mb-3">
                    {snippet.description}
                  </Card.Text>
                  <div className="code-preview">
                    <pre className="mb-0">
                      <code>{snippet.code.substring(0, 100)}...</code>
                    </pre>
                  </div>
                </Card.Body>
                <Card.Footer className="bg-white border-top-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      {snippet.isPublic ? (
                        <FaUsers className="me-1" />
                      ) : (
                        <FaLock className="me-1" />
                      )}
                      {snippet.isPublic ? 'Public' : 'Private'}
                    </small>
                    <small className="text-muted">
                      {new Date(snippet.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))
        )}
      </Row>

      {showCreateModal && (
        <CodeSnippetModal toggleModal={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default CodeSnippets; 