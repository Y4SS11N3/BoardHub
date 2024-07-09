import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUser, updateUser, uploadAvatar, updatePassword, deleteUser } from '../../redux/actions/userActions';
import { useNavigate, useLocation } from 'react-router-dom';
import SettingsSidebar from '../../components/Sidebar/SettingsSidebar';
import { PencilIcon, KeyIcon, TrashIcon, ArrowLeftIcon } from '@heroicons/react/24/solid';

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, error } = useSelector(state => state.user);
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    email: '',
    username: '',
    about: '',
    language: 'English (US)',
    accountType: 'Student',
    avatarUrl: ''
  });
  const [passwordInfo, setPasswordInfo] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const fileInputRef = useRef(null);
  const { avatarUploading } = useSelector(state => state.user);

  // Fetch user data on component mount
  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  // Update local state when user data is fetched
  useEffect(() => {
    if (user) {
      setUserInfo({
        fullName: user.fullName || '',
        email: user.email || '',
        username: user.username || '',
        about: user.about || '',
        language: user.language || 'English (US)',
        accountType: user.accountType || 'Student',
        avatarUrl: user.avatarUrl || ''
      });
    }
  }, [user]);

  // Handle input change for user info
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserInfo(prevState => ({ ...prevState, [name]: value }));
  };

  // Handle input change for password info
  const handlePasswordChange = (event) => {
    const { name, value } = event.target;
    setPasswordInfo(prevState => ({ ...prevState, [name]: value }));
  };

  // Handle avatar upload
  const handleAvatarUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      dispatch(uploadAvatar(file))
        .then((avatarUrl) => {
          setUserInfo(prevState => ({ ...prevState, avatarUrl }));
          dispatch(updateUser({ ...userInfo, avatarUrl }));
        })
        .catch((error) => {
          // Handle error
        });
    }
  };

  // Handle saving user changes
  const handleSaveChanges = () => {
    dispatch(updateUser(userInfo))
      .then((updatedUser) => {
        if (updatedUser) {
          setUserInfo(prevState => ({
            ...prevState,
            ...updatedUser,
            avatarUrl: updatedUser.avatarUrl || prevState.avatarUrl
          }));
          dispatch({ type: 'UPDATE_USER_SUCCESS', payload: updatedUser });
        }
      })
      .catch((error) => {
        // Handle error
      });
  };

  // Handle changing password
  const handleChangePassword = () => {
    if (passwordInfo.newPassword !== passwordInfo.confirmPassword) {
      // Handle error: passwords don't match
      return;
    }
    dispatch(updatePassword(passwordInfo.currentPassword, passwordInfo.newPassword))
      .then(() => {
        // Handle success
        setPasswordInfo({ currentPassword: '', newPassword: '', confirmPassword: '' });
      })
      .catch((error) => {
        // Handle error
      });
  };

  // Handle account deletion
  const handleDeleteAccount = () => {
    if (deleteConfirmation !== user.email) {
      // Handle error: email confirmation doesn't match
      return;
    }
    dispatch(deleteUser())
      .then(() => {
        navigate('/');
      })
      .catch((error) => {
        // Handle error
      });
  };

  // Render content based on current path
  const renderContent = () => {
    const path = location.pathname;

    if (!user) {
      return <div>Loading user data...</div>;
    }

    if (path.endsWith('change-password')) {
      return (
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Change Password</h2>
          <div className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordInfo.currentPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordInfo.newPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordInfo.confirmPassword}
                onChange={handlePasswordChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <button
              onClick={handleChangePassword}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 mt-6"
            >
              Change Password
            </button>
          </div>
        </div>
      );
    } else if (path.endsWith('delete-account')) {
      return (
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          <h2 className="text-2xl font-semibold text-red-600 mb-6">Delete Account</h2>
          <p className="text-gray-700">This action is irreversible. Please type your email address to confirm.</p>
          <div className="space-y-4">
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(e) => setDeleteConfirmation(e.target.value)}
              placeholder="Enter your email to confirm"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
            />
            <button
              onClick={handleDeleteAccount}
              className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors duration-200"
              disabled={deleteConfirmation !== user.email}
            >
              Permanently Delete Account
            </button>
          </div>
        </div>
      );
    } else {
      // Default to basic info
      return (
        <div className="bg-white rounded-lg shadow-lg p-8 space-y-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Basic Information</h2>
          <div className="flex items-center space-x-6 mb-8">
            <div className="relative">
              {userInfo.avatarUrl ? (
                <img src={userInfo.avatarUrl} alt="User Avatar" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-indigo-500 flex items-center justify-center text-white text-3xl font-bold">
                  {userInfo.fullName.charAt(0)}
                </div>
              )}
              <button 
                onClick={() => fileInputRef.current.click()}
                className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
              >
                <PencilIcon className="w-5 h-5 text-gray-600" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarUpload}
                className="hidden"
                accept="image/*"
              />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-gray-800">{userInfo.fullName}</h3>
              <p className="text-gray-600">@{userInfo.username}</p>
            </div>
          </div>
          {Object.entries(userInfo).filter(([key]) => !['avatarUrl'].includes(key)).map(([key, value]) => (
            <div key={key} className="space-y-2">
              <label htmlFor={key} className="block text-sm font-medium text-gray-700">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </label>
              <div className="relative">
                <input
                  type="text"
                  id={key}
                  name={key}
                  value={value}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 pr-10"
                />
                <PencilIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
          <button
            onClick={handleSaveChanges}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-200 mt-6"
          >
            Save Changes
          </button>
        </div>
      );
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
  </div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <SettingsSidebar />
      <div className="flex-grow p-8">
        <button
          onClick={() => navigate('/dashboard')}
          className="mb-6 flex items-center justify-center px-4 py-2 bg-white text-indigo-600 rounded-full shadow-md hover:bg-indigo-50 transition-colors duration-200 group"
        >
          <ArrowLeftIcon className="w-5 h-5 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back to Dashboard</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Settings</h1>
        {renderContent()}
      </div>
    </div>
  );
};

export default Settings;