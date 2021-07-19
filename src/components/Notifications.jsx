import { AppContext } from "@/AppContext";
import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";

export class Notifications extends React.Component {
  handleClose(notification) {
    AppContext.removeNotification(notification);
  }

  render() {
    const { notifications } = this.props;
    return (
      <ToastContainer className="notifications-container">
        {notifications.map((notification, i) => (
          <Toast key={i} onClose={() => this.handleClose(notification)}>
            <Toast.Header>
              <strong className="me-auto">{notification.title}</strong>
            </Toast.Header>
            <Toast.Body>{notification.body}</Toast.Body>
          </Toast>
        ))}
      </ToastContainer>
    );
  }
}