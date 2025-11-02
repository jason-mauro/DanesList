import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import "../styles/Login.css";
import DanesListLogo from "../assets/logos/DaneListLargeLogo.png";

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
    <div className="d-flex flex-column bg-transparent">
    
    <div className=" border rounded-4 shadow p-5" style={{ minWidth: "450px", background:"#F5F5F4" }}>
    <div className="d-flex flex-column items-center justify-center bg-transparent mb-4">
        <svg
      width="450"
      height="160"
      xmlns="http://www.w3.org/2000/svg"
      style={{ background: 'transparent' }}
    >
            {/* Define the wider curve path */}
            <path
              id="curve"
              d="M 10 120 Q 225 10 440 120"
              stroke="transparent"
              fill="transparent"
            />

            {/* Text following the curve */}
            <text fontSize="50" fill="#1A1A1A" fontWeight="600">
              <textPath href="#curve" startOffset="50%" textAnchor="middle">
                Welcome to
              </textPath>
            </text>
          </svg>
          <img
            src={DanesListLogo}
            alt="DanesListLogo"
            style={{ marginTop:"-67px", height: "100px", display: "block", marginLeft:"20px" }}
          />
          
        </div>
      <form
        noValidate
        className={validated ? "was-validated" : ""}
        onSubmit={handleSubmit}
      >
        <div className="form-floating mb-4" >
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
            onClick={handleHidePassword}
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
  );
};

export default LoginScreen;
