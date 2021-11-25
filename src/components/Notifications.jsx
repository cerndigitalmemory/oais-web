import { AppContext } from "@/AppContext";
import { notificationType } from "@/types.js";
import PropTypes from "prop-types";
import React from "react";
import { Container, Message } from "semantic-ui-react";

export class Notifications extends React.Component {
  static propTypes = {
    notifications: PropTypes.arrayOf(notificationType).isRequired,
  };

  handleClose(notification) {
    AppContext.removeNotification(notification);
  }

  render() {
    const { notifications } = this.props;
    return (
      <Container>
        {notifications.map((notification, i) => (
        <Message key={i} onDismiss={() => this.handleClose(notification)}>
          <Message.Header><strong>{notification.title}</strong></Message.Header>
          <p>
          {notification.body}
          </p>
        </Message>
        ))}
      </Container>
    );
  }
}
