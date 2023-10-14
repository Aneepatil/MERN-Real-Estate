import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useState } from "react";
import { app } from "../../firebase";

const Property = () => {
  const maxFileSize = 2 * 1024 * 1024;
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
  });
  const [imageUploadError, setImageUploadError] = useState(false);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
        })
        .catch((error) => {
          setImageUploadError("Image upload failed 2MB max per image...");
        });
    } else {
      setImageUploadError("You can only upload 6 images per property...");
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Progress ${progress}`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

  return (
    <main className="p-3 max-w-4xl mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7 uppercase">
        create a property
      </h1>
      <form className="flex flex-col sm:flex-row gap-4">
        <div className="flex flex-col gap-4 flex-1">
          <input
            type="text"
            placeholder="name"
            id="name"
            className="rounded-lg p-3 border"
            maxLength={62}
            minLength={10}
            required
          />
          <textarea
            type="text"
            placeholder="description"
            id="description"
            className="rounded-lg p-3 border"
            maxLength={62}
            minLength={10}
            required
          />
          <input
            type="text"
            placeholder="address"
            id="address"
            className="rounded-lg p-3 border"
            required
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input type="checkbox" id="sell" className="w-5" />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="rent" className="w-5" />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="parking" className="w-5" />
              <span>Parkimg Spot</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="furnished" className="w-5" />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id="offer" className="w-5" />
              <span>Offer</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-6">
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="beds"
                className="rounded-lg p-3 border border-gray-300"
                min="1"
                max="10"
                required
              />
              <p>Beds</p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="bathrooms"
                className="rounded-lg p-3 border border-gray-300"
                min="1"
                max="10"
                required
              />
              <p>Bathrooms</p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="bathrooms"
                className="rounded-lg p-3 border border-gray-300"
                min="1"
                max="10"
                required
              />
              <div className="flex flex-col text-center">
                <p>Regular Price</p>
                <p className="text-sm">($ / month)</p>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="bathrooms"
                className="rounded-lg p-3 border border-gray-300"
                min="1"
                max="10"
                required
              />
              <div className="flex flex-col text-center">
                <p>Discounted Price</p>
                <p className="text-sm">($ / month)</p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col flex-1 gap-4">
          <p className="font-semibold">
            Images:
            <span className="font-normal text-green-700 ml-2">
              The first image will be the cover pic (max 6)
            </span>
          </p>
          <div className="flex gap-4">
            <input
              onChange={(e) => setFiles(e.target.files)}
              className="p-3 border-green-300 border w-full rounded"
              type="file"
              multiple
              accept="/*"
              id="images"
            />
            <button
              type="button"
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              onClick={handleImageSubmit}
            >
              upload
            </button>
          </div>
          {imageUploadError && imageUploadError}
          {formData.imageUrls.length > 0
            ? formData.imageUrls.map((url) => (
                <div className="flex justify-between px-5 border items-center">
                  <img
                    src={url}
                    alt="listing image"
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button className="p-3 text-red-700 rounded-lg hover:opacity-75 uppercase">
                    Delete
                  </button>
                </div>
              ))
            : ""}
          <button className="rounded-lg uppercase text-white bg-slate-700 p-3 hover:opacity-75 disabled:opacity-0">
            create property
          </button>
        </div>
      </form>
    </main>
  );
};

export default Property;
