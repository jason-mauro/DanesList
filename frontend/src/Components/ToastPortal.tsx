import React from "react";
import ReactDOM from "react-dom";
import { Toast } from "./Toast";

type PortalProps = {
  toast: { message: string; type: "success" | "error" } | null;
  onClose: () => void;
};

export const ToastPortal: React.FC<PortalProps> = ({ toast, onClose }) => {
  const root = document.getElementById("toast-root");
  if (!root || !toast) return null;

  return ReactDOM.createPortal(
    <div className="toast-portal-container">
      <Toast message={toast.message} type={toast.type} onClose={onClose} />
    </div>,
    root
  );
};