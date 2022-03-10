import { AppContext } from '@/AppContext.js';
import { NavigationBar } from '@/components/Navigation/NavigationBar.jsx';
import { Notifications } from '@/components/Notifications/Notifications.jsx';
import { ProtectedRoute } from '@/components/ProtectedRoute/ProtectedRoute.jsx';
import { Home } from '@/pages/Home/Home.jsx';
import { Archives } from '@/pages/Archives/Archives.jsx';
import { EditManifests } from '@/pages/EditManifests/EditManifests.jsx';
import { Search } from '@/pages/Search/Search.jsx';
import { ArchiveSteps } from '@/pages/ArchiveDetail/ArchiveSteps.jsx';
import { CollectionDetails } from '@/pages/CollectionDetailsPage/CollectionDetails.jsx';
import { Login } from '@/pages/Login/Login.jsx';
import { LoginCallback } from '@/components/AuthenticationService/LoginCallback.jsx';
import { Logout } from '@/components/AuthenticationService/Logout.jsx';
import { RecordDetail } from '@/pages/Detail/RecordDetail.jsx';
import { SIPDetailPage } from '@/pages/Detail/SIPDetailPage.jsx';
import { Settings } from '@/pages/Settings/Settings.jsx';
import { StagedRecords } from '@/pages/StagedRecords/StagedRecords.jsx';
import Harvest from '@/pages/Harvest/Harvest.jsx';
import { UserDetail } from '@/pages/Detail/UserDetail.jsx';
import { Actions } from '@/pages/Actions/Actions.jsx';
import { AddResource } from '@/pages/AddResource/AddResource.jsx';
import { Upload } from '@/pages/Upload/Upload.jsx';
import { Collections } from '@/pages/Collections/Collections.jsx';
import React from 'react';
import { Container } from 'semantic-ui-react';
import { Route, Switch } from 'react-router-dom';

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
              <ProtectedRoute path="/search/" component={Search} />
              <ProtectedRoute path="/archive/:id" component={ArchiveSteps} />
              <ProtectedRoute
                path="/edit-archive/:id"
                component={EditManifests}
              />
              <ProtectedRoute
                path="/collection/:id"
                component={CollectionDetails}
              />
              <ProtectedRoute path="/records/:id" component={RecordDetail} />
              <ProtectedRoute path="/details/:id" component={SIPDetailPage} />
              <ProtectedRoute path="/users/:id" component={UserDetail} />
              <ProtectedRoute path="/upload" component={Upload} />
              <ProtectedRoute path="/staged" component={StagedRecords} />
              <ProtectedRoute path="/actions" component={Actions} />
              <ProtectedRoute path="/collections" component={Collections} />
              <ProtectedRoute path="/settings" component={Settings} />
              <Route path="/login/callback" component={LoginCallback} />
              <Route path="/logout" component={Logout} />
              <Route path="/login" component={Login} />
              <Route path="/">
                <Home />
              </Route>
            </Switch>
          </Container>
        </div>
      </AppContext.Context.Provider>
    );
  }
}
