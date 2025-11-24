import React from "react";
import DanesListLettersOnly from "../assets/logos/DanesListLettersOnly.png";
import "../styles/Header.css";

export const Header: React.FC<{ onToggleSidebar?: () => void }> = ({ onToggleSidebar }) => {
  return (
    <header className="dl-header">
      <div className="dl-brand" onClick={onToggleSidebar}>
        <img 
          src={DanesListLettersOnly} 
          className="dl-logo-img" 
          alt="DanesList Logo" 
        />
      </div>
    </header>
  );
};

