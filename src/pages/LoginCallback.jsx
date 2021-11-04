import { api } from "@/api.js";
import { AppContext } from "@/AppContext.js";
import { sendNotification } from "@/utils.js";
import React from "react";
import { Loader } from 'semantic-ui-react';
import { Redirect } from "react-router";

/**
 * Component used to handle the login with CERN credentials.
 *
 * This component is rendered after a successful login and is used to fetch
 * the user information, so that the application knows that the user is now
 * logged in.
 */
export class LoginCallback extends React.Component {
  static contextType = AppContext.Context;

  state = { isLoading: true };

  async componentDidMount() {
    const { isLoggedIn } = this.context;
    if (!isLoggedIn) {
      try {
        const user = await api.me();
        AppContext.setUser(user);
      } catch (e) {
        sendNotification(
          "Error while logging in using CERN credentials",
          e.message
        );
      } finally {
        this.setState({ isLoading: false });
      }
    }
  }

  render() {
    const { isLoggedIn } = this.context;
    const { isLoading } = this.state;

    if (isLoading) {
      return (
        <div className="mt-5 text-center">
          <Loader active />
        </div>
      );
    } else if (isLoggedIn) {
      return <Redirect to="/" />;
    } else {
      return <Redirect to="/login" />;
    }
  }
}
