import React, { useState, useEffect, useRef,useContext } from 'react';
import {
  FiSearch,
  FiMoreVertical,
  FiSend,
  FiPaperclip,
  FiSmile,
  FiMic,
  FiMenu,
  FiSettings,
  FiUser,
  FiLogOut,
  FiBell,
  FiVideo,
  FiPhone,
  FiTrash2,
  FiArchive,
  FiStar,
  FiFlag,
  FiImage,
  FiFile,
  FiCamera,
  FiMapPin,
  FiMusic,
  FiLink,
  FiGift,
  FiDollarSign,
  FiCalendar,
  FiClock,
  FiCheckSquare,
  FiHeart,
  FiThumbsUp,
  FiThumbsDown,
  FiMeh,
  FiDownload,
  FiUpload,
  FiShare2,
  FiCopy,
  FiEdit,
  FiTrash,
  FiVolume2,
  FiVolumeX,
  FiMicOff,
  FiHeadphones,
  FiSpeaker,
  FiBluetooth,
  FiWifi,
  FiWifiOff,
  FiX,
  FiPlus
} from "react-icons/fi";
// import { FaRegLaugh } from "react-icons/fa";
import { FaRegLaugh,FaAngry } from "react-icons/fa";
import './messageStyle.css';
import { AuthContext } from '../../context/AuthContext';
import { getMessagesData } from '../../api/messageApi';
import moment from 'moment';
import { Dropdown } from 'react-bootstrap';
import { FaCode } from 'react-icons/fa';

const API_URL="http://localhost:3002"

