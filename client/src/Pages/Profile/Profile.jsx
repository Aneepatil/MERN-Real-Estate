import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../../firebase";

const Profile = () => {
  const { user } = useSelector((state) => state.user.currentUser);
  const fileRef = useRef(null);
  const [file, setFile] = useState(undefined);
  const [filePercentage, setFilePercentage] = useState();
  const [fileUploadErr, setFileUploadErr] = useState(false);
  const [formData, setFormData] = useState({});
  const maxFileSize = 2 * 1024 * 1024;

  useEffect(() => {
    if (file) {
      if (file.size > maxFileSize) {
        setFile(null);
        setFileUploadErr(true)
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

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-3">
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
          src={formData.avatar || user.avatar}
          alt="profile-pic"
        />
        <p className="text-sm self-center">
        {fileUploadErr ? (
          <span className="text-red-700">Error Image Upload or Image size must be less than 2MB</span>
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
          <span className="text-red-700 cursor-pointer uppercase">
            Delete account
          </span>
          <span className="text-red-700 cursor-pointer uppercase">
            Sign out
          </span>
        </div>
      </form>
    </div>
  );
};

export default Profile;
