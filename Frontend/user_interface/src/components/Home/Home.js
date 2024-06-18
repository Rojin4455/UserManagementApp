import React, { useEffect, useState } from 'react';
import './Home.css';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/Authentication/AuthenticationSlice';
import axios from '../../axios/axios';
import { FaEdit } from "react-icons/fa";


function UserProfile() {
  const { isAuthenticated, name, email, isAdmin,profilePic } = useSelector((state) => state.user_authentication);
  const api_url = process.env.REACT_APP_API_URL;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [profileImage, setProfileImage] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [isEditing,setIsEditing] = useState(false)


  useEffect(() => {
    // Retrieve the image URL from localStorage when the component mounts
    try{
    const savedImageUrl = localStorage.getItem('profilePic');
    
    if (savedImageUrl) {
      setProfileImageUrl(savedImageUrl);
    }else{
      const userData = localStorage.getItem('userData');
      const parsedUserData = JSON.parse(userData);
      const savedImageUrl = parsedUserData.profilePic
      setProfileImageUrl(savedImageUrl)
    }
  }
  catch{
    
  }
}, []);

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setProfileImage(selectedImage); // Store the file object directly
      await handleImageUpload(selectedImage); // Call the upload function immediately
    }
  };

  const handleImageUpload = async (imageFile) => {
    if (imageFile) {
      const formData = new FormData();
      formData.append('profile_pic', imageFile);

      try {
        const response = await axios.post(`update-profile/`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log('Image upload successful', response);
        localStorage.setItem('profilePic', response.data.pictureURL);
        setProfileImageUrl(response.data.pictureURL);

        // Optionally, update the state or UI based on the response
      } catch (error) {
        console.error('Image upload error', error);
      }
    }
  };
  console.log('eee',profileImageUrl)



  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${api_url}`);
        console.log('User data', response);
        // Handle the response, e.g., set user data
      } catch (error) {
        console.error('Fetch user data error', error);
      }
    };

    fetchUserData();
  }, [isAuthenticated, navigate, api_url]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const [editedName, setEditedName] = useState(name);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      try{
      const response = axios.post('edit-username/',{
        new_name:editedName,
      })
      console.log("name edited succefully",response)
    }
    catch(error){
      console.log("error got while name",error)
    }

      const userData = JSON.parse(userDataString);
        userData.name = editedName;
        localStorage.setItem('userData', JSON.stringify(userData));
        setEditedName(editedName);
    } else {
      console.error('User data not found in localStorage');
    }
  
  };

  const handleChange = (e) => {
    setEditedName(e.target.value);
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <h2>User Profile</h2>
        <div className="profile-image">
      {profileImageUrl ? (
        <img src={profileImageUrl} alt="Profile" />
      ) : (
        profileImage ? (
          <img src={URL.createObjectURL(profileImage)} alt="Profile" />
        ) : (
          <div className="placeholder-image">Upload Image</div>
        )
      )}
      <input type="file" onChange={handleImageChange} className="file-input" />
    </div>
        <div className="profile-details">
        <div className='username'>
      <div className="detail">
        <label>Username:</label>
        {isEditing ? (
          <>
            <input type="text" value={editedName} onChange={handleChange} />
            <button onClick={handleSave}>Save</button>
          </>
        ) : (
          <span>{editedName}</span>
        )}
      </div>
      <div>
        {!isEditing && <FaEdit onClick={handleEdit} />}
      </div>
    </div>
          <div className="detail">
            <label>Email:</label>
            <span>{email}</span>
          </div>
        </div>
        <button className="logout-button" onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default UserProfile;
