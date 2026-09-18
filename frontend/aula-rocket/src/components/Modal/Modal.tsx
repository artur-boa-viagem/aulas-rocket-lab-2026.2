import type { ReactNode } from "react";
import "./Modal.css";

interface ModalProps {
  opened: boolean;
  children: ReactNode;
  onClose: () => void;
}

export function Modal({ opened, children, onClose }: ModalProps) {
  if (!opened) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
