import React from "react";
import { Route, Switch } from "react-router-dom";
import { getToken, removeToken, setToken } from "../storage.js";
import { AppContext } from "./AppContext.js";
import { Archives } from "./Archives.jsx";
import { Login } from "./Login.jsx";
import { Logout } from "./Logout.jsx";
import { Navbar } from "./Navbar.jsx";
import { ProtectedRoute } from "./ProtectedRoute.jsx";
import { Search } from "./Search.jsx";

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: getToken(),
      isLoggedIn: () => this.state.token !== null,

      setToken: (token) => {
        setToken(token);
        this.setState({
          token: token,
        });
      },
      removeToken: () => {
        removeToken();
        this.setState({
          token: null,
        });
      },
    };
  }

  render() {
    return (
      <AppContext.Provider value={this.state}>
        <div id="app">
          <Navbar />
          <div id="content">
            <Switch>
              <ProtectedRoute path="/search" component={Search} />
              <ProtectedRoute path="/archives" component={Archives} />
              <Route path="/logout" component={Logout} />
              <Route path="/login" component={Login} />
              <Route path="/">
                <div>Hello!</div>
              </Route>
            </Switch>
          </div>
        </div>
      </AppContext.Provider>
    );
  }
}
