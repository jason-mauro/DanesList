import React, { useEffect, useState } from "react";
import "../styles/Toast.css";

type ToastProps = {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
};

export const Toast: React.FC<ToastProps> = ({ message, type = "success", onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // let fade-in happen
    requestAnimationFrame(() => setShow(true));

    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 250); // allow fade-out to finish
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`toast ${type} ${show ? "show" : ""}`}>
      {message}
    </div>
  );
};