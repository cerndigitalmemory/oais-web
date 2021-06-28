import React from "react";
import { Redirect } from "react-router";
import { api } from "../api.js";
import { AppContext } from "./AppContext.js";

export class Login extends React.Component {
  static contextType = AppContext;

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

  handleSubmit = (event) => {
    event.preventDefault();
    api
      .login(this.state.username, this.state.password)
      .then(({ token }) => this.context.setToken(token));
  };

  render() {
    if (this.context.isLoggedIn()) {
      const params = new URLSearchParams(this.props.location.search);
      const redirectURL = params.get("redirect") ?? "/";
      return <Redirect to={redirectURL} />;
    }

    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={this.state.username}
            onChange={this.handleUsernameChange}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={this.state.password}
            onChange={this.handlePasswordChange}
          />
        </label>
        <input type="submit" value="Login" />
      </form>
    );
  }
}
