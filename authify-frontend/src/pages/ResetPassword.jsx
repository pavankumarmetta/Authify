import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets.js";
import { useRef, useState } from "react";
import { toast } from "react-toastify";
import api from "../util/api";   // ✅ use custom axios

const ResetPassword = () => {

  const inputRef = useRef([]);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  // ================= OTP INPUT HANDLING =================
  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");
    e.target.value = value;
    if (value && index < 5) {
      inputRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData
      .getData("text")
      .slice(0, 6)
      .split("");

    paste.forEach((digit, i) => {
      if (inputRef.current[i]) {
        inputRef.current[i].value = digit;
      }
    });

    const next = paste.length < 6 ? paste.length : 5;
    inputRef.current[next].focus();
  };

  // ================= SEND RESET OTP =================
  const onSubmitEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      const response = await api.post(
        `/send-reset-otp?email=${email}`
      );

      if (response.status === 200) {

        toast.success("Password reset OTP sent successfully.");
        setIsEmailSent(true);

      }

    } catch (error) {

      toast.error(
        error?.response?.data?.message || "Unable to send OTP"
      );

    } finally {

      setLoading(false);

    }
  };

  // ================= VERIFY OTP STEP =================
  const handleVerify = () => {

    const enteredOtp = inputRef.current
      .map((input) => input.value)
      .join("");

    if (enteredOtp.length !== 6) {
      toast.error("Please enter all 6 digits of the OTP.");
      return;
    }

    setOtp(enteredOtp);
    setIsOtpSubmitted(true);
  };

  // ================= SUBMIT NEW PASSWORD =================
  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {

      const response = await api.post(
        "/reset-password",
        {
          email,
          otp,
          newPassword
        }
      );

      if (response.status === 200) {

        toast.success("Password reset successfully.");
        navigate("/login");

      }

    } catch (error) {

      toast.error(
        error?.response?.data?.message || "Invalid OTP or expired OTP"
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <div
      className="d-flex align-items-center justify-content-center vh-100 position-relative"
      style={{
        background: "linear-gradient(90deg, #6a5af9, #8268f9)"
      }}
    >

      {/* LOGO */}
      <Link
        to="/"
        className="position-absolute top-0 start-0 p-4 d-flex align-items-center gap-2 text-decoration-none"
      >
        <img src={assets.logo} alt="logo" height={32} width={32} />
        <span className="fs-4 fw-semibold text-light">
          Authify
        </span>
      </Link>

      {/* STEP 1: ENTER EMAIL */}
      {!isEmailSent && (

        <div
          className="rounded-4 p-5 text-center bg-white"
          style={{ width: "100%", maxWidth: "400px" }}
        >

          <h4 className="mb-2">Reset Password</h4>
          <p className="mb-4">
            Enter your registered email address
          </p>

          <form onSubmit={onSubmitEmail}>

            <input
              type="email"
              className="form-control mb-4"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button
              className="btn btn-primary w-100"
              type="submit"
              disabled={loading}
            >
              {loading ? "Loading..." : "Submit"}
            </button>

          </form>

        </div>

      )}

      {/* STEP 2: OTP */}
      {!isOtpSubmitted && isEmailSent && (

        <div
          className="p-5 rounded-4 shadow bg-white"
          style={{ width: "400px" }}
        >

          <h4 className="text-center fw-bold mb-2">
            Enter OTP
          </h4>

          <div className="d-flex justify-content-between gap-2 mb-4">

            {[...Array(6)].map((_, i) => (

              <input
                key={i}
                type="text"
                maxLength={1}
                className="form-control text-center fs-4"
                ref={(el) => (inputRef.current[i] = el)}
                onChange={(e) => handleChange(e, i)}
                onKeyDown={(e) => handleKeyDown(e, i)}
                onPaste={handlePaste}
              />

            ))}

          </div>

          <button
            className="btn btn-primary w-100"
            onClick={handleVerify}
          >
            Verify OTP
          </button>

        </div>

      )}

      {/* STEP 3: NEW PASSWORD */}
      {isOtpSubmitted && isEmailSent && (

        <div
          className="rounded-4 p-4 text-center bg-white"
          style={{ width: "100%", maxWidth: "400px" }}
        >

          <h4>New Password</h4>

          <form onSubmit={onSubmitNewPassword}>

            <input
              type="password"
              className="form-control mb-4"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <button
              type="submit"
              className="btn btn-primary w-100"
              disabled={loading}
            >
              {loading ? "Loading..." : "Submit"}
            </button>

          </form>

        </div>

      )}

    </div>
  );
};

export default ResetPassword;