import Modal, { ModalProps } from "../Modal";

export default function ShareModal(props: Omit<ModalProps, "initialFocus">) {
  return <Modal {...props}>hej hej</Modal>;
}
