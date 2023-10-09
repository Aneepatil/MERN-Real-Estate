import React from "react";
import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);
  return (
    <>
      <header className="bg-slate-200 shadow-md">
        <div className="flex items-center max-w-6xl mx-auto justify-between p-3">
          <Link to={"/"}>
            <h1 className="font-bold text-sm sm:text-xl flex flex-wrap">
              <span className="text-slate-500">real</span>
              <span className="text-slate-700">Estate</span>
            </h1>
          </Link>
          <form className="flex bg-slate-100 p-3 rounded-lg items-center">
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent focus:outline-none w-24 sm:w-64"
            />
            <FaSearch className="text-slate-600 hover:" />
          </form>
          <ul className="flex gap-4 items-center">
            <Link to={"/"}>
              <li className="hidden sm:inline text-slate-700 hover:underline">
                Home
              </li>
            </Link>
            <Link to={"/about"}>
              <li className="hidden sm:inline text-slate-700 hover:underline">
                About
              </li>
            </Link>
            {currentUser ? (
              <Link to={"/profile"}>
                <img className="rounded-full h-9 w-9 object-cover" src={currentUser.user.avatar} alt="profile" />
              </Link>
            ) : (
              <Link to={"/sign-in"}>
                <li className="text-slate-700 hover:underline">Sign-In</li>
              </Link>
            )}
          </ul>
        </div>
      </header>
    </>
  );
};

export default Header;
