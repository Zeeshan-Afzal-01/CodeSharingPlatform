import { React, useState, useContext, useEffect } from "react";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaBell, FaPlus, FaEdit, FaEnvelope, FaUserFriends, FaUsers, FaCalendarAlt, FaCode, FaComments } from "react-icons/fa";
import { AuthContext } from "../../context/AuthContext";
import { getTeamData } from "../../api/teamApi";
import { getCodeData } from '../../api/codeApi'
import { getMeetingData } from "../../api/meetingApi";
import { getTeamMeetingData } from "../../api/meetingApi";
import TeamModalComponent from '../teams/newTeam'
import MeetingModal from "../meetings/meetingModal";
import "./dashboard.css";
import moment from "moment"

const Dashboard = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const { loading, userId, fullname } = useContext(AuthContext);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [codeData, setCodeData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [meetingData, setMeetingData] = useState([]);
  const [messageData, setMessageData] = useState([]);
  const [showMeetingModal, setMeeingModal] = useState(false);
  const [showTeamModal, setshowTeamModal] = useState(false);

  const toggleTeamModal = () => {
    setshowTeamModal(!showTeamModal);
  };

  const toggleMeetingModal = () => {
    setMeeingModal(!showMeetingModal);
  };

  const handleCreateSnippet = () => {
    navigate('/code-editor');
  };

  const filterFutureMeetings = (meetings) => {
    const now = new Date();

    return meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.date);  // Convert the date string to a Date object
      const [meetingHours, meetingMinutes] = meeting.time.split(":").map(Number);

      // Check if the meeting is scheduled for a future date or time
      if (meetingDate > now) {
        return true;
      }

      // If the meeting is today, compare the time
      if (meetingDate.toDateString() === now.toDateString()) {
        return (
          meetingHours > now.getHours() ||
          (meetingHours === now.getHours() && meetingMinutes > now.getMinutes())
        );
      }

      return false;
    });
  };

  const sortedCodeData = [...codeData]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 3);

  const sortedMeetingData = filterFutureMeetings(meetingData)
    .sort((a, b) => {
      const [aHours, aMinutes] = a.time.split(":").map(Number);
      const [bHours, bMinutes] = b.time.split(":").map(Number);

      // Convert to minutes since midnight and compare
      return (aHours * 60 + aMinutes) - (bHours * 60 + bMinutes);
    })
    .slice(0, 3); // Show top 3 upcoming meetings

  const sortedMessageData = [...messageData]
    .sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt))
    .slice(0, 3);

  useEffect(() => {
    if (!userId || loading) return;

    setIsDataLoading(true);

    Promise.all([
      getMeetingData(userId),
      getCodeData(userId),
      getTeamData(userId)
    ])
      .then(([meetings, codes, teams]) => {
        // Set the fetched data into respective states
        setMeetingData(meetings);
        setCodeData(codes);
        setTeamData(teams);
      })
      .finally(() => {
        setIsDataLoading(false);
      });

    const interval = setInterval(() => {
      setMeetingData((prevMeetings) => filterFutureMeetings(prevMeetings));
    }, 30000);

    return () => clearInterval(interval);
  }, [userId, loading]);

  useEffect(() => {
    if (!teamData.length) return;
  
    const fetchMeetingTeamData = async () => {
      try {
        const teamMeetingDataList = await Promise.all(
          teamData.map((team) => getTeamMeetingData(team._id))
        );

        console.log(teamMeetingDataList)
  
        // Flatten all team meetings into a single array
        const allTeamMeetings = teamMeetingDataList.flat();
        
        // Update meetingData to include both user meetings and team meetings
        setMeetingData(prevMeetings => {
          // Combine meetings and remove duplicates based on meeting ID
          const combinedMeetings = [...prevMeetings, ...allTeamMeetings];
          const uniqueMeetings = combinedMeetings.reduce((acc, current) => {
            const x = acc.find(item => item._id === current._id);
            if (!x) {
              return acc.concat([current]);
            } else {
              return acc;
            }
          }, []);
          
          return uniqueMeetings;
        });
      } catch (error) {
        console.error("Error fetching team meeting data:", error);
      }
    };
  
    fetchMeetingTeamData();
  }, [teamData]);

  return (
    <div className="container-fluid">
      <div className="row d-flex align-items-center justify-content-center">
        <main className=" m-2 col-md-12 ms-sm-auto  ">
          {isDataLoading ? (
            <div className="d-flex justify-content-center align-items-center vh-100">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <div id="layout" className="bg-gray-50 py-6 layout-dashboard md:px-8">
                {/* Dashboard Header */}
                <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between mb-4">
                  <div>
                    <h1 className="fs-4 fw-bold text-dark">Dashboard</h1>
                    <p className="text-muted mt-1">Welcome back, {fullname}! Here's what's happening today.</p>
                  </div>

                  <div className="mt-3 mt-md-0 d-flex align-items-center gap-3">
                    {/* Notifications */}
                    <button className="btn btn-light position-relative border shadow-sm">
                      <FaBell className="text-muted fs-5" />
                      <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-white rounded-circle"></span>
                    </button>

                    {/* Create New Dropdown */}
                    <Dropdown show={isOpen} onToggle={(isOpen) => setIsOpen(isOpen)}>
                      <Dropdown.Toggle className="btn btn-primary d-flex align-items-center">
                        <FaPlus className="me-2" /> Create New
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="shadow-sm">
                        <Dropdown.Item onClick={handleCreateSnippet}><FaCode className="me-2 text-muted" />New Snippet</Dropdown.Item>
                        <Dropdown.Item onClick={toggleTeamModal}><FaUsers className="me-2 text-muted" /> New Team</Dropdown.Item>
                        <Dropdown.Item onClick={toggleMeetingModal}><FaCalendarAlt className="me-2 text-muted" /> New Meeting</Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>

                {/* Modals */}
                {showTeamModal && <TeamModalComponent toggleModal={toggleTeamModal} />}
                {showMeetingModal && <MeetingModal toggleModal={toggleMeetingModal} />}

                {/* Stats Overview */}
                <div className="row g-4 mb-4">
                  {[
                    { title: "Total Snippets", value: codeData.length, icon: <FaCode />, color: "indigo" },
                    { title: "Active Teams", value: teamData.length, icon: <FaUsers />, color: "blue" },
                    { title: "Unread Messages", value: 24, icon: <FaComments />, color: "yellow" },
                    { title: "Upcoming Meetings", value: sortedMeetingData.length, icon: <FaCalendarAlt />, color: "green" },
                  ].map((stat, index) => (
                    <div key={index} className="col-md-6 col-lg-3">
                      <div className="bg-white p-4 rounded shadow-sm border">
                        <div className="d-flex justify-content-between">
                          <div>
                            <p className="text-muted small">{stat.title}</p>
                            <h3 className="fw-bold">{stat.value}</h3>
                          </div>
                          <div className={`bg-${stat.color}-100 p-3 rounded text-${stat.color}-600 fs-4`}>
                            {stat.icon}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white p-4 rounded shadow-sm border mb-4">
                <div className="d-flex justify-content-between mb-3">
                  <h5 className="fw-bold">Recent Activity</h5>
                  <a href="#" className="text-primary small">View All</a>
                </div>
                <div className="border-start border-indigo-200 ps-3">
                  {[
                    { user: "You", action: "created a new snippet", detail: "API Authentication", time: "30 minutes ago" },
                    { user: "Sarah Chen", action: "commented on your snippet", detail: `"Great job!"`, time: "2 hours ago" },
                    { user: "You", action: "were added to team", detail: "Frontend Masters", time: "Yesterday" },
                    { user: "Meeting", action: "scheduled:", detail: "Code Review Session", time: "Tomorrow at 10:00 AM" },
                  ].map((activity, index) => (
                    <div key={index} className="position-relative mb-3">
                      <div className="position-absolute start-0 translate-middle-x p-2 bg-primary rounded-circle border border-white"></div>
                      <p className="small mb-0">
                        <strong>{activity.user}</strong> {activity.action} <span className="text-primary">{activity.detail}</span>
                      </p>
                      <p className="text-muted small">{activity.time}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Access Sections */}
              <div className="row g-4">
                {/* Recent Snippets */}
                <div className="col-md-4">
                  <div className="bg-white p-4 rounded shadow-sm border d-flex flex-column" style={{ minHeight: "300px" }}>
                    <div className="d-flex justify-content-between mb-3">
                      <h5 className="fw-bold">Recent Snippets</h5>
                      <a href="#code-snippets" className="text-primary small">View All</a>
                    </div>
                    <div className="list-group flex-grow-1 d-flex flex-column">
                      {sortedCodeData.length === 0 ? (
                        <div className="d-flex justify-content-center align-items-center flex-grow-1">
                          <p className="text-center text-muted fw-bold">No Snippets Available</p>
                        </div>
                      ) : (
                        sortedCodeData.map((item, idx) => (
                          <a key={idx} href="#" className="list-group-item list-group-item-action border-0">
                            <div className="d-flex align-items-center">
                              <div className="bg-light p-2 rounded me-3 text-primary">
                                <FaCode />
                              </div>
                              <div>
                                <p className="mb-0 fw-medium">{item.title}</p>
                                <small className="text-muted">{moment(item.createdAt).format('YYYY-MM-DD HH:mm')}</small>
                              </div>
                            </div>
                          </a>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Upcoming Meetings */}
                <div className="col-md-4">
                  <div className="bg-white p-4 rounded shadow-sm border d-flex flex-column" style={{ minHeight: "300px" }}>
                    <div className="d-flex justify-content-between mb-3">
                      <h5 className="fw-bold">Upcoming Meetings</h5>
                      <a href="#meetings" className="text-primary small">View All</a>
                    </div>
                    <div className="list-group flex-grow-1 d-flex flex-column">
                      {sortedMeetingData.length === 0 ? (
                        <div className="d-flex justify-content-center align-items-center flex-grow-1">
                          <p className="text-center text-muted fw-bold">No Meeting Available</p>
                        </div>
                      ) : (
                        sortedMeetingData.map((item, idx) => (
                          <a key={idx} href="#" className="list-group-item list-group-item-action border-0">
                            <div className="d-flex align-items-center">
                              <div className="bg-light p-2 rounded me-3 text-primary">
                                <FaCalendarAlt />
                              </div>
                              <div>
                                <p className="mb-0 fw-medium">{item.title}</p>
                                <small className="text-muted">
                                  {moment(item.date).format('DD/MM/YYYY')} - {moment(item.time, 'HH:mm').format('hh:mm A')}
                                </small>
                              </div>
                            </div>
                          </a>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* Recent Messages (Always Centered if Empty) */}
                <div className="col-md-4">
                  <div className="bg-white p-4 rounded shadow-sm border d-flex flex-column" style={{ minHeight: "300px" }}>
                    <div className="d-flex justify-content-between mb-3">
                      <h5 className="fw-bold">Recent Messages</h5>
                      <a href="#messages" className="text-primary small">View All</a>
                    </div>
                    <div className="list-group flex-grow-1 d-flex justify-content-center align-items-center">
                      {sortedMessageData.length === 0 ? (
                        <p className="text-center text-muted fw-bold">No Messages Available</p>
                      ) : (
                        sortedMessageData.map((item, idx) => (
                          <a key={idx} href="#" className="list-group-item list-group-item-action border-0">
                            <div className="d-flex align-items-center">
                              <div className="bg-light p-2 rounded me-3 text-primary">
                                <FaEnvelope />
                              </div>
                              <div>
                                <p className="mb-0 fw-medium">{item.title}</p>
                                <small className="text-muted">{moment(item.createdAt).format('YYYY-MM-DD HH:mm')}</small>
                              </div>
                            </div>
                          </a>
                        ))
                      )}
                    </div>
                  </div>
                </div>

              </div>

            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;