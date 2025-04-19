import React, { useEffect, useState, useContext } from 'react';
import './meetingModal.css';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { getTeamData } from '../../api/teamApi';

const MeetingModal = ({ toggleModal }) => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [teams, setTeams] = useState([]);

  const { userId } = useContext(AuthContext);
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await getTeamData(userId)
      
        setTeams(Array.isArray(response) ? response : []); 
      } catch (error) {
        console.error('Error fetching teams:', error);
        setTeams([]);
      }
    };
  
    fetchTeams();
  }, []);

  const handleCreateMeeting = async () => {
    try {
      await axios.post('http://localhost:3002/meeting/create', {
        title,
        date,
        time,
        team: selectedTeam,
        createdBy: userId,
      });

    console.log(title,date,time,selectedTeam)
      toggleModal();
    } catch (error) {
      console.error('Error creating meeting:', error);
    }
  };

  return (
    <div className="modal fade show custom-modal" style={{ display: 'block' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Schedule a Meeting</h5>
            <button type="button" className="close custom-close-btn" onClick={toggleModal}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form>
              <div className="form-group">
                <label>Meeting Title</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter meeting title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Time</label>
                <input
                  type="time"
                  className="form-control"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Select Team</label>
                <select
                  className="form-control"
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                >
                  <option value="" disabled>Choose Team</option>
                  {teams.map((team) => (
                    <option key={team._id} value={team._id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger custom-btn" onClick={toggleModal}>
              Cancel
            </button>
            <button type="button" className="btn btn-success custom-btn" onClick={handleCreateMeeting}>
              Schedule Meeting
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingModal;
