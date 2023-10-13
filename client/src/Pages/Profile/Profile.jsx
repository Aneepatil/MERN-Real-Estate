import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";
import {
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signOutUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  updateUserFailure,
  updateUserStart,
  updateUserSuccess,
} from "../../redux/slices/userSlice/userSlice";
import axios from "axios";

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState();
  const [fileUploadErr, setFileUploadErr] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const maxFileSize = 2 * 1024 * 1024;

  useEffect(() => {
    if (file) {
      if (file.size > maxFileSize) {
        setFile(null);
        setFileUploadErr(true);
        return;
      }
      handleFileChange(file);
    }
  }, [file]);

  const handleFileChange = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePercentage(Math.round(progress));
      },

      (error) => {
        console.log(error);
        setFileUploadErr(true);
      },

      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...FormData, avatar: downloadURL });
        });
      }
    );
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const { data } = await axios.put(
        `/api/v1/users/update/${currentUser?._id}`,
        formData
      );

      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      // sending updated response
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error?.response?.data?.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());

      const { data } = await axios.delete(
        `/api/v1/users/delete/${currentUser?._id}`
      );

      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));

      navigate("/sign-in");
    } catch (error) {
      console.log(error);
      dispatch(deleteUserFailure(error?.response?.data?.message));
    }
  };

  const handleSignOutUser = async () => {
    try {
      dispatch(signOutUserStart());

      const { data } = await axios.get(
        `/api/v1/auth/sign-out`
      );

      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));

      navigate("/sign-in");
    } catch (error) {
      console.log(error);
      dispatch(signOutUserFailure(error?.response?.data?.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />
        <img
          onClick={() => fileRef.current.click()}
          className="rounded-full w-24 h-24 self-center object-cover cursor-pointer"
          src={currentUser?.avatar}
          alt="profile-pic"
        />
        <p className="text-sm self-center">
          {fileUploadErr ? (
            <span className="text-red-700">
              Error Image Upload or Image size must be less than 2MB
            </span>
          ) : filePercentage > 0 && filePercentage < 100 ? (
            <span className="text-slate-700">{`Image uploading ${filePercentage}%...`}</span>
          ) : filePercentage === 100 ? (
            <span className="text-slate-700">Image Uploaded Successfully</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          defaultValue={currentUser?.username}
          placeholder="username"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          id="username"
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser?.email}
          className="border p-3 rounded-lg"
          onChange={handleChange}
          id="email"
        />
        <input
          type="password"
          placeholder="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
          id="password"
        />
        <button
          disabled={loading}
          className="uppercase bg-slate-700 p-3 hover:opacity-80 disabled:opacity-95 rounded-lg text-white"
        >
          {loading ? "loading..." : "update"}
        </button>
        <button className="uppercase bg-green-700 p-3 hover:opacity-80 disabled:opacity-95 rounded-lg text-white">
          create listing
        </button>
      </form>
      <div className="flex justify-between mt-3">
        <span
          className="text-red-700 cursor-pointer uppercase"
          onClick={handleDeleteUser}
        >
          Delete account
        </span>
        <span className="text-red-700 cursor-pointer uppercase" onClick={handleSignOutUser}>Sign out</span>
      </div>
      <p className="text-red-700 mt-5">{error ? error : ""}</p>
      <p className="text-green-700 mt-5">
        {updateSuccess ? "User updated successfully" : ""}
      </p>
    </div>
  );
};

export default Profile;
