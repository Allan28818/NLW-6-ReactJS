import { ReactNode } from "react";
import Modal from "react-modal";

import "./styles.scss";

type DeleteModalProps = {
  children: ReactNode;
  isOpen: boolean;
}

const style = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.9)'
  },
  content: {
    width: "590px",
    height: "362px",
    margin: "auto",
    padding: "64px",
  }
}

export function ModalComponent({ children, isOpen }: DeleteModalProps) {

  return (
    <>
      <Modal
        isOpen={isOpen}
        style={style}
      >
        {children}
      </Modal>
    </>
  )
}