import DanesListLogo from "../assets/logos/DaneListLargeLogo.png";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import '../styles/Login.css';

const LoginScreen = () => {
  const [hidePassword, setHidePassword] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validated, setValidated] = useState(false);

  const handleHidePassword = () => setHidePassword(!hidePassword);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      e.stopPropagation();
    } else {
      console.log("Logging in with:", { username, password });
    }
    setValidated(true);
  };

  return (
    <div className="vh-100 d-flex flex-column w-100 position-relative bg-light">
      {/* Logo */}
      <div className="position-absolute top-0 start-0 m-3">
        <img
          src={DanesListLogo}
          alt="DanesListLogo"
          style={{ height: "75px" }}
        />
      </div>

      <div className="d-flex justify-content-center align-items-center flex-grow-1">
        <div className="bg-white border rounded-4 shadow p-5 w-75 w-md-50 w-lg-60" style={{ maxWidth: "650px" }}>
          <h3 className="text-center mb-4 fw-semibold">Welcome to DanesList!</h3>

          <form
            noValidate
            className={validated ? "was-validated" : ""}
            onSubmit={handleSubmit}
          >
            <div className="form-floating mb-4">
              <input
                type="text"
                className="form-control"
                id="UserIDInput"
                placeholder="User ID"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <label htmlFor="UserIDInput">Email</label>
              <div className="invalid-feedback">Please enter your Email</div>
            </div>

            <div className="form-floating mb-4 position-relative">
              <input
                type={hidePassword ? "password" : "text"}
                className="form-control"
                id="PasswordInput"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label htmlFor="PasswordInput">Password</label>
              <div className="invalid-feedback">Please enter your password</div>

              <button
                type="button"
                className="btn btn-sm position-absolute top-50 end-0 translate-middle-y me-3 border-0 bg-transparent"
                onMouseDown={handleHidePassword}
                onMouseUp={handleHidePassword}
              >
                {hidePassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="submit"
              className="btn btn-dark w-100 py-2 mb-3 rounded-3"
            >
              Log In
            </button>
          </form>

          <div className="text-center mt-3">
            <small>Don't have an account?</small>
            <br />
            <Link to="/Signup" className="fw-semibold text-decoration-none">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
