import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useState } from "react";
import { app } from "../../firebase";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const Property = () => {
  const navigate = useNavigate()
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    imageUrl: [],
    name: "",
    description: "",
    address: "",
    type: "",
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: "6750",
    discountPrice: "0",
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);

  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrl.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrl: formData.imageUrl.concat(urls),
          });
          setUploading(false);
          setImageUploadError(false);
        })
        .catch((error) => {
          setImageUploadError("Image upload failed 2MB max per image...");
          setUploading(false);
        });
    } else {
      setImageUploadError("You can only upload 6 images per property...");
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      if (file.size > 2 * 1024 * 1024) {
        reject("File size exceeds 2MB");
        return;
      }

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
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

  const handleDeleteImage = (index) => {
    setFormData({
      ...formData,
      imageUrl: formData.imageUrl.filter((_, i) => i !== index),
    });
  };

  const handleFormSubmit = (e) => {
    if (e.target.id === "sale" || e.target.id === "rent") {
      setFormData({
        ...formData,
        type: e.target.id,
      });
    }

    if (
      e.target.id === "offer" ||
      e.target.id === "parking" ||
      e.target.id === "furnished"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.checked,
      });
    }

    if (
      e.target.type === "number" ||
      e.target.type === "textarea" ||
      e.target.type === "text"
    ) {
      setFormData({
        ...formData,
        [e.target.id]: e.target.value,
      });
    }
  };
  const handleClick = async (e) => {
    e.preventDefault();
    try {
      if (formData.imageUrl < 1) {
        return setError("You must have to upalod one image..");
      }
      setLoading(true);
      setError(false);
      const { data } = await axios.post(`/api/v1/properties`, formData);
      if (data.success === false) {
        setError(data.message);
      }
      console.log(data);
      setLoading(false);
      // setSuccess(data.message);
      navigate(`/properties/${data.property._id}`)
    } catch (error) {
      console.log(error);
      setError(error?.response?.data?.message);
      setLoading(false);
    }
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
            onChange={handleFormSubmit}
            value={formData.name}
          />
          <textarea
            type="text"
            placeholder="description"
            id="description"
            className="rounded-lg p-3 border"
            maxLength={62}
            minLength={10}
            required
            onChange={handleFormSubmit}
            value={formData.description}
          />
          <input
            type="text"
            placeholder="address"
            id="address"
            className="rounded-lg p-3 border"
            required
            onChange={handleFormSubmit}
            value={formData.address}
          />
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="sale"
                className="w-5"
                onChange={handleFormSubmit}
                checked={formData.type === "sale"}
              />
              <span>Sell</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="rent"
                className="w-5"
                onChange={handleFormSubmit}
                checked={formData.type === "rent"}
              />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="parking"
                className="w-5"
                onChange={handleFormSubmit}
                checked={formData.parking}
              />
              <span>Parkimg Spot</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="furnished"
                className="w-5"
                onChange={handleFormSubmit}
                checked={formData.furnished}
              />
              <span>Furnished</span>
            </div>
            <div className="flex gap-2">
              <input
                type="checkbox"
                id="offer"
                className="w-5"
                onChange={handleFormSubmit}
                checked={formData.offer}
              />
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
                onChange={handleFormSubmit}
                value={formData.bedrooms}
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
                onChange={handleFormSubmit}
                value={formData.bathrooms}
              />
              <p>Bathrooms</p>
            </div>
            <div className="flex gap-2 items-center">
              <input
                type="number"
                id="regularPrice"
                className="rounded-lg p-3 border border-gray-300"
                min="1"
                max="10"
                required
                onChange={handleFormSubmit}
                value={formData.regularPrice}
              />
              <div className="flex flex-col text-center">
                <p>Regular Price</p>
                <p className="text-sm">(₹ / month)</p>
              </div>
            </div>
            {formData.offer && (
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  id="discountPrice"
                  className="rounded-lg p-3 border border-gray-300"
                  min="1"
                  max="10"
                  required
                  onChange={handleFormSubmit}
                  value={formData.discountPrice}
                />
                <div className="flex flex-col text-center">
                  <p>Discounted Price</p>
                  <p className="text-sm">(₹ / month)</p>
                </div>
              </div>
            )}
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
              disabled={uploading}
              type="button"
              className="p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80"
              onClick={handleImageSubmit}
            >
              {uploading ? "uploading..." : "Upload"}
            </button>
          </div>
          {imageUploadError && imageUploadError}
          {formData.imageUrl.length > 0
            ? formData.imageUrl.map((url, index) => (
                <div
                  className="flex justify-between px-5 border items-center"
                  key={index}
                >
                  <img
                    src={url}
                    alt="listing image"
                    className="w-20 h-20 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteImage(index)}
                    className="p-3 text-red-700 rounded-lg hover:opacity-75 uppercase"
                  >
                    Delete
                  </button>
                </div>
              ))
            : ""}
          <button
            disabled={loading}
            type="button"
            onClick={handleClick}
            className="rounded-lg uppercase text-white bg-slate-700 p-3 hover:opacity-75 disabled:opacity-0"
          >
            {loading ? "Creating..." : " create property"}
          </button>
          {error && <p className="text-red-700 text-sm">{error}</p>}
          {success && <p className="text-green-700 text-sm">{success}</p>}
        </div>
      </form>
    </main>
  );
};

export default Property;
