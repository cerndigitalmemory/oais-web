import { AppContext } from "@/AppContext.js";
import { NavigationBar } from "@/components/NavigationBar.jsx";
import { Notifications } from "@/components/Notifications.jsx";
import { ProtectedRoute } from "@/components/ProtectedRoute.jsx";
import { Archives } from "@/pages/Archives.jsx";
import { Login } from "@/pages/Login.jsx";
import { LoginCallback } from "@/pages/LoginCallback.jsx";
import { Logout } from "@/pages/Logout.jsx";
import { RecordDetail } from "@/pages/RecordDetail.jsx";
import { SIPDetailPage } from "@/pages/SIPDetailPage.jsx";
import { Search } from "@/pages/Search.jsx";
import  Harvest  from "@/pages/Harvest.jsx";
import { UserDetail } from "@/pages/UserDetail.jsx";
import { AddResource } from "@/pages/AddResource.jsx";
import { Upload } from "@/pages/Upload.jsx";
import React from "react";
import { Container } from "semantic-ui-react";
import { Route, Switch } from "react-router-dom";

export class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    AppContext.init(this.setState.bind(this));
  }

  render() {
    const { notifications } = this.state;
    return (
      <AppContext.Context.Provider value={this.state}>
        <div id="app">
          <NavigationBar />
          <Notifications notifications={notifications ?? []} />
          <Container className="mt-3">
            <Switch>
              <ProtectedRoute path="/search" component={Search} />
              <ProtectedRoute path="/harvest" component={Harvest} />
              <ProtectedRoute path="/add-resource" component={AddResource} />
              <ProtectedRoute path="/archives" component={Archives} />
              <ProtectedRoute path="/records/:id" component={RecordDetail} />
              <ProtectedRoute path="/details/:id" component={SIPDetailPage} />
              <ProtectedRoute path="/users/:id" component={UserDetail} />
              <ProtectedRoute path="/upload" component={Upload} />
              <Route path="/login/callback" component={LoginCallback} />
              <Route path="/logout" component={Logout} />
              <Route path="/login" component={Login} />
              <Route path="/">
                <div>Hello!</div>
              </Route>
            </Switch>
          </Container>
        </div>
      </AppContext.Context.Provider>
    );
  }
}
