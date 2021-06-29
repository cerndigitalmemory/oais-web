import React from "react";
import { Redirect } from "react-router-dom";
import { AppContext } from "@/AppContext.js";

export class Logout extends React.Component {
  static contextType = AppContext;
  componentDidMount() {
    this.context.removeToken();
  }
  render() {
    return <Redirect to="/" />;
  }
}
