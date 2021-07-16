import { AppContext } from "@/AppContext.js";
import { NavigationBar } from "@/components/NavigationBar.jsx";
import { ProtectedRoute } from "@/components/ProtectedRoute.jsx";
import { Archives } from "@/pages/Archives.jsx";
import { Login } from "@/pages/Login.jsx";
import { Logout } from "@/pages/Logout.jsx";
import { RecordDetail } from "@/pages/RecordDetail.jsx";
import { Search } from "@/pages/Search.jsx";
import { UserDetail } from "@/pages/UserDetail.jsx";
import {
  getToken,
  getUser,
  removeToken,
  removeUser,
  setToken,
  setUser,
} from "@/storage.js";
import React from "react";
import { Container } from "react-bootstrap";
import { Route, Switch } from "react-router-dom";

export class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      token: getToken(),
      user: getUser(),

      isLoggedIn: () => this.state.token !== null,
      hasPermission: (permission) => {
        return this.state.user?.permissions.includes(permission) ?? false;
      },

      login: (token, user) => {
        setToken(token);
        setUser(user);
        this.setState({ token, user });
      },
      logout: () => {
        removeToken();
        removeUser();
        this.setState({
          token: null,
          user: null,
        });
      },
    };
  }

  render() {
    return (
      <AppContext.Provider value={this.state}>
        <div id="app">
          <NavigationBar />
          <Container className="mt-3">
            <Switch>
              <ProtectedRoute path="/search" component={Search} />
              <ProtectedRoute path="/archives" component={Archives} />
              <ProtectedRoute path="/records/:id" component={RecordDetail} />
              <ProtectedRoute path="/users/:id" component={UserDetail} />
              <Route path="/logout" component={Logout} />
              <Route path="/login" component={Login} />
              <Route path="/">
                <div>Hello!</div>
              </Route>
            </Switch>
          </Container>
        </div>
      </AppContext.Provider>
    );
  }
}
