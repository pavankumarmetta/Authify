import { assets } from "../assets/assets.js";
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { toast } from "react-toastify";

// ✅ Use your custom axios (with JWT interceptor)
import api from "../util/api";

const Menubar = () => {

  const navigate = useNavigate();

  const { userData, setUserData, setIsLoggedIn } =
    useContext(AppContext);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const dropdownRef = useRef(null);

  // ================= CLOSE DROPDOWN WHEN CLICK OUTSIDE =================
  useEffect(() => {

    const handleClickOutside = (event) => {

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }

    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);

  }, []);

  // ================= LOGOUT =================
  const handleLogout = () => {

    // Remove JWT token
    localStorage.removeItem("token");

    // Reset context
    setIsLoggedIn(false);
    setUserData(null);

    // Close dropdown
    setDropdownOpen(false);

    toast.success("Logged out successfully");

    // Go to login
    navigate("/login");
  };

  // ================= SEND VERIFY OTP =================
  const sendVerificationOtp = async () => {
    setDropdownOpen(false); 

    try {

      if (!userData?.email) {
        toast.error("User email not found");
        return;
      }

      const response = await api.post(
        `/send-reset-otp?email=${userData.email}`
      );

      if (response.status === 200) {

        toast.success("OTP sent to your email");

        navigate("/email-verify");

        setDropdownOpen(false);
      }

    } catch (error) {

      console.error("OTP Error:", error);

      toast.error(
        error?.response?.data?.message || "Unable to send OTP"
      );
    }
  };

  return (

    <nav className="navbar bg-white px-5 py-4 d-flex justify-content-between align-items-center">

      {/* LOGO */}
      <div className="d-flex align-items-center gap-2">

        <img
          src={assets.logo_home}
          alt="logo"
          width={32}
          height={32}
        />

        <span className="fw-bold fs-4 text-dark">
          Authify
        </span>

      </div>

      {/* USER MENU */}
      {userData ? (

        <div
          className="position-relative"
          ref={dropdownRef}
        >

          {/* Avatar */}
          <div
            className="bg-dark text-white rounded-circle d-flex justify-content-center align-items-center"
            style={{
              width: "40px",
              height: "40px",
              cursor: "pointer",
              userSelect: "none",
            }}
            onClick={() =>
              setDropdownOpen((prev) => !prev)
            }
          >
            {userData.name?.[0]?.toUpperCase()}
          </div>

          {/* Dropdown */}
          {dropdownOpen && (

            <div
              className="position-absolute shadow bg-white rounded p-2"
              style={{
                top: "50px",
                right: 0,
                zIndex: 100,
              }}
            >

              {/* VERIFY EMAIL (ONLY IF NOT VERIFIED) */}
              {!userData.isAccountVerified && (

                <div
                  className="dropdown-item py-1 px-2"
                  style={{ cursor: "pointer" }}
                  onClick={sendVerificationOtp}
                >
                  Verify email
                </div>

              )}

              {/* LOGOUT */}
              <div
                className="dropdown-item py-1 px-2 text-danger"
                style={{ cursor: "pointer" }}
                onClick={handleLogout}
              >
                Logout
              </div>

            </div>

          )}

        </div>

      ) : (

        <div
          className="btn btn-outline-dark rounded-pill px-3"
          onClick={() => navigate("/login")}
        >
          Login <i className="bi bi-arrow-right ms-2"></i>
        </div>

      )}

    </nav>

  );
};

export default Menubar;