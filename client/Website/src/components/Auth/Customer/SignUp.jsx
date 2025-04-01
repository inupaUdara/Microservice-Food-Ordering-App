import React, { useState } from "react";
import { register } from "../../../services/auth/auth";
import { showToast } from "../../../helper/Toast";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes("address.")) {
      const field = name.split(".")[1]; // Extract "street", "city", etc.
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value, // Update specific address field
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
      setError("Passwords do not match");
      return;
    }

    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        address: {
          street: formData.address.street,
          city: formData.address.city,
          state: formData.address.state,
          zipCode: formData.address.zipCode,
          country: formData.address.country,
        },
        role: "customer",
      });
      showToast(`Welcome aboard, ${formData.firstName}!`, "success");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="border border-gray-100 hover-border-main-600 transition-1 rounded-16 px-24 py-40">
        <h6 className="text-xl mb-32">Register</h6>

        <div className="mb-24">
          <label
            htmlFor="usernameTwo"
            className="text-neutral-900 text-lg mb-8 fw-medium"
          >
            Firstname <span className="text-danger">*</span>{" "}
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="common-input"
            id="firstname"
            placeholder="Write a Firstname"
            required
          />
        </div>
        <div className="mb-24">
          <label
            htmlFor="usernameTwo"
            className="text-neutral-900 text-lg mb-8 fw-medium"
          >
            Lastname <span className="text-danger">*</span>{" "}
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="common-input"
            id="lastName"
            placeholder="Write a Lastname"
            required
          />
        </div>
        <div className="mb-24">
          <label
            htmlFor="emailTwo"
            className="text-neutral-900 text-lg mb-8 fw-medium"
          >
            Email address <span className="text-danger">*</span>{" "}
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="common-input"
            id="emailTwo"
            placeholder="Enter Email Address"
            required
          />
        </div>
        <div className="mb-24">
          <label
            htmlFor="enter-password"
            className="text-neutral-900 text-lg mb-8 fw-medium"
          >
            Password <span className="text-danger">*</span>
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
        <div className="mb-24">
          <label
            htmlFor="enter-password"
            className="text-neutral-900 text-lg mb-8 fw-medium"
          >
            Confirm Password <span className="text-danger">*</span>
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
        <div className="mb-24">
          <label
            htmlFor="phone"
            className="text-neutral-900 text-lg mb-8 fw-medium"
          >
            Phone <span className="text-danger">*</span>{" "}
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="common-input"
            id="phone"
            placeholder="Enter Phone Number"
            required
          />
        </div>
        <div className="mb-24">
          <label
            htmlFor="address"
            className="text-neutral-900 text-lg mb-8 fw-medium"
          >
            Street Address <span className="text-danger">*</span>{" "}
          </label>
          <input
            type="text"
            name="address.street"
            value={formData.address.street}
            onChange={handleChange}
            className="common-input"
            id="address.street"
            placeholder="Enter Street Address"
            required
          />
        </div>
        <div className="mb-24">
          <label
            htmlFor="city"
            className="text-neutral-900 text-lg mb-8 fw-medium"
          >
            City <span className="text-danger">*</span>{" "}
          </label>
          <input
            type="text"
            name="address.city"
            value={formData.address.city}
            onChange={handleChange}
            className="common-input"
            id="city"
            placeholder="Enter City"
            required
          />
        </div>
        <div className="mb-24">
          <label
            htmlFor="state"
            className="text-neutral-900 text-lg mb-8 fw-medium"
          >
            State <span className="text-danger">*</span>{" "}
          </label>
          <input
            type="text"
            name="address.state"
            value={formData.address.state}
            onChange={handleChange}
            className="common-input"
            id="state"
            placeholder="Enter State"
            required
          />
        </div>
        <div className="mb-24">
          <label
            htmlFor="zipCode"
            className="text-neutral-900 text-lg mb-8 fw-medium"
          >
            Zip Code <span className="text-danger">*</span>{" "}
          </label>
          <input
            type="text"
            name="address.zipCode"
            value={formData.address.zipCode}
            onChange={handleChange}
            className="common-input"
            id="zipCode"
            placeholder="Enter Zip Code"
            required
          />
        </div>
        <div className="mb-24">
          <label
            htmlFor="country"
            className="text-neutral-900 text-lg mb-8 fw-medium"
          >
            Country <span className="text-danger">*</span>{" "}
          </label>
          <input
            type="text"
            name="address.country"
            value={formData.address.country}
            onChange={handleChange}
            className="common-input"
            id="country"
            placeholder="Enter Country"
            required
          />
        </div>
        <div className="my-30">
          <p className="text-gray-500">
            Your personal data will be used to process your order, support your
            experience throughout this website. .
          </p>
        </div>
        {error && <p className="text-danger">{error}</p>}
        <div className="mt-30">
          <button type="submit" className="btn btn-main py-18 px-40">
            Register
          </button>
        </div>
      </div>
    </form>
  );
};

export default SignUp;
