// src/components/AdminHome/AdminHome.js
import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import axios from '../../axios/axios';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../redux/Authentication/AuthenticationSlice';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [userCreated, setUserCreated] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', email: '' });
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { isAuthenticated } = useSelector((state) => state.user_authentication)

  
  
  useEffect(() => {
    if(!isAuthenticated){
      navigate('/login')
    }
  })

  useEffect( () => {
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

    fetchUsers()
  },[]);


  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    console.log('search term',searchTerm);
  };

  const handleCreateUser = async () => {
    try{
      const response = await axios.post('admin-create-user/',{
        'first_name' : newUser.first_name,
        'last_name' : '',
        'email' : newUser.email,
        'password' : newUser.password
      })
      setUserCreated(true)
      console.log('pppppppppp',response.data.users);
      setUsers(response.data.users);
      console.log('ttttttttttttttttt',users);
      console.log("success created",response)
      toast.success('User created successfully!');

    }
    catch(error){
      console.log('got error',error);
    }

    // Add user creation logic here
    // setUsers([...users, { ...newUser, id: users.length + 1 }]);
    
    console.log(newUser);

    console.log(users);
    setNewUser({ first_name: '', email: '' });

  };

  const handleDeleteUser = async (id) => {
    // Add user deletion logic here
    try {
      console.log('user id : ',id)
      const response = await axios.post('admin-delete-user/',{'user_id':id});
      console.log('Success getting all users after delete', response);
      setUsers(response.data.all_users);
      toast.success('User deleted successfully!');
      
      console.log("got data's delete" ,response.data.all_users);
    } catch (error) {
      console.error('Error fetching admin data delete method', error);
      toast.error('Failed to delete user.');
    }

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

  console.log("dduser",users)
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
    <div>
    <ToastContainer />
    </div>
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
          value={newUser.first_name}
          onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
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
