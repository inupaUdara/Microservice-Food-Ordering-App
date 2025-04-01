import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../services/auth/auth";
import { isAuthenticated } from "../../helper/Auth";
import { showToast } from "../../helper/Toast";
import SignUp from "./Customer/SignUp";

const Account = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  useEffect(() => {
    if (isAuthenticated()) {
      navigate("/");
    }
  }, [navigate]);

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !isValidEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    try {
      const user = await login({ email, password });
      showToast(`Welcome back, ${user.firstName}!`, "success");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };
  return (
    <section className="account py-80">
      <div className="container container-lg">
        <div>
          <div className="row gy-4">
            {/* Login Card Start */}
            <div className="col-xl-6 pe-xl-5">
              <form onSubmit={handleSubmit}>
                <div className="border border-gray-100 hover-border-main-600 transition-1 rounded-16 px-24 py-40 h-100">
                  <h6 className="text-xl mb-32">Login</h6>
                  {error && <p className="text-danger">{error}</p>}
                  <div className="mb-24">
                    <label
                      htmlFor="username"
                      className="text-neutral-900 text-lg mb-8 fw-medium"
                    >
                      Email address <span className="text-danger">*</span>{" "}
                    </label>
                    <input
                      className="common-input"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      required
                    />
                  </div>
                  <div className="mb-24">
                    <label
                      htmlFor="password"
                      className="text-neutral-900 text-lg mb-8 fw-medium"
                    >
                      Password <span className="text-danger">*</span>{" "}
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="common-input"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                      />
                      <span
                        className={`toggle-password position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y cursor-pointer ph ${showPassword ?"ph-eye" : "ph-eye-slash"}`}
                        id="#password"
                        onClick={togglePasswordVisibility}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </div>
                  <div className="mb-24 mt-48">
                    <div className="flex-align gap-48 flex-wrap">
                      <button
                        type="submit"
                        className="btn btn-main py-18 px-40"
                      >
                        Log in
                      </button>
                      <div className="form-check common-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          defaultValue=""
                          id="remember"
                        />
                        <label
                          className="form-check-label flex-grow-1"
                          htmlFor="remember"
                        >
                          Remember me
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="mt-48">
                    <Link
                      to="#"
                      className="text-danger-600 text-sm fw-semibold hover-text-decoration-underline"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                </div>
              </form>
            </div>
            {/* Login Card End */}
            {/* Register Card Start */}
            <div className="col-xl-6">
              <SignUp />
            </div>
            {/* Register Card End */}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Account;
