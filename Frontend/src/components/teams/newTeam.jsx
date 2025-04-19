import React, { useState, useContext, useEffect } from 'react';
import './newTeam.css';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const TeamModalComponent = ({ toggleModal }) => {
  const [teamName, setTeamName] = useState('');
  const [teamMember, setTeamMember] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedDescription, setSelectedDescription] = useState('');
  const [error, setError] = useState('');
  const [permissions, setPermissions] = useState({
    editCode: false,
    viewCode: false,
    comment: false,
  });

  const { email, fullname, userId } = useContext(AuthContext);
  const _id = userId;

  const [filteredMembers, setFilteredMembers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([{ email, fullname, _id }]);

  // Maximum word limit for description
  const maxWords = 5;

  useEffect(() => {
    const fetchMembers = async () => {
      if (teamMember.trim()) {
        try {
          const response = await axios.get(`http://localhost:3002/users/${teamMember}`);
          const filtered = response.data.filter(
            (member) => !selectedMembers.some((selected) => selected.email === member.email)
          );
          setFilteredMembers(filtered);
        } catch (error) {
          console.error('Error occurred while fetching data:', error);
        }
      } else {
        setFilteredMembers([]);
      }
    };

    fetchMembers();
  }, [teamMember, selectedMembers]);

  const handleMemberSelect = (email, fullname, _id) => {
    setSelectedMembers((prevMembers) => [...prevMembers, { email, fullname, _id }]);
    setTeamMember('');
    setFilteredMembers([]);
  };

  const handleRemoveMember = (email) => {
    setSelectedMembers((prevMembers) => prevMembers.filter((member) => member.email !== email));
  };

  const handlePermissionChange = (e) => {
    const { name, checked } = e.target;
    setPermissions((prevPermissions) => ({
      ...prevPermissions,
      [name]: checked,
    }));
  };

  const handleCreateTeam = () => {
    // Validation for description word limit
    const wordCount = selectedDescription.trim().split(/\s+/).length;
    if (wordCount > maxWords) {
      setError(`Description should be less than ${maxWords} words.`);
      return;
    }

    // Clear error if valid
    setError('');

    // Create team logic
    axios
      .post('http://localhost:3002/team/register', {
        name: teamName,
        role: selectedRole,
        members: selectedMembers,
        description: selectedDescription,
        permissions: permissions,
      })
      .then(() => {
        toggleModal(); // Close modal after creating
      })
      .catch((error) => {
        console.error('Error creating team:', error);
      });
  };

  return (
    <div
      className="modal fade show custom-modal"
      id="exampleModalCenter"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalCenterTitle"
      aria-hidden={toggleModal ? 'false' : 'true'}
      style={{ display: 'block' }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLongTitle">
              Create New Team
            </h5>
            <button
              type="button"
              className="close custom-close-btn"
              onClick={toggleModal}
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form>
              <div className="form-group">
                <label htmlFor="teamName">Team Name</label>
                <input
                required
                  type="text"
                  className="form-control"
                  id="teamName"
                  placeholder="Enter team name"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="teamMembers">Team Member</label>
                <div className="team-members-input">
                  <div className="tags-container">
                    {selectedMembers.map((member) => (
                      <div key={member.email} className="tag">
                        <span className="tag-text">{member.fullname}</span>
                        <button
                          type="button"
                          className="remove-member-btn"
                          onClick={() => handleRemoveMember(member.email)}
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    type="text"
                    className="form-control"
                    id="teamMembers"
                    placeholder="Enter username to find Member"
                    value={teamMember}
                    onChange={(e) => setTeamMember(e.target.value)}
                  />
                </div>

                {/* Displaying filtered members in a dropdown style */}
                {filteredMembers.length > 0 && (
                  <ul className="member-suggestions">
                    {filteredMembers.map((member) => (
                      <li
                        key={member.email}
                        onClick={() => handleMemberSelect(member.email, member.fullname, member._id)}
                      >
                        {member.fullname} ({member.username})
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="role">Select Role</label>
                <select
                required
                  className="form-control"
                  id="role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                >
                  <option value="">Choose Role</option>
                  <option value="developer">Developer</option>
                  <option value="tester">Tester</option>
                  <option value="manager">Manager</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="description">Team Description</label>
                <input
                required
                  type="text"
                  className="form-control"
                  id="description"
                  placeholder="Enter team description"
                  value={selectedDescription}
                  onChange={(e) => setSelectedDescription(e.target.value)}
                />
                {error && <small className="text-danger">{error}</small>}
              </div>

              <div className="form-group">
                <label>Permissions</label>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="editCode"
                    name="editCode"
                    checked={permissions.editCode}
                    onChange={handlePermissionChange}
                  />
                  <label className="form-check-label" htmlFor="editCode">
                    Can Edit Code
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="viewCode"
                    name="viewCode"
                    checked={permissions.viewCode}
                    onChange={handlePermissionChange}
                  />
                  <label className="form-check-label" htmlFor="viewCode">
                    Can View Code
                  </label>
                </div>
                <div className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="comment"
                    name="comment"
                    checked={permissions.comment}
                    onChange={handlePermissionChange}
                  />
                  <label className="form-check-label" htmlFor="comment">
                    Can Comment
                  </label>
                </div>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger custom-btn" onClick={toggleModal}>
              Cancel
            </button>
            <button type="button" className="btn btn-success custom-btn" onClick={handleCreateTeam}>
              Create Team
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamModalComponent;
