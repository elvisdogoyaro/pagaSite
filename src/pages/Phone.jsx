// Phone.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/phone.css";
import "../App.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormErrMsg from "../components/FormErrMsg";
import axios from "axios";
import BASE_URL from "../components/urls";

const schema = yup.object().shape({
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(/^[0-9]+$/, "Phone number must contain only digits")
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number cannot exceed 15 digits"),
});

const Phone = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const submitForm = (data) => {
    setLoading(true);
    axios
      .post(`${BASE_URL}/phone`, data)
      .then((response) => {
        console.log(response.data);
        console.log(data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      })
      .finally(() => {
        navigate("/otp");
        setLoading(false);
      });
  };

  return (
    <div className="container">
      <div className="backArrow">
        <i className="fa-solid fa-arrow-left"></i>
      </div>
      <div className="contentSec">
        <div className="title">Log in with phone number</div>
        <div className="subText">Enter your phone number to continue</div>
      </div>
      <div className="loginWrapper">
        <div className="loginSec">
          <form onSubmit={handleSubmit(submitForm)}>
            <label htmlFor="phone">Phone number</label>
            <div className="formInput">
              <input
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                {...register("phone")}
              />
            </div>
            <FormErrMsg errors={errors} inputName="phone" />

            <button type="submit" disabled={loading} className="loginBtn">
              {loading ? "Loading..." : "Continue"}
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

export default Phone;
