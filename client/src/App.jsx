import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home/Home";
import About from "./Pages/About/About";
import SignUp from "./Pages/SignUp/SignUp";
import SignIn from "./Pages/SignIn/SignIn";
import Header from "./components/Header/Header";
import Profile from "./Pages/Profile/Profile";
import { PrivateRoute } from "./components/PrivateRoute/PrivateRoute";
import Property from "./Pages/Property/Property";
import UpdateProperty from "./Pages/UpdateProperty/UpdateProperty";

const App = () => {
  
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />}/>
          <Route path="/create-new-property" element={<Property />}/>
          <Route path="/update-property/:id" element={<UpdateProperty />}/>
        </Route>
      </Routes>
    </>
  );
};

export default App;
