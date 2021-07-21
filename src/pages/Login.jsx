import { api } from "@/api.js";
import { AppContext } from "@/AppContext.js";
import { sendNotification } from "@/utils.js";
import PropTypes from "prop-types";
import React from "react";
import { Button, Form } from "react-bootstrap";
import { Redirect } from "react-router";

export class Login extends React.Component {
  static propTypes = {
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
  };
  static contextType = AppContext.Context;

  constructor(props) {
    super(props);

    this.state = {
      username: "",
      password: "",
    };
  }

  handleUsernameChange = (event) => {
    this.setState({ username: event.target.value });
  };

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  };

  handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const user = await api.login(this.state.username, this.state.password);
      AppContext.setUser(user);
    } catch (e) {
      sendNotification("Error while logging in", e.message);
    }
  };

  render() {
    const { isLoggedIn } = this.context;

    if (isLoggedIn) {
      const params = new URLSearchParams(this.props.location.search);
      const redirectURL = params.get("redirect") ?? "/";
      return <Redirect to={redirectURL} />;
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Group className="mb-3" controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={this.state.username}
            onChange={this.handleUsernameChange}
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
          />
        </Form.Group>
        <Button type="submit">Login</Button>
      </Form>
    );
  }
}
