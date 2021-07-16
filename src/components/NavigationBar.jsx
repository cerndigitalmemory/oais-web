import { AppContext } from "@/AppContext.js";
import React from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

export class NavigationBar extends React.Component {
  static contextType = AppContext;

  constructor(props) {
    super(props);

    this.state = {
      links: [
        {
          value: "Home",
          to: "/",
          always: true,
        },
        {
          value: "Search",
          to: "/search",
          always: false,
          loggedIn: true,
        },
        {
          value: "Archives",
          to: "/archives",
          always: false,
          loggedIn: true,
        },
        {
          value: "Logout",
          to: "/logout",
          always: false,
          loggedIn: true,
        },
        {
          value: "Login",
          to: "/login",
          always: false,
          loggedIn: false,
        },
      ],
    };
  }

  render() {
    const isLoggedIn = this.context.isLoggedIn();

    return (
      <Navbar bg="dark" variant="dark">
        <Container>
          <Nav>
            {this.state.links
              .filter((link) => link.always || link.loggedIn === isLoggedIn)
              .map((link) => (
                <Nav.Link as={Link} to={link.to} key={link.to}>
                  {link.value}
                </Nav.Link>
              ))}
          </Nav>
        </Container>
      </Navbar>
    );
  }
}
