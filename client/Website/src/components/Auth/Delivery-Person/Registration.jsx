import React, { useState } from "react";
import { register } from "../../../services/auth/auth";
import { showToast } from "../../../helper/Toast";

const DeliveryPersonRegistration = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    vehicleType: "bike",
    vehicleNumber: "",
    licenseNumber: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const isValidEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !isValidEmail(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!formData.password || formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await register({
        ...formData,
        role: "delivery-person",
      });
      showToast(`Welcome aboard, ${formData.firstName}!`, "success");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <section className="contact py-80">
      <div className="container container-lg">
        <div className="row gy-5">
          <div className="col-lg-8 mx-auto">
            <div className="contact-box border border-gray-100 rounded-16 px-24 py-40">
              <form onSubmit={handleSubmit}>
                <h6 className="mb-32">Become a Delivery Person</h6>

                {error && <p className="text-danger">{error}</p>}

                <div className="row gy-4">
                  <div className="col-sm-6">
                    <label className="text-neutral-900 text-lg mb-8 fw-medium">
                      First Name <span className="text-danger">*</span>{" "}
                    </label>
                    <input
                      type="text"
                      className="common-input"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="First Name"
                      required
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="text-neutral-900 text-lg mb-8 fw-medium">
                      Last Name <span className="text-danger">*</span>{" "}
                    </label>
                    <input
                      type="text"
                      className="common-input"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Last Name"
                      required
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="text-neutral-900 text-lg mb-8 fw-medium">
                      Email Address{" "}
                      <span className="text-danger">
                        {" "}
                        <span className="text-danger">*</span>{" "}
                      </span>{" "}
                    </label>
                    <input
                      type="email"
                      className="common-input"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Email Address"
                      required
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="text-neutral-900 text-lg mb-8 fw-medium">
                      Phone Number <span className="text-danger">*</span>{" "}
                    </label>
                    <input
                      type="text"
                      className="common-input"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Phone Number"
                      required
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="text-neutral-900 text-lg mb-8 fw-medium">
                      Password <span className="text-danger">*</span>{" "}
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="common-input"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Password"
                        name="password"
                        required
                      />
                      <span
                        className={`toggle-password position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y cursor-pointer ph ${
                          showPassword ? "ph-eye" : "ph-eye-slash"
                        }`}
                        id="#password"
                        onClick={togglePasswordVisibility}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <label className="text-neutral-900 text-lg mb-8 fw-medium">
                      Confirm Password <span className="text-danger">*</span>{" "}
                    </label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="common-input"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm Password"
                        name="confirmPassword"
                        required
                      />
                      <span
                        className={`toggle-password position-absolute top-50 inset-inline-end-0 me-16 translate-middle-y cursor-pointer ph ${
                          showPassword ? "ph-eye" : "ph-eye-slash"
                        }`}
                        id="#password"
                        onClick={togglePasswordVisibility}
                        style={{ cursor: "pointer" }}
                      />
                    </div>
                  </div>

                  <div className="col-sm-6">
                    <label className="text-neutral-900 text-lg mb-8 fw-medium">
                      Vehicle Type <span className="text-danger">*</span>{" "}
                    </label>
                    <select
                      className="common-input border border-gray-100 rounded-4 px-16"
                      name="vehicleType"
                      value={formData.vehicleType}
                      onChange={handleChange}
                      required
                    >
                      <option value="bike">Bike</option>
                      <option value="three-wheeler">Three-Wheeler</option>
                    </select>
                  </div>

                  <div className="col-sm-6">
                    <label className="text-neutral-900 text-lg mb-8 fw-medium">
                      Vehicle Number <span className="text-danger">*</span>{" "}
                    </label>
                    <input
                      type="text"
                      className="common-input"
                      name="vehicleNumber"
                      value={formData.vehicleNumber}
                      onChange={handleChange}
                      placeholder="Vehicle Number"
                      required
                    />
                  </div>

                  <div className="col-sm-6">
                    <label className="text-neutral-900 text-lg mb-8 fw-medium">
                      License Number <span className="text-danger">*</span>{" "}
                    </label>
                    <input
                      type="text"
                      className="common-input"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleChange}
                      placeholder="License Number"
                      required
                    />
                  </div>

                  <div className="col-sm-12 mt-32">
                    <button
                      type="submit"
                      className="btn btn-main py-18 px-32 rounded-8"
                    >
                      Register
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliveryPersonRegistration;