const Messaging = () => {
const {profilepic,fullname,userId}=useContext(AuthContext)


  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRefs = useRef({});
  const [activeInputDropdown, setActiveInputDropdown] = useState(null);
  const [recentChats,setRecentChats]=useState([])
  const [isLoading, setIsLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const inputDropdownRefs = useRef({});
  const [showFriendsModal, setShowFriendsModal] = useState(false);
  const [friends, setFriends] = useState([]);
  const [searchFriendQuery, setSearchFriendQuery] = useState('');

  // Mock data for recent chats
  // const recentChats = [
  //   { id: 1, name: 'John Doe', lastMessage: 'Hey, how are you?', time: '2:30 PM', unread: 2, status: 'online' },
  //   { id: 2, name: 'Jane Smith', lastMessage: 'See you tomorrow!', time: '1:45 PM', unread: 0, status: 'offline' },
  //   { id: 3, name: 'Mike Johnson', lastMessage: 'Great idea!', time: '12:20 PM', unread: 1, status: 'online' },
  //   { id: 4, name: 'Sarah Wilson', lastMessage: 'Thanks for your help', time: '11:15 AM', unread: 0, status: 'offline' },
  // ];
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const data = await getMessagesData(userId);
        setRecentChats(data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [userId]);
  
  useEffect(() => {
    if (selectedChat) {
      // Here you would typically fetch the messages for the selected chat
      // For now, we'll use the content from the selected chat
      setChatMessages([
        {
          id: 1,
          content: selectedChat.content,
          sender: selectedChat.sender,
          receiver: selectedChat.receiver,
          timestamp: selectedChat.updatedAt
        }
      ]);
    }
  }, [selectedChat]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (message.trim()) {
      try {
        // Here you would typically send the message to your backend
        const newMessage = {
          id: Date.now(),
          content: message,
          sender: userId,
          receiver: selectedChat.receiver._id,
          timestamp: new Date().toISOString()
        };
        
        setChatMessages(prev => [...prev, newMessage]);
        setMessage('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
  };

 

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const toggleDropdown = (dropdownId) => {
    setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
  };

  const toggleInputDropdown = (dropdownId) => {
    setActiveInputDropdown(activeInputDropdown === dropdownId ? null : dropdownId);
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(dropdownRefs.current).forEach(key => {
        if (dropdownRefs.current[key] && !dropdownRefs.current[key].contains(event.target)) {
          setActiveDropdown(null);
        }
      });
      Object.keys(inputDropdownRefs.current).forEach(key => {
        if (inputDropdownRefs.current[key] && !inputDropdownRefs.current[key].contains(event.target)) {
          setActiveInputDropdown(null);
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const ProfileDropdown = () => (
    <div className="msg-dropdown" ref={el => dropdownRefs.current.profile = el}>
      <button 
        className={`msg-header-action-btn ${activeDropdown === 'profile' ? 'active' : ''}`}
        onClick={() => toggleDropdown('profile')}
      >
        <FiMoreVertical className="w-4 h-4" />
      </button>
      <div className={`msg-dropdown-content ${activeDropdown === 'profile' ? 'show' : ''}`}>
        <div className="msg-dropdown-item">
          <FiUser className="w-4 h-4" />
          Profile
        </div>
        <div className="msg-dropdown-item">
          <FiSettings className="w-4 h-4" />
          Settings
        </div>
        <div className="msg-dropdown-item">
          <FiBell className="w-4 h-4" />
          Notifications
        </div>
        <div className="msg-dropdown-divider" />
        <div className="msg-dropdown-item danger">
          <FiLogOut className="w-4 h-4" />
          Logout
        </div>
      </div>
    </div>
  );

  const ChatDropdown = () => (
    <div className="msg-dropdown" ref={el => dropdownRefs.current.chat = el}>
      <button 
        className={`msg-header-action-btn ${activeDropdown === 'chat' ? 'active' : ''}`}
        onClick={() => toggleDropdown('chat')}
      >
        <FiMoreVertical className="w-5 h-5" />
      </button>
      <div className={`msg-dropdown-content ${activeDropdown === 'chat' ? 'show' : ''}`}>
        <div className="msg-dropdown-item">
          <FiVideo className="w-4 h-4" />
          Video Call
        </div>
        <div className="msg-dropdown-item">
          <FiPhone className="w-4 h-4" />
          Voice Call
        </div>
        <div className="msg-dropdown-divider" />
        <div className="msg-dropdown-item">
          <FiStar className="w-4 h-4" />
          Star Messages
        </div>
        <div className="msg-dropdown-item">
          <FiFlag className="w-4 h-4" />
          Report
        </div>
        <div className="msg-dropdown-item">
          <FiArchive className="w-4 h-4" />
          Archive Chat
        </div>
        <div className="msg-dropdown-item danger">
          <FiTrash2 className="w-4 h-4" />
          Delete Chat
        </div>
      </div>
    </div>
  );

  const EmojiDropdown = () => (
    <div className={`msg-input-dropdown ${activeInputDropdown === 'emoji' ? 'show' : ''}`} ref={el => inputDropdownRefs.current.emoji = el}>
      <div className="msg-input-dropdown-grid">
        <div className="msg-input-dropdown-item">
          <div className="msg-input-dropdown-icon">
            <FiThumbsUp className="w-5 h-5" />
          </div>
          <span className="msg-input-dropdown-label">Thumbs Up</span>
        </div>
        <div className="msg-input-dropdown-item">
          <div className="msg-input-dropdown-icon">
            <FiThumbsDown className="w-5 h-5" />
          </div>
          <span className="msg-input-dropdown-label">Thumbs Down</span>
        </div>
        <div className="msg-input-dropdown-item">
          <div className="msg-input-dropdown-icon">
            <FiHeart className="w-5 h-5" />
          </div>
          <span className="msg-input-dropdown-label">Heart</span>
        </div>
        <div className="msg-input-dropdown-item">
          <div className="msg-input-dropdown-icon">
            <FaRegLaugh className="w-5 h-5" />
          </div>
          <span className="msg-input-dropdown-label">Laugh</span>
        </div>
        <div className="msg-input-dropdown-item">
          <div className="msg-input-dropdown-icon">
            <FiMeh className="w-5 h-5" />
          </div>
          <span className="msg-input-dropdown-label">Meh</span>
        </div>
        <div className="msg-input-dropdown-item">
          <div className="msg-input-dropdown-icon">
            <FaAngry className="w-5 h-5" />
          </div>
          <span className="msg-input-dropdown-label">Angry</span>
        </div>
      </div>
    </div>
  );

  const AttachmentDropdown = () => (
    <div className={`msg-input-dropdown ${activeInputDropdown === 'attachment' ? 'show' : ''}`} ref={el => inputDropdownRefs.current.attachment = el}>
      <div className="msg-input-dropdown-grid">
        <div className="msg-input-dropdown-item">
          <div className="msg-input-dropdown-icon">
            <FiImage className="w-5 h-5" />
          </div>
          <span className="msg-input-dropdown-label">Gallery</span>
        </div>
        <div className="msg-input-dropdown-item">
          <div className="msg-input-dropdown-icon">
            <FiCamera className="w-5 h-5" />
          </div>
          <span className="msg-input-dropdown-label">Camera</span>
        </div>
        <div className="msg-input-dropdown-item">
          <div className="msg-input-dropdown-icon">
            <FiFile className="w-5 h-5" />
          </div>
          <span className="msg-input-dropdown-label">Document</span>
        </div>
        <div className="msg-input-dropdown-item">
          <div className="msg-input-dropdown-icon">
            <FiMapPin className="w-5 h-5" />
          </div>
          <span className="msg-input-dropdown-label">Location</span>
        </div>
        <div className="msg-input-dropdown-item">
          <div className="msg-input-dropdown-icon">
            <FiMusic className="w-5 h-5" />
          </div>
          <span className="msg-input-dropdown-label">Audio</span>
        </div>
        <div className="msg-input-dropdown-item">
          <div className="msg-input-dropdown-icon">
            <FiVideo className="w-5 h-5" />
          </div>
          <span className="msg-input-dropdown-label">Video</span>
        </div>
      </div>
    </div>
  );

  const FriendsModal = () => (
    <div className="msg-friends-modal">
      <div className="msg-friends-modal-content">
        <div className="msg-friends-modal-header">
          <h3>All Friends</h3>
          <button onClick={() => setShowFriendsModal(false)} className="msg-friends-modal-close">
            <FiX />
          </button>
        </div>
        <div className="msg-friends-list">
          {friends.map(friend => (
            <div key={friend.id} className="msg-friend-item">
              <img src={friend.profilePic} alt={friend.name} className="msg-friend-avatar" />
              <div className="msg-friend-info">
                <h4>{friend.name}</h4>
                <p>{friend.status}</p>
              </div>
              <button 
                className="msg-friend-chat-btn"
                onClick={() => {
                  setSelectedChat(friend);
                  setShowFriendsModal(false);
                }}
              >
                Chat
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const handleCreateSnippet = () => {
    // Implementation of handleCreateSnippet function
  };

  return (
    <div className="msg-container">
      {/* Recent Chats Sidebar */}
      <div className={`msg-sidebar ${showSidebar ? 'show' : ''}`}>
        {/* User Profile Header */}
        <div className="msg-profile-header">
          <div className="msg-profile-info">
            <div className="msg-profile-avatar"><img className="msg-profile-avatar" src={`${API_URL}/${profilepic}`} alt="" /></div>
            <div className="msg-profile-name">{fullname}</div>
          </div>
          <div className="msg-header-actions">
            <ProfileDropdown />
          </div>
        </div>

        {/* Search Bar */}
        <div className="msg-search-container">
          <div className="relative">
            <FiSearch className="msg-search-icon w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search conversations..."
              className="msg-search-input"
            />
          </div>
        </div>

        {/* Recent Chats List */}
        <div className="msg-chats-list">
          {isLoading ? (
            <div className="msg-loading-container">
              <div className="msg-loading-spinner"></div>
              <p className="msg-loading-text">Loading messages...</p>
            </div>
          ) : recentChats ? (
            recentChats.map((chat) => (
              <div
                key={chat._id}
                onClick={() => {
                  setSelectedChat(chat);
                  setShowSidebar(false);
                }}
                className={`msg-chat-item ${selectedChat?._id === chat._id ? 'active' : ''}`}
              >
                {chat.receiver?.profilePic&&chat.receiver?.profilePic === profilepic ? (
                  <img src={`${API_URL}/${chat.sender?.profilePic}`}  className="msg-chat-avatar" />
                ):chat.receiver?.profilePic&&chat.receiver?.profilePic !== profilepic?(                  <img src={`${API_URL}/${chat.receiver?.profilePic}`}  className="msg-chat-avatar" />
                ) : (
                  <div className="msg-chat-avatar">
                    {chat.receiver?.fullname?.charAt(0)}
                  </div>
                )}
                <div className="msg-chat-info">
                  <div className="msg-chat-name">
                    {chat.sender?._id === userId 
                      ? chat.receiver?.fullname 
                      : chat.sender?.fullname || "Unknown User"}
                  </div>
                  <div className="msg-chat-message">{chat.content}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="msg-chat-time">{moment(chat.updatedAt, 'HH:mm').format('hh:mm A')}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="msg-no-chats">
              <p>No messages yet</p>
            </div>
          )}
        </div>
        <button 
          className="msg-floating-add-btn"
          onClick={() => setShowFriendsModal(true)}
        >
          <FiPlus />
        </button>
      </div>

      {/* Main Chat Area */}
      <div className="msg-main-chat">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="msg-chat-header">
              <div className="msg-chat-header-info">
                <button className="msg-header-action-btn md:hidden" onClick={toggleSidebar}>
                  <FiMenu className="w-5 h-5" />
                </button>
                <div className="msg-chat-avatar">
                {selectedChat.receiver?.profilePic&&selectedChat.receiver?.profilePic === profilepic ? (
                  <img src={`${API_URL}/${selectedChat.sender?.profilePic}`}  className="msg-chat-avatar" />
                ):selectedChat.receiver?.profilePic&&selectedChat.receiver?.profilePic !== profilepic?(                  <img src={`${API_URL}/${selectedChat.receiver?.profilePic}`} alt="Receiver Profile" className="msg-chat-avatar" />
                ) : (
                  <div className="msg-chat-avatar">
                    {selectedChat.receiver?.fullname?.charAt(0)}
                  </div>
                )}
                  {selectedChat?.status === 'online' && <div className="msg-online-indicator" />}
                </div>
                <div>
                  <div className="msg-chat-header-name">
                    {selectedChat?.sender?._id === userId 
                      ? selectedChat?.receiver?.fullname 
                      : selectedChat?.sender?.fullname || 'Unknown User'}
                  </div>
                  <div className="msg-chat-header-status">{selectedChat?.status || 'offline'}</div>
                </div>
              </div>
              <div className="msg-header-actions">
                <button className="msg-header-action-btn" title="Voice Call">
                  <FiPhone className="w-5 h-5" />
                </button>
                <button className="msg-header-action-btn" title="Video Call">
                  <FiVideo className="w-5 h-5" />
                </button>
                <ChatDropdown />
              </div>
            </div>

            {/* Messages Area */}
            <div className="msg-messages-container">
              {chatMessages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`msg-message ${msg.sender === userId ? 'sent' : 'received'}`}
                >
                  <div className="msg-message-content">
                    {msg.content}
                  </div>
                  <div className="msg-message-time">
                    {moment(msg.timestamp).format('hh:mm A')}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="msg-input-container">
              <form onSubmit={handleSendMessage} className="msg-input-form">
                <div className="relative">
                  <button 
                    type="button" 
                    className="msg-input-action-btn"
                    onClick={() => toggleInputDropdown('emoji')}
                  >
                    <FiSmile className="w-5 h-5" />
                  </button>
                  <EmojiDropdown />
                </div>
                <div className="relative">
                  <button 
                    type="button" 
                    className="msg-input-action-btn"
                    onClick={() => toggleInputDropdown('attachment')}
                  >
                    <FiPaperclip className="w-5 h-5" />
                  </button>
                  <AttachmentDropdown />
                </div>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="msg-input"
                />
                <div className="relative">
                  <button 
                    type="button" 
                    className="msg-input-action-btn"
                    onClick={() => toggleInputDropdown('voice')}
                  >
                    <FiMic className="w-5 h-5" />
                  </button>
                  
                </div>
                <button type="submit" className="msg-send-button">
                  <FiSend className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="msg-welcome-screen">
            <h1 className="msg-welcome-title">Welcome to Chat</h1>
            <p className="msg-welcome-text">
              Select a conversation from the sidebar to start messaging. Connect with your team members and collaborate seamlessly.
            </p>
          </div>
        )}
      </div>
      {showFriendsModal && <FriendsModal />}
    </div>
  );
};

export default Messaging; 