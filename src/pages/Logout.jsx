import { AppContext } from "@/AppContext.js";
import React from "react";
import { Redirect } from "react-router-dom";

export class Logout extends React.Component {
  static contextType = AppContext.Context;

  componentDidMount() {
    AppContext.logout();
  }

  render() {
    return <Redirect to="/" />;
  }
}
