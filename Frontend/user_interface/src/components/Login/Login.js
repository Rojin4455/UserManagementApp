// src/components/Login/Login.js
import React, { useState } from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { login } from '../../redux/Authentication/AuthenticationSlice';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const api_url = process.env.REACT_APP_API_URL
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // const async handleSubmit = (e) => {
  //   e.preventDefault();
  //   axios.post()
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try{
      const response = await axios.post(`${api_url}login/`,{
        "email":email,
        "password":password
      });
      console.log("success",response)
      const { access, refresh, isAdmin, userInfo } = response.data;
      const userData = {
        name: userInfo.first_name,
        email: userInfo.email,
        profilePic: userInfo.profile_pic,
        isAdmin,
        isAuthenticated: true,
      };
      localStorage.setItem('userData', JSON.stringify(userData));
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);

      dispatch(login(userData));
      if (!isAdmin){
      navigate('/home')
      }else{
        navigate('/admin')
      }


    } catch(error){
      console.log("got error",error)
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="login-button">Login</button>
        </form>
        <div className="additional-links">
          <Link to="/forgot-password">Forgot Password?</Link>
          <Link to="/">Sign Up</Link>
          
        </div>
      </div>
    </div>
  );
}

export default Login;
