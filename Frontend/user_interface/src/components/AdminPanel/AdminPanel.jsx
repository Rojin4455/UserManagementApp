// src/components/AdminHome/AdminHome.js
import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import axios from '../../axios/axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/Authentication/AuthenticationSlice';
import { useSelector } from 'react-redux';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [newUser, setNewUser] = useState({ username: '', email: '' });
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.user_authentication)

  
  
  useEffect(() => {
    if(!isAuthenticated){
      navigate('/login')
    }
  })

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('admin-home/');
        console.log('Success getting all users', response);
        setUsers(response.data.all_users);
        console.log("got data's",response.data.all_users);
      } catch (error) {
        console.error('Error fetching admin data', error);
      }
    };

    fetchUsers();
  }, []);


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleCreateUser = () => {
    // Add user creation logic here
    setUsers([...users, { ...newUser, id: users.length + 1 }]);
    setNewUser({ username: '', email: '' });
  };

  const handleDeleteUser = (id) => {
    // Add user deletion logic here
    setUsers(users.filter(user => user.id !== id));
  };

  const handleStatus = (user,status) => {

    setEditUser(user);

    const changeStatus = async () => {
      try {
        console.log('status : ',status)
        const response = await axios.post('admin-change-status/',{'status':status,'user_id':user.id});
        console.log('Success getting all users', response);
        setUsers(response.data.all_users);
        console.log("got data's",response.data.all_users);
      } catch (error) {
        console.error('Error fetching admin data', error);
      }
    };
    changeStatus()
  };

  {console.log("dduser",users)}
  const filteredUsers = users.filter(user =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
    
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="admin-home-wrapper">
  <div className="admin-home-card">
    <h2>Admin Home</h2>
    <div className="admin-actions">
      <input
        type="text"
        placeholder="Search users..."
        value={searchTerm}
        onChange={handleSearchChange}
        className="search-input"
      />
      <div className="new-user-form">
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <button onClick={handleCreateUser} className="create-button">Create User</button>
      </div>
    </div>
    <div className="user-list">
      {filteredUsers.map(user => (
        !user.is_superuser && (
          <div key={user.id} className="user-item">
            
              <>
                <span>{user.first_name} - {user.email}</span>
                {user.is_active ? (
                      <button onClick={() => handleStatus(user,false)} className="active-button" >Active</button>
                    ) : (
                      <button onClick={() => handleStatus(user,true)} className="deactive-button">Non-active</button>
                    )}

                <button onClick={() => handleDeleteUser(user.id)} className="delete-button">Delete</button>
              </>
            
          </div>
        )
      ))}
    </div>
    <button className="logout-button" onClick={handleLogout}>Logout</button>
  </div>
</div>


  );
}

export default AdminPanel;
