import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "../styles/Signup.css";

const SignupScreen = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState(true);
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleHidePassword = () => setHidePassword(!hidePassword);
  const handleHideConfirmPassword = () => setHideConfirmPassword(!hideConfirmPassword);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
    } else if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }else {
      console.log("Registering user:", formData);
    }
    setValidated(true);
  };

  return (
    <div className="border rounded-4 shadow p-5" style={{ minWidth: "450px", background: "#f5f5f4"}}>
    <div className="text-center mb-4">
        <h2 className="fw-bold" style={{ color: "#1A1A1A", fontSize: "40px" }}>
            Sign Up
        </h2>
        <p className="text" style={{ marginTop: "0px", fontSize: "25px" }}>
            Create your DanesList account
        </p>

        <form
          noValidate
          className={validated ? "was-validated" : ""}
          onSubmit={handleSubmit}
        >
          <div className="row">
            <div className="col-md-6 mb-3 form-floating">
              <input
                type="text"
                className="form-control"
                id="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <label htmlFor="firstName">First Name</label>
              <div className="invalid-feedback">Please enter your first name</div>
            </div>

            <div className="col-md-6 mb-3 form-floating">
              <input
                type="text"
                className="form-control"
                id="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
              <label htmlFor="lastName">Last Name</label>
              <div className="invalid-feedback">Please enter your last name</div>
            </div>
          </div>

          <div className="form-floating mb-3">
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">Email</label>
            <div className="invalid-feedback">Please enter a valid email</div>
          </div>

          <div className="form-floating mb-3">
            <input
              type="text"
              className="form-control"
              id="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <label htmlFor="username">Username</label>
            <div className="invalid-feedback">Please enter a username</div>
          </div>

          <div className="form-floating mb-4 position-relative">
            <input
              type={hidePassword ? "password" : "text"}
              className="form-control"
              id="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label htmlFor="password">Password</label>
            <div className="invalid-feedback">Please enter a password</div>

            <button
              type="button"
              className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent"
              onClick={handleHidePassword}
            >
              {hidePassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="form-floating mb-4 position-relative">
            <input
              type={hideConfirmPassword ? "password" : "text"}
              className="form-control"
              id="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="invalid-feedback">Please confirm password</div>
          
            <button
              type="button"
              className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent"
              onClick={handleHideConfirmPassword}
            >
              {hideConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" className="btn btn-dark w-100 py-2 mb-3 rounded-3">
            Create Account
          </button>
        </form>

        <div className="text-center mt-3">
          <small>Already have an account?</small>
          <br />
          <Link to="/" className="fw-semibold text-decoration-none">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupScreen;
