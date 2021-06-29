import { AppContext } from "@/AppContext.js";
import React from "react";
import { Link } from "react-router-dom";

export class Navbar extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      links: [
        {
          value: "Search",
          to: "/search",
          loggedIn: true,
        },
        {
          value: "Archives",
          to: "/archives",
          loggedIn: true,
        },
        {
          value: "Logout",
          to: "/logout",
          loggedIn: true,
        },
        {
          value: "Login",
          to: "/login",
          loggedIn: false,
        },
      ],
    };
  }

  render() {
    return (
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {this.state.links.map((link, i) => {
          if (this.context.isLoggedIn() === link.loggedIn) {
            return (
              <li key={i}>
                <Link to={link.to}>{link.value}</Link>
              </li>
            );
          }
          return null;
        })}
      </ul>
    );
  }
}
