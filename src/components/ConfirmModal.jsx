import React from "react";
import { Modal, Button } from "react-bootstrap";

const ConfirmModal = ({ show, title, message, onConfirm, onCancel }) => {
  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p style={{ fontSize: "16px", marginBottom: "10px" }}>{message}</p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Continue
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmModal;
