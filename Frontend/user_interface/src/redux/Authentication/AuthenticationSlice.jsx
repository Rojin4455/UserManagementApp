import { createSlice } from '@reduxjs/toolkit';

const getInitialAuthState = () => {

    try{
    const userData = JSON.parse(localStorage.getItem('userData'));
    const name = userData.name
    const email = userData.email
    const isAdmin = userData.isAdmin
    const isAuthenticated = userData.isAuthenticated;
    const profilePic = localStorage.getItem('profilePic');
    console.log("userrrrrrrrrrrr",name,email,isAdmin)
    return {
        name: name || null,
        email: email || null,
        isAuthenticated: isAuthenticated || false,
        isAdmin: isAdmin === 'true' ? true : false,
        profilePic: profilePic || null,

      };
    }
    catch{
        return{
        name:null,
        email:null,
        isAuthenticated:false,
        isAdmin:false,
        }
    }
  

};

export const authenticationSlice = createSlice({
  name: 'user_authentication',
  initialState: getInitialAuthState(),
  
  reducers: {
    login: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.isAuthenticated = action.payload.isAuthenticated;
      state.isAdmin = action.payload.isAdmin;
      state.profilePic = action.payload.profilePic
    },
    logout: (state) => {
      state.name = null;
      state.email = null;
      state.isAuthenticated = null;
      state.isAdmin = null;
      localStorage.clear();
    },
  },
});

export const { login, logout } = authenticationSlice.actions;

export default authenticationSlice.reducer;
