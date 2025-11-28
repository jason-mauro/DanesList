import DanesListLettersLogo from "../assets/logos/DanesListLettersOnly.png";
import "../styles/Header.css";

export const Header = () => {
  return (
    <header className="dl-header">
      <img 
        src={DanesListLettersLogo}
        className="dl-logo-img"
        alt="DanesList Logo"
      />
    </header>
  );
};
