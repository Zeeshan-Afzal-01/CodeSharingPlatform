import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Card, Button, Row, Col, Form } from 'react-bootstrap';
import TeamModalComponent from './newTeam';
import { getTeamData } from '../../api/teamApi';
import { getUserData } from '../../api/userApi';
import "./teamoverview.css";

const TeamOverview = () => {
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [teams, setTeams] = useState([]); // Current state for teams
    const [originalTeams, setOriginalTeams] = useState([]); // Original teams fetched (by Recent Activity)
    const [teamImages, setTeamImages] = useState({}); // New state to store images
    const { userId, loading } = useContext(AuthContext);
    const [searchTeams, setSearchTeams] = useState("");
    const [filteredTeams, setFilteredTeams] = useState([]); // New state for filtered teams
    const [debounceTimeout, setDebounceTimeout] = useState(null); // Timeout ID for debouncing

    useEffect(() => {
        if (!userId || loading) return;

        const fetchTeamData = async () => {
            const teamResponse = await getTeamData(userId);
            setIsDataLoading(!teamResponse);
            if (teamResponse) {
                setTeams(teamResponse); // Set teams in the original order (Recent Activity)
                setOriginalTeams(teamResponse); // Store the original order
                setFilteredTeams(teamResponse); // Initially, show all teams
                await fetchTeamMemberImages(teamResponse);
            } else {
                console.log("No Team Found");
            }
        };

        const fetchTeamMemberImages = async (teams) => {
            const imagePromises = teams.flatMap((team) =>
                team.members.map(async (memberId) => {
                    const imgResponse = await getUserData(memberId);
                    return { [memberId]: imgResponse?.profilePic };
                })
            );

            const images = await Promise.all(imagePromises);
            const imagesObj = images.reduce((acc, img) => ({ ...acc, ...img }), {});
            setTeamImages(imagesObj);
        };

        fetchTeamData();
    }, [userId, loading]);

    const [showTeamModal, setshowTeamModal] = useState(false);
    const toggleTeamModal = () => setshowTeamModal(!showTeamModal);

    const handleSortByTeamName = () => {
        // Sorting teams by name in ascending order
        const sortedTeams = [...filteredTeams].sort((a, b) => a.name.localeCompare(b.name));
        setFilteredTeams(sortedTeams); // Update filtered teams to trigger re-render
    };
    
    const handleSortChange = (event) => {
        if (event.target.value === "Team Name") {
            handleSortByTeamName(); // Sort by team name
        } else if (event.target.value === "Recent Activity") {
            // Revert to the original teams order
            setFilteredTeams(originalTeams); // Restore to original order (by Recent Activity)
        }
    };
    

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTeams(value);

        if (debounceTimeout) {
            clearTimeout(debounceTimeout); // Clear the previous timeout if any
        }

        const newTimeout = setTimeout(() => {
            // Filter teams based on the search query after the debounce period
            const filtered = originalTeams.filter((team) =>
                team.name.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredTeams(filtered); // Set filtered teams state
        }, 500); // 500ms debounce time

        setDebounceTimeout(newTimeout); // Set the new timeout ID
    };

    return (
        <div className="container-fluid">
            {isDataLoading ? (
                <div className="d-flex justify-content-center align-items-center vh-100">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : (
                <>
                    {showTeamModal && <TeamModalComponent toggleModal={toggleTeamModal} />}
                    <div className="row d-flex align-items-center justify-content-center">
                        <main className=" m-2 col-md-12 ms-sm-auto  team-overview">
                            <div className=" py-2 px-3">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div>
                                        <h2 className="team-title">My Teams</h2>
                                        <p className="text-muted">Teams you're part of and their recent activities.</p>
                                    </div>
                                    <Button variant="primary" onClick={toggleTeamModal}>
                                        Create New Team
                                    </Button>
                                </div>

                                <div className="mb-4 d-flex justify-content-between">
                                    <Form.Control
                                        type="text"
                                        onChange={handleSearchChange}
                                        value={searchTeams}
                                        placeholder="Search teams..."
                                        className="w-25"
                                    />
                                    <div className="d-flex align-items-center">
                                        <span className="text-muted me-2">Sort by:</span>
                                        <Form.Control as="select" className="w-auto" onChange={handleSortChange}>
                                            <option>Recent Activity</option>
                                            <option>Team Name</option>
                                            <option>Faviroutes</option>
                                        </Form.Control>
                                    </div>
                                </div>

                                <Row>
                                    {filteredTeams.map((team, index) => (
                                        <Col md={6} lg={4} key={index} className="mb-4">
                                            <Card className="shadow-sm team-card">
                                                <Card.Body>
                                                    <div className="d-flex justify-content-between">
                                                        <div>
                                                            <h5 className="team-name">{team.name}</h5>
                                                            <span
                                                                className={`badge ${
                                                                    team.status === "Active" ? "bg-success" : "bg-warning"
                                                                }`}
                                                            >
                                                                {team.status}
                                                            </span>
                                                        </div>
                                                        <Button variant="link" className="text-decoration-none">
                                                            View Detail
                                                        </Button>
                                                    </div>
                                                    <p className="text-muted">{`${team.description == "" ? " " : team.description}`}</p>

                                                    <div className="d-flex justify-content-between mb-3">
                                                        <span>{team.members.length} Members</span>
                                                        <span>
                                                            <div className="d-flex align-items-center">
                                                                {team.members.slice(0, 2).map((memberId, index) => {
                                                                    const imageUrl = teamImages[memberId];
                                                                    return (
                                                                        <img
                                                                            key={index}
                                                                            className="rounded-circle border border-white object-fit-cover"
                                                                            src={imageUrl ? `http://localhost:3002/${imageUrl}` : "https://avatar.iran.liara.run/public/21"}
                                                                            alt="Team member"
                                                                            width="28"
                                                                            height="28"
                                                                            style={{ zIndex: 3, position: "relative", marginLeft: "-10px" }}
                                                                        />
                                                                    );
                                                                })}
                                                                {team.members.length > 2 && (
                                                                    <div
                                                                        className="rounded-circle border border-white bg-light d-flex align-items-center justify-content-center text-muted fw-medium"
                                                                        style={{
                                                                            width: "28px",
                                                                            height: "28px",
                                                                            position: "relative",
                                                                            marginLeft: "-10px",
                                                                            zIndex: 0,
                                                                            fontSize: "12px",
                                                                        }}
                                                                    >
                                                                        +{team.members.length - 2}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <h6>Active Projects</h6>
                                                        {team.projects.map((project, idx) => (
                                                            <div key={idx} className="d-flex justify-content-between py-2 border-bottom">
                                                                <span>{project.name}</span>
                                                                <span className="text-muted">{project.updated}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Card.Body>
                                            </Card>
                                        </Col>
                                    ))}
                                </Row>

                                {/* Pagination */}
                                <div className="d-flex justify-content-between mt-4">
                                    <Button variant="outline-secondary">Previous</Button>
                                    <Button variant="outline-secondary">Next</Button>
                                </div>
                            </div>
                        </main>
                    </div>
                </>
            )}
        </div>
    );
};

export default TeamOverview;
