import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../../components/OAuth/OAuth";
import { signInFailure, signInStart, signInSuccess } from "../../redux/slices/userSlice/userSlice";

const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const {loading,error} = useSelector((state) => state.user);
  

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [id]: value }));
  };
  const handleSignIn = async (e) => {
    e.preventDefault();
    dispatch(signInStart());

    try {
      const {data} = await axios.post("api/v1/auth/sign-in", formData);

      console.log(data);
      if (data?.success === false) {
        dispatch(signInFailure(data?.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.response.data.message));
    }
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSignIn}>
        <input
          type="email"
          placeholder="eamil"
          id="email"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="password"
          id="password"
          className="border p-3 rounded-lg"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="uppercase text-white bg-slate-700 p-3 rounded-lg hover:opacity-95 disabled:opacity-80"
        >
          {loading ? "Loading..." : "Sign In"}
        </button>
        <OAuth />
      </form>
      <div className="flex gap-2 mt-5">
        <p>Do not have an account?</p>
        <Link to={"/sign-up"}>
          <span className="text-blue-700">Sign-Up</span>
        </Link>
      </div>
      <div>{error && <p className="text-red-500 mt-5">{error}</p>}</div>
    </div>
  );
};

export default SignIn;
