import React, { useState, useEffect, useContext } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Button, Card, Row, Col } from 'react-bootstrap';
import { FaCalendarPlus, FaUsers, FaClock } from 'react-icons/fa';
import MeetingModal from './meetingModal';
import './Meetings.css';
import { AuthContext } from '../../context/AuthContext';
import { getMeetingData, getTeamMeetingData } from '../../api/meetingApi';
import { getTeamData } from '../../api/teamApi';

const localizer = momentLocalizer(moment);

const Meetings = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Fetch teams first
        const teamData = await getTeamData(userId);
        
        // Fetch user's meetings
        const userMeetings = await getMeetingData(userId);
        
        // Fetch team meetings for each team
        const teamMeetingsPromises = teamData.map(team => getTeamMeetingData(team._id));
        const teamMeetingsResults = await Promise.all(teamMeetingsPromises);
        
        // Flatten and process team meetings
        const allTeamMeetings = teamMeetingsResults.flat().map(meeting => ({
          ...meeting,
          team: teamData.find(t => t._id === meeting.teamId) // Ensure team data is attached
        }));

        // Combine all meetings and remove duplicates
        const combinedMeetings = [...userMeetings, ...allTeamMeetings];
        const uniqueMeetings = combinedMeetings.reduce((acc, current) => {
          const x = acc.find(item => item._id === current._id);
          if (!x) {
            return acc.concat([current]);
          }
          return acc;
        }, []);

        // Convert meetings to calendar events
        const calendarEvents = uniqueMeetings.map(meeting => ({
          title: meeting.title,
          start: new Date(`${meeting.date}T${meeting.time}`),
          end: new Date(new Date(`${meeting.date}T${meeting.time}`).getTime() + 60 * 60 * 1000),
          team: meeting.team?.name || 'No Team',
          teamId: meeting.teamId || meeting.team?._id,
          description: meeting.description,
          originalMeeting: meeting
        }));

        setEvents(calendarEvents);

        // Filter teams that have meetings
        const teamsWithMeetings = teamData.filter(team => {
          return uniqueMeetings.some(meeting => 
            (meeting.teamId === team._id) || (meeting.team?._id === team._id)
          );
        });

        console.log('Teams with meetings:', teamsWithMeetings);
        console.log('All meetings:', uniqueMeetings);
        
        setTeams(teamsWithMeetings);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  // Add fetchData to component scope so it can be called from handleModalClose
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const teamData = await getTeamData(userId);
      const userMeetings = await getMeetingData(userId);
      const teamMeetingsPromises = teamData.map(team => getTeamMeetingData(team._id));
      const teamMeetingsResults = await Promise.all(teamMeetingsPromises);
      
      const allTeamMeetings = teamMeetingsResults.flat().map(meeting => ({
        ...meeting,
        team: teamData.find(t => t._id === meeting.teamId)
      }));

      const combinedMeetings = [...userMeetings, ...allTeamMeetings];
      const uniqueMeetings = combinedMeetings.reduce((acc, current) => {
        const x = acc.find(item => item._id === current._id);
        if (!x) {
          return acc.concat([current]);
        }
        return acc;
      }, []);

      const calendarEvents = uniqueMeetings.map(meeting => ({
        title: meeting.title,
        start: new Date(`${meeting.date}T${meeting.time}`),
        end: new Date(new Date(`${meeting.date}T${meeting.time}`).getTime() + 60 * 60 * 1000),
        team: meeting.team?.name || 'No Team',
        teamId: meeting.teamId || meeting.team?._id,
        description: meeting.description,
        originalMeeting: meeting
      }));

      setEvents(calendarEvents);

      const teamsWithMeetings = teamData.filter(team => {
        return uniqueMeetings.some(meeting => 
          (meeting.teamId === team._id) || (meeting.team?._id === team._id)
        );
      });

      setTeams(teamsWithMeetings);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowCreateModal(false);
    // Refresh meetings data after creating a new meeting
    if (userId) {
      fetchData();
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="meetings-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Meetings & Teams</h2>
        <Button 
          variant="primary" 
          onClick={() => setShowCreateModal(true)}
          className="d-flex align-items-center"
        >
          <FaCalendarPlus className="me-2" />
          Create Meeting
        </Button>
      </div>

      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500 }}
                views={['month', 'week', 'day']}
                defaultView="month"
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">Team Overview</h5>
            </Card.Header>
            <Card.Body>
              {teams.length === 0 ? (
                <div className="text-center text-muted">
                  <p>No teams with scheduled meetings</p>
                </div>
              ) : (
                teams.map(team => {
                  // Get all meetings for this team
                  const teamMeetings = events.filter(event => 
                    event.teamId === team._id || 
                    event.originalMeeting?.team?._id === team._id ||
                    event.originalMeeting?.teamId === team._id
                  );

                  // Sort meetings by date/time
                  const sortedMeetings = [...teamMeetings].sort((a, b) => a.start - b.start);
                  
                  // Filter for upcoming meetings
                  const upcomingMeetings = sortedMeetings.filter(meeting => 
                    meeting.start > new Date()
                  );
                  
                  console.log(`Team ${team.name} meetings:`, upcomingMeetings);
                  
                  return (
                    <Card key={team._id} className="mb-3 team-card">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start">
                          <div>
                            <h6 className="mb-1">{team.name}</h6>
                            <small className="text-muted d-block">
                              <FaUsers className="me-1" />
                              {team.members.length} members
                            </small>
                            <small className="text-muted d-block mb-2">
                              <FaClock className="me-1" />
                              {upcomingMeetings.length} upcoming meetings
                            </small>
                          </div>
                        </div>
                        
                        {upcomingMeetings.length > 0 && (
                          <div className="mt-2">
                            <small className="text-primary fw-bold">Next meetings:</small>
                            <div className="upcoming-meetings-list">
                              {upcomingMeetings.slice(0, 3).map((meeting, idx) => (
                                <div key={idx} className="upcoming-meeting-item">
                                  <small className="text-muted">
                                    <strong>{meeting.title}</strong>
                                    <br />
                                    {moment(meeting.start).format('DD/MM/YYYY - hh:mm A')}
                                  </small>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  );
                })
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {showCreateModal && (
        <MeetingModal toggleModal={handleModalClose} />
      )}
    </div>
  );
};

export default Meetings; 