import { AppContext } from "@/AppContext.js";
import { NavigationBar } from "@/components/Navigation/NavigationBar.jsx";
import { Notifications } from "@/components/Notifications/Notifications.jsx";
import { ProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute.jsx";
import { Archives } from "@/pages/Archives/Archives.jsx";
import { ArchiveSteps } from "@/pages/ArchiveDetail/ArchiveSteps.jsx";
import { Login } from "@/pages/Login/Login.jsx";
import { LoginCallback } from "@/components/AuthenticationService/LoginCallback.jsx";
import { Logout } from "@/components/AuthenticationService/Logout.jsx";
import { RecordDetail } from "@/pages/Detail/RecordDetail.jsx";
import { SIPDetailPage } from "@/pages/Detail/SIPDetailPage.jsx";
import  Harvest  from "@/pages/Harvest/Harvest.jsx";
import { UserDetail } from "@/pages/Detail/UserDetail.jsx";
import { AddResource } from "@/pages/AddResource/AddResource.jsx";
import { Upload } from "@/pages/Upload/Upload.jsx";
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
          <Container>
            <Switch>
              <ProtectedRoute path="/harvest" component={Harvest} />
              <ProtectedRoute path="/add-resource" component={AddResource} />
              <ProtectedRoute path="/archives" component={Archives} />
              <ProtectedRoute path="/archive/:id" component={ArchiveSteps} />
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
