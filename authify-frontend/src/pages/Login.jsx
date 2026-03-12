import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

// ✅ Custom Axios (with interceptor)
import api from "../util/api";

export default function Login() {

  const [isCreateAccount, setIsCreateAccount] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const { setIsLoggedIn, getUserData } = useContext(AppContext);

  const navigate = useNavigate();

  // ================= SUBMIT =================
  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password || (isCreateAccount && !name)) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {

      // ================= REGISTER =================
      if (isCreateAccount) {

        const res = await api.post("/register", {
          name,
          email,
          password,
        });

        if (res.status === 201) {

          toast.success("Account created successfully. Please login.");

          // Clear fields
          setName("");
          setEmail("");
          setPassword("");

          // Switch to login
          setIsCreateAccount(false);
        }

      }

      // ================= LOGIN =================
      else {

        const res = await api.post("/login", {
          email,
          password,
        });

        // ✅ SAVE JWT TOKEN
        localStorage.setItem("token", res.data.token);

        setIsLoggedIn(true);

        // Load profile
        await getUserData();

        toast.success("Login successful");

        navigate("/");

      }

    } catch (err) {

      console.error("Login error:", err);

      toast.error(
        err?.response?.data?.message || "Login failed"
      );

    } finally {
      setLoading(false);
    }
  };

  // ================= UI =================
  return (
    <div
      className="position-relative min-vh-100 d-flex justify-content-center align-items-center"
      style={{ background: "linear-gradient(90deg, #6a5af9, #8268f9)" }}
    >

      {/* LOGO */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "30px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Link
          to="/"
          style={{
            display: "flex",
            gap: 5,
            alignItems: "center",
            fontWeight: "bold",
            fontSize: "24px",
            textDecoration: "none",
          }}
        >
          <img src={assets.logo} alt="logo" width={32} height={32} />
          <span className="fw-bold fs-4 text-light">Authify</span>
        </Link>
      </div>

      {/* CARD */}
      <div className="card p-4" style={{ maxWidth: "400px", width: "100%" }}>

        <h2 className="text-center mb-4">
          {isCreateAccount ? "Create Account" : "Login"}
        </h2>

        <form onSubmit={onSubmitHandler}>

          {/* NAME */}
          {isCreateAccount && (
            <div className="mb-3">
              <label className="form-label">Full Name</label>

              <input
                type="text"
                className="form-control"
                placeholder="Enter full name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          {/* EMAIL */}
          <div className="mb-3">
            <label className="form-label">Email</label>

            <input
              type="email"
              className="form-control"
              placeholder="Enter email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-3">
            <label className="form-label">Password</label>

            <input
              type="password"
              className="form-control"
              placeholder="********"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* FORGOT */}
          {!isCreateAccount && (
            <div className="d-flex justify-content-between mb-3">
              <Link to="/reset-password" className="text-decoration-none">
                Forgot Password?
              </Link>
            </div>
          )}

          {/* BUTTON */}
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading
              ? "Loading..."
              : isCreateAccount
              ? "Sign Up"
              : "Login"}
          </button>

        </form>

        {/* SWITCH */}
        <div className="text-center mt-3">

          <p className="mb-0">

            {isCreateAccount ? (

              <>
                Already have an account?{" "}
                <span
                  onClick={() => setIsCreateAccount(false)}
                  style={{ cursor: "pointer" }}
                  className="text-decoration-underline"
                >
                  Login here
                </span>
              </>

            ) : (

              <>
                Don't have an account?{" "}
                <span
                  onClick={() => setIsCreateAccount(true)}
                  style={{ cursor: "pointer" }}
                  className="text-decoration-underline"
                >
                  Sign Up
                </span>
              </>

            )}

          </p>

        </div>

      </div>
    </div>
  );
}