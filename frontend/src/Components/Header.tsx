
import DanesListLogoLarge from "../assets/logos/DanesListLettersOnly.png";
import "../styles/Header.css";

export const Header = () => {
  return (
    <header className="dl-header">
      <div className="dl-brand">
        <img 
          src={DanesListLogoLarge} 
          className="dl-logo-img" 
          alt="DanesList Logo" 
        />
      </div>
    </header>
  );
};
