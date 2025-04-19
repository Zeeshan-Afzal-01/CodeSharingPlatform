import React, { useState, useContext, useRef, useEffect } from 'react';
import { FaEdit, FaGithub, FaLinkedin, FaTwitter, FaCamera, FaTrophy, FaMedal, FaStar, FaPaperPlane, FaCode, FaEye, FaUpload } from 'react-icons/fa';
import { MdEmail, MdWork, MdLocationOn, MdAdd, MdClose, MdImage } from 'react-icons/md';
import { AuthContext } from '../../context/AuthContext';
import Modal from '../auth/Modal';
import './Profile.css';
import axios from "axios"
import { toast } from 'react-hot-toast';

const API_URL = "http://localhost:3002";

const Profile = () => {
  const { fullname, email, profilepic, loading, userId, username, setFullname, setEmail, token } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [uploadType, setUploadType] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showAvatarDropdown, setShowAvatarDropdown] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const profileInputRef = useRef(null);
  const coverInputRef = useRef(null);
  const avatarRef = useRef(null);

  const [user, setUser] = useState({
    name: fullname,
    role: 'Senior Software Engineer',
    bio: 'Passionate about building scalable applications and solving complex problems. Love to contribute to open-source projects and mentor junior developers.',
    skills: ['React', 'Node.js', 'MongoDB', 'TypeScript', 'Python', 'AWS'],
    location: 'San Francisco, CA',
    email: email,
    github: 'https://github.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe',
    twitter: 'https://twitter.com/johndoe',
    coverPhoto: null,
    profilePic: profilepic,
    experience: [
      {
        company: 'Tech Corp',
        position: 'Senior Software Engineer',
        duration: '2020 - Present',
        description: 'Leading the frontend team and architecting scalable solutions.'
      },
      {
        company: 'StartUp Inc',
        position: 'Full Stack Developer',
        duration: '2018 - 2020',
        description: 'Developed and maintained multiple web applications using React and Node.js.'
      }
    ],
    achievements: [
      {
        title: 'Top Contributor',
        description: 'Recognized as top contributor in the open source community',
        icon: <FaTrophy />
      },
      {
        title: 'Best Team Lead',
        description: 'Awarded best team lead for project excellence',
        icon: <FaMedal />
      },
      {
        title: 'Innovation Award',
        description: 'Received innovation award for implementing AI solutions',
        icon: <FaStar />
      }
    ],
    friends: [
      {
        id: 1,
        name: 'Sarah Wilson',
        role: 'UX Designer',
        avatar: 'https://randomuser.me/api/portraits/women/1.jpg'
      },
      {
        id: 2,
        name: 'Mike Chen',
        role: 'Backend Dev',
        avatar: 'https://randomuser.me/api/portraits/men/2.jpg'
      },
      {
        id: 3,
        name: 'Emma Davis',
        role: 'Product Manager',
        avatar: 'https://randomuser.me/api/portraits/women/3.jpg'
      },
      {
        id: 4,
        name: 'Alex Kim',
        role: 'Data Scientist',
        avatar: 'https://randomuser.me/api/portraits/men/4.jpg'
      }
    ]
  });

  // Add effect to update user when AuthContext values change
  useEffect(() => {
    setUser(prevUser => ({
      ...prevUser,
      name: fullname,
      email: email,
      profilePic: profilepic
    }));
  }, [fullname, email, profilepic]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setShowAvatarDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleAvatarClick = () => {
    setShowAvatarDropdown(!showAvatarDropdown);
  };

  const handleViewProfile = () => {
    setShowAvatarDropdown(false);
    setUploadType('profile');
    setShowImageUpload(true);
    setPreviewUrl(user.profilePic ? `${API_URL}/${user.profilePic.replace(/^.*?uploads\//, 'uploads/')}` : 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTUwIDE1MCI+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSI0MCIgZmlsbD0iIzk5OSI+PGZvcmVpZ25PYmplY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiB4PSItNDAiIHk9Ii00MCI+PHVzZSB4bGluazpocmVmPSIjcGVyc29uIi8+PC9mb3JlaWduT2JqZWN0PjwvdGV4dD48L3N2Zz4=');
  };

  const handleChangeProfile = () => {
    setShowAvatarDropdown(false);
    setModalOpen(true);
  };

  const updateAvatar = async (imgSrc) => {
    try {
      setIsUploading(true);
      
      // Convert base64 to file
      const response = await fetch(imgSrc);
      const blob = await response.blob();
      const file = new File([blob], "profile.jpg", { type: "image/jpeg" });

      // Create FormData and append the file
      const formData = new FormData();
      formData.append("profileImage", file);

      console.log("Uploading file:", file);
      console.log("User ID:", userId);
      console.log("Username:", username);

      // Make API call to upload the image
      const uploadResponse = await axios.put(
        `${API_URL}/users/updateProfileImage/${userId}/${username}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "Authorization": `Bearer ${token}`
          },
        }
      );

      console.log("Upload response:", uploadResponse.data);

      if (uploadResponse.data.success) {
        // Update the user state with the new image URL
        setUser(prev => ({ ...prev, profilePic: uploadResponse.data.imageUrl }));
        setPreviewUrl(uploadResponse.data.imageUrl);
        setModalOpen(false);
        toast.success("Profile picture updated successfully");
      } else {
        throw new Error(uploadResponse.data.message || "Failed to update profile image");
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        toast.error(error.response.data.message || error.response.data.error || "Failed to update profile image");
      } else if (error.request) {
        console.error('No response received:', error.request);
        toast.error("No response from server. Please try again.");
      } else {
        console.error('Error setting up request:', error.message);
        toast.error("Error setting up request. Please try again.");
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      console.log("Updating profile with data:", {
        fullname: user.name,
        email: user.email,
        location: user.location,
        bio: user.bio,
        github: user.github,
        linkedin: user.linkedin,
        twitter: user.twitter
      });

      const response = await axios.put(
        `${API_URL}/users/${userId}`,
        {
          fullname: user.name,
          email: user.email,
          location: user.location,
          bio: user.bio,
          github: user.github,
          linkedin: user.linkedin,
          twitter: user.twitter
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Update response:", response.data);

      if (response.data.success) {
        // Update local state
        setUser(prev => ({
          ...prev,
          name: response.data.data.fullname,
          email: response.data.data.email,
          location: response.data.data.location,
          bio: response.data.data.bio,
          github: response.data.data.github,
          linkedin: response.data.data.linkedin,
          twitter: response.data.data.twitter
        }));

        // Update AuthContext
        if (setFullname && setEmail) {
          setFullname(response.data.data.fullname);
          setEmail(response.data.data.email);
        }

        setIsEditing(false);
        toast.success('Profile updated successfully');
      } else {
        toast.error(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        toast.error(error.response.data.message || 'Failed to update profile');
      } else if (error.request) {
        console.error('No response received:', error.request);
        toast.error('No response from server. Please try again.');
      } else {
        console.error('Error setting up request:', error.message);
        toast.error('Error setting up request. Please try again.');
      }
    }
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !user.skills.includes(newSkill.trim())) {
      setUser(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }));
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setUser(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  };

  const handleImageClick = (type) => {
    setUploadType(type);
    if (type === 'profile') {
      profileInputRef.current.click();
    } else {
      coverInputRef.current.click();
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setShowImageUpload(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("profileImage", selectedImage);
    formData.append("username", username);

    try {
      const response = await axios.put(
        `${API_URL}/api/user/updateProfileImage/${userId}/${username}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setUser({ ...user, profilePic: response.data.imageUrl });
        setSelectedImage(null);
        setShowImageModal(false);
        toast.success("Profile picture updated successfully");
      } else {
        toast.error(response.data.message || "Failed to update profile picture");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error(error.response?.data?.message || "Failed to upload image");
    }
  };

  const renderEditForm = () => (
    <form onSubmit={handleSave} className="edit-form">
      <div className="edit-form-header">
        <h2><FaEdit /> Edit Profile</h2>
      </div>

      <div className="form-section">
        <div className="form-section-title">
          <MdWork /> Basic Information
        </div>
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={user.name}
            onChange={(e) => setUser(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter your full name"
          />
        </div>

        <div className="form-group">
          <label>Role</label>
          <input
            type="text"
            value={user.role}
            onChange={(e) => setUser(prev => ({ ...prev, role: e.target.value }))}
            placeholder="Enter your professional role"
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            type="text"
            value={user.location}
            onChange={(e) => setUser(prev => ({ ...prev, location: e.target.value }))}
            placeholder="Enter your location"
          />
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">
          <MdEmail /> About Me
        </div>
        <div className="form-group">
          <label>Bio</label>
          <textarea
            value={user.bio}
            onChange={(e) => setUser(prev => ({ ...prev, bio: e.target.value }))}
            rows="4"
            placeholder="Write a short bio about yourself"
          />
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">
          <FaCode /> Skills
        </div>
        <div className="form-group">
          <label>Your Skills</label>
          <div className="skills-input">
            {user.skills.map((skill, index) => (
              <div key={index} className="skill-input-tag">
                {skill}
                <MdClose
                  className="remove-skill"
                  onClick={() => handleRemoveSkill(skill)}
                />
              </div>
            ))}
            <form onSubmit={handleAddSkill}>
              <input
                type="text"
                className="skill-input"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Type a skill and press Enter"
              />
            </form>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="form-section-title">
          <FaGithub /> Social Links
        </div>
        <div className="social-inputs">
          <div className="form-group">
            <div className="social-input-group">
              <input
                type="text"
                value={user.github}
                onChange={(e) => setUser(prev => ({ ...prev, github: e.target.value }))}
                placeholder="GitHub Profile URL"
              />
              <FaGithub className="social-input-icon" />
            </div>
          </div>
          <div className="form-group">
            <div className="social-input-group">
              <input
                type="text"
                value={user.linkedin}
                onChange={(e) => setUser(prev => ({ ...prev, linkedin: e.target.value }))}
                placeholder="LinkedIn Profile URL"
              />
              <FaLinkedin className="social-input-icon" />
            </div>
          </div>
          <div className="form-group">
            <div className="social-input-group">
              <input
                type="text"
                value={user.twitter}
                onChange={(e) => setUser(prev => ({ ...prev, twitter: e.target.value }))}
                placeholder="Twitter Profile URL"
              />
              <FaTwitter className="social-input-icon" />
            </div>
          </div>
        </div>
      </div>

      <div className="button-group">
        <button type="submit" className="save-button">
          <FaEdit /> Save Changes
        </button>
        <button
          type="button"
          className="cancel-button"
          onClick={() => setIsEditing(false)}
        >
          <MdClose /> Cancel
        </button>
      </div>
    </form>
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }


  return (
    <div className="profile-container">
      {modalOpen && (
        <Modal
          updateAvatar={updateAvatar}
          closeModal={() => setModalOpen(false)}
          isUploading={isUploading}
        />
      )}
      
      <div className="profile-header">
        <div 
          className="cover-photo" 
          style={user.coverPhoto ? { backgroundImage: `url(${API_URL}/${user.coverPhoto})` } : undefined}
        >
          <button className="cover-photo-edit" onClick={() => handleImageClick('cover')}>
            <FaCamera />
          </button>
        </div>
        <div className="profile-info">
          <div className="profile-avatar" onClick={handleAvatarClick} ref={avatarRef}>
            <img 
              src={user.profilePic ? `${API_URL}/${user.profilePic.replace(/^.*?uploads\//, 'uploads/')}` : 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNTAiIGhlaWdodD0iMTUwIiB2aWV3Qm94PSIwIDAgMTUwIDE1MCI+PHJlY3Qgd2lkdGg9IjE1MCIgaGVpZ2h0PSIxNTAiIGZpbGw9IiNlZWUiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZG9taW5hbnQtYmFzZWxpbmU9Im1pZGRsZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1zaXplPSI0MCIgZmlsbD0iIzk5OSI+PGZvcmVpZ25PYmplY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiB4PSItNDAiIHk9Ii00MCI+PHVzZSB4bGluazpocmVmPSIjcGVyc29uIi8+PC9mb3JlaWduT2JqZWN0PjwvdGV4dD48L3N2Zz4='} 
              alt="Profile" 
            />
            <div className={`avatar-dropdown ${showAvatarDropdown ? 'show' : ''}`}>
              <div className="avatar-dropdown-item" onClick={handleViewProfile}>
                <FaEye /> View Photo
              </div>
              <div className="avatar-dropdown-item" onClick={handleChangeProfile}>
                <FaUpload /> Change Photo
              </div>
            </div>
          </div>
          <div className="profile-details">
            <div className="profile-text">
              <h1>{user.name}</h1>
              <div className="role">{user.role}</div>
              <div className="location">
                <MdLocationOn />
                {user.location}
              </div>
            </div>
            <button className="edit-button" onClick={() => setIsEditing(true)}>
              <FaEdit /> Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={profileInputRef}
        className="hidden-input"
        accept="image/*"
        onChange={handleImageChange}
      />
      <input
        type="file"
        ref={coverInputRef}
        className="hidden-input"
        accept="image/*"
        onChange={handleImageChange}
      />

      {/* Image upload/preview modal */}
      {showImageUpload && (
        <div className="upload-overlay" onClick={() => setShowImageUpload(false)}>
          <div className="upload-modal" onClick={e => e.stopPropagation()}>
            <h3>{uploadType === 'profile' ? 'Profile Picture' : 'Cover Photo'}</h3>
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="upload-preview"
              />
            )}
            <div className="upload-actions">
              {selectedImage && (
                <button className="save-button" onClick={handleImageUpload}>
                  Save Image
                </button>
              )}
              <button className="cancel-button" onClick={() => setShowImageUpload(false)}>
                {selectedImage ? 'Cancel' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="profile-content">
        <div className="profile-main">
          {isEditing ? (
            renderEditForm()
          ) : (
            <>
              <div className="profile-section">
                <h2>About</h2>
                <p>{user.bio}</p>
              </div>

              <div className="profile-section">
                <h2>Experience</h2>
                <div className="experience-container">
                  {user.experience.map((exp, index) => (
                    <div key={index} className="experience-item">
                      <MdWork className="experience-icon" />
                      <div>
                        <h3>{exp.position}</h3>
                        <p>{exp.company}</p>
                        <p className="duration">{exp.duration}</p>
                        <p>{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="profile-section achievements-section">
                <h2>Achievements</h2>
                {user.achievements.map((achievement, index) => (
                  <div key={index} className="achievement-card">
                    <div className="achievement-icon">
                      {achievement.icon}
                    </div>
                    <div className="achievement-details">
                      <h3>{achievement.title}</h3>
                      <p>{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="profile-sidebar">
          <div className="profile-section">
            <h2>Skills</h2>
            <div className="skills-container">
              {user.skills.map((skill, index) => (
                <span key={index} className="skill-tag">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="profile-section">
            <h2>Contact & Social</h2>
            <div className="social-links">
              <a href={`mailto:${user.email}`} className="social-link">
                <MdEmail /> Email
              </a>
              <a href={user.github} target="_blank" rel="noopener noreferrer" className="social-link">
                <FaGithub /> GitHub
              </a>
              <a href={user.linkedin} target="_blank" rel="noopener noreferrer" className="social-link">
                <FaLinkedin /> LinkedIn
              </a>
              <a href={user.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
                <FaTwitter /> Twitter
              </a>
            </div>
          </div>

          <div className="profile-section">
            <h2>Friends</h2>
            <div className="friends-list">
              {user.friends.map((friend) => (
                <div key={friend.id} className="friend-card">
                  <img src={friend.avatar} alt={friend.name} className="friend-avatar" />
                  <div className="friend-info">
                    <h3 className="friend-name">{friend.name}</h3>
                    <p className="friend-role">{friend.role}</p>
                  </div>
                  <button 
                    className="friend-message" 
                    onClick={() => console.log('Message', friend.name)}
                    title={`Message ${friend.name}`}
                  >
                    <FaPaperPlane size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 