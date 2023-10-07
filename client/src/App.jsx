import React from "react";
import {Route,Routes} from 'react-router-dom'
import Header from "./Pages/Header/Header";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import Profile from "./Pages/Profile/Profile";
import SignUp from "./Pages/SignUp/SignUp";
import SignIn from "./Pages/SignIn/SignIn";

const App = () => {
  return (
    <>
      <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/about" element={<About/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path="/sign-in" element={<SignIn/>}/>
      </Routes>
    </>
  );
};

export default App;
