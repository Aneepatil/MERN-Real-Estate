import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state) => state.user.currentUser);

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-3">
        <img
          className="rounded-full w-24 h-24 self-center object-cover cursor-pointer"
          src={user.avatar}
          alt="profile-pic"
        />
        <input
          type="text"
          placeholder="username"
          className="border p-3 rounded-lg"
          id="username"
        />
        <input
          type="email"
          placeholder="email"
          className="border p-3 rounded-lg"
          id="email"
        />
        <input
          type="text"
          placeholder="password"
          className="border p-3 rounded-lg"
          id="password"
        />
        <button className="uppercase bg-slate-700 p-3 hover:opacity-80 disabled:opacity-95 rounded-lg text-white">
          update
        </button>
        <button className="uppercase bg-green-700 p-3 hover:opacity-80 disabled:opacity-95 rounded-lg text-white">
          create listing
        </button>
        <div className="flex justify-between mt-3">
          <span className="text-red-700 cursor-pointer uppercase">Delete account</span>
          <span className="text-red-700 cursor-pointer uppercase">Sign out</span>
        </div>
      </form>
    </div>
  );
};

export default Profile;
