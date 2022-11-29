import { AppContext } from '@/AppContext.js'
import { createMedia } from '@artsy/fresnel'
import PropTypes, { object } from 'prop-types'
import { userType, notificationType } from '@/types.js'
import { Link } from 'react-router-dom'
import { Menu, Icon, Sidebar, Segment, Loader, Label } from 'semantic-ui-react'
import { Notifications } from '@/components/Notifications/Notifications.jsx'
import { ProtectedRoute } from '@/components/ProtectedRoute/ProtectedRoute.jsx'
import { Home } from '@/pages/Home/Home.jsx'
import { Archives } from '@/pages/Archives/Archives.jsx'
import { EditManifests } from '@/pages/EditManifests/EditManifests.jsx'
import { ArchiveSteps } from '@/pages/ArchiveDetail/ArchiveSteps.jsx'
import { CollectionDetails } from '@/pages/CollectionDetailsPage/CollectionDetails.jsx'
import { Login } from '@/pages/Login/Login.jsx'
import { LoginCallback } from '@/components/AuthenticationService/LoginCallback.jsx'
import { Logout } from '@/components/AuthenticationService/Logout.jsx'
import { RecordDetail } from '@/pages/Detail/RecordDetail.jsx'
import { SIPDetailPage } from '@/pages/Detail/SIPDetailPage.jsx'
import { Settings } from '@/pages/Settings/Settings.jsx'
import { StagedRecords } from '@/pages/StagedRecords/StagedRecords.jsx'
import Harvest from '@/pages/Harvest/Harvest.jsx'
import { UserDetail } from '@/pages/Detail/UserDetail.jsx'
import { Actions } from '@/pages/Actions/Actions.jsx'
import { AddResource } from '@/pages/AddResource/AddResource.jsx'
import { UploadSIP } from '@/pages/Upload/UploadSIP.jsx'
import { UploadFolder } from '@/pages/Upload/UploadFolder.jsx'
import { Collections } from '@/pages/Collections/Collections.jsx'
import React from 'react'
import { Container } from 'semantic-ui-react'
import { Route, Switch } from 'react-router-dom'
import { Jobs } from '@/pages/Jobs/Jobs.jsx'
import { JobDetails } from '@/pages/JobDetailsPage/JobDetails.jsx'
import { Footer } from '@/components/Footer/Footer.jsx'

import { api } from '@/api.js'

/**
 * Renders the Navigation Bar, keeping track of the active page and
 * showing some links only to authenticated users.
 */

const AppMedia = createMedia({
  breakpoints: {
    mobile: 320,
    tablet: 768,
    computer: 992,
    largeScreen: 1200,
    widescreen: 1920,
  },
})

const mediaStyles = AppMedia.createMediaStyle()
const { Media, MediaContextProvider } = AppMedia

export class NavigationBar extends React.Component {
  static contextType = AppContext.Context
  static propTypes = {
    notifications: PropTypes.arrayOf(notificationType),
  }

  constructor(props) {
    super(props)

    this.state = {
      activeItem: window.location.pathname,
      visible: false, //handles the rendering of the sidebar in the mobile
      links: [
        {
          key: 'home',
          value: 'Home',
          to: '/',
          always: true,
        },
        {
          key: 'add-resource',
          value: 'Add Resource',
          to: '/harvest',
          always: false,
          loggedIn: true,
        },
        {
          key: 'staged',
          value: 'Staged Records',
          to: '/staged',
          always: false,
          loggedIn: true,
        },
        {
          key: 'archives',
          value: 'Archives',
          to: '/archives',
          always: false,
          loggedIn: true,
        },
        {
          key: 'jobs',
          value: 'Jobs',
          to: '/jobs',
          always: false,
          loggedIn: true,
        },
        {
          key: 'collections',
          value: 'Tags',
          to: '/collections',
          always: false,
          loggedIn: true,
        },
        {
          key: 'login',
          value: 'Login',
          to: '/login',
          always: false,
          loggedIn: false,
        },
      ],
    }
  }

  handleItemClick = (e, { name, to }) => {
    this.setState({ activeItem: to })
    if (this.state.visible) {
      this.handleToggle()
    }
  }

  componentDidUpdate() {
    // Handle browser back button
    window.onpopstate = (e) => {
      this.setState({ activeItem: window.location.pathname })
    }
  }

  handleToggle = () => this.setState({ visible: !this.state.visible })

  render() {
    const { isLoggedIn, user } = this.context
    const { links, activeItem, visible } = this.state

    // When the user is logged out there was a blank page, now a loggedOut navbar is displayed
    let showNavbar = (
      <NavBarLoggedOut
        leftItems={links}
        activeItem={activeItem}
        notifications={this.props.notifications}
      ></NavBarLoggedOut>
    )
    if (user && isLoggedIn) {
      showNavbar = (
        <NavBar
          leftItems={links}
          isLoggedIn={isLoggedIn}
          user={user}
          activeItem={activeItem}
          notifications={this.props.notifications}
          onToggle={this.handleToggle}
          onItemClick={this.handleItemClick}
          visible={visible}
        ></NavBar>
      )
    }
    if (!isLoggedIn) {
      showNavbar = (
        <NavBarLoggedOut
          leftItems={links}
          activeItem={activeItem}
          notifications={this.props.notifications}
          onItemClick={this.handleItemClick}
        ></NavBarLoggedOut>
      )
    }

    return (
      <>
        <style>{mediaStyles}</style>

        <MediaContextProvider>{showNavbar}</MediaContextProvider>
      </>
    )
  }
}

class NavBar extends React.Component {
  static propTypes = {
    leftItems: PropTypes.arrayOf(object).isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    user: userType.isRequired,
    activeItem: PropTypes.string,
    notifications: PropTypes.arrayOf(notificationType),
    onToggle: PropTypes.func,
    onItemClick: PropTypes.func,
    visible: PropTypes.bool.isRequired,
  }
  constructor(props) {
    super(props)
  }

  handlePusher = () => {
    if (this.props.visible) {
      this.props.onToggle()
    }
  }

  render() {
    const {
      leftItems,
      isLoggedIn,
      user,
      activeItem,
      notifications,
      visible,
      onItemClick,
    } = this.props

    return (
      <div>
        <Media at="mobile">
          <NavBarMobile
            leftItems={leftItems}
            onPusherClick={this.handlePusher}
            onToggle={this.props.onToggle}
            visible={visible}
            isLoggedIn={isLoggedIn}
            user={user}
            activeItem={activeItem}
            notifications={notifications}
            onItemClick={onItemClick}
          ></NavBarMobile>
        </Media>
        <Media at="tablet">
          <NavBarDesktop
            leftItems={leftItems}
            isLoggedIn={isLoggedIn}
            user={user}
            activeItem={activeItem}
            onItemClick={onItemClick}
          />
          <NavBarChildren notifications={notifications} size={'tablet'} />
        </Media>
        <Media greaterThan="tablet">
          <NavBarDesktop
            leftItems={leftItems}
            isLoggedIn={isLoggedIn}
            user={user}
            activeItem={activeItem}
            onItemClick={onItemClick}
          />
          <NavBarChildren notifications={notifications} size={'computer'} />
        </Media>
      </div>
    )
  }
}

class NavBarMobile extends React.Component {
  static propTypes = {
    leftItems: PropTypes.array.isRequired,
    onPusherClick: PropTypes.func,
    onToggle: PropTypes.func,
    visible: PropTypes.bool.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    user: userType.isRequired,
    activeItem: PropTypes.string,
    notifications: PropTypes.arrayOf(notificationType),
    onItemClick: PropTypes.func,
  }
  static contextType = AppContext.Context
  constructor(props) {
    super(props)
  }

  render() {
    const {
      leftItems,
      onPusherClick,
      onToggle,
      visible,
      isLoggedIn,
      user,
      activeItem,
      notifications,
      onItemClick,
    } = this.props
    const { staged } = this.context

    return (
      <Sidebar.Pushable style={{ minHeight: '100%' }}>
        <Sidebar
          as={Menu}
          animation="overlay"
          icon="labeled"
          inverted
          vertical
          visible={visible}
          width={'wide'}
          style={{ position: 'absolute' }}
        >
          {leftItems
            .filter((link) => link.always || link.loggedIn === isLoggedIn)
            .map((link) =>
              link.key !== 'staged' ? (
                <Menu.Item
                  key={link.key}
                  as={Link}
                  active={link.to == activeItem}
                  to={link.to}
                  onClick={onItemClick}
                  name={link.key}
                >
                  {link.value}
                </Menu.Item>
              ) : (
                staged > 0 && (
                  <Menu.Item
                    key={link.key}
                    as={Link}
                    active={link.to == activeItem}
                    to={link.to}
                    onClick={onItemClick}
                    name={link.key}
                  >
                    <>
                      {link.value}
                      <Label color="red">{staged}</Label>
                    </>
                  </Menu.Item>
                )
              )
            )}
        </Sidebar>
        <Sidebar.Pusher onClick={onPusherClick} style={{ minHeight: '100vh' }}>
          <Menu secondary>
            <Menu.Item onClick={onToggle}>
              <Icon name="sidebar" />
            </Menu.Item>
            {isLoggedIn && (
              <Menu.Menu position="right">
                <Menu.Item>
                  Hello,&nbsp;{' '}
                  <Link to={`/users/${user.id}`}>{user.username}</Link>(
                  <Link to={`/logout`}>Logout</Link>)
                </Menu.Item>
                <Menu.Item
                  as={Link}
                  onClick={onItemClick}
                  active={'/settings' == activeItem}
                  to="/settings"
                >
                  <Icon name="settings" />
                </Menu.Item>
              </Menu.Menu>
            )}
          </Menu>
          <NavBarChildren notifications={notifications} />
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    )
  }
}

class NavBarDesktop extends React.Component {
  static propTypes = {
    leftItems: PropTypes.array.isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
    user: userType,
    activeItem: PropTypes.string,
    onItemClick: PropTypes.func,
  }
  static contextType = AppContext.Context

  constructor(props) {
    super(props)
  }

  render() {
    const { leftItems, isLoggedIn, user, activeItem, onItemClick } = this.props
    const { staged } = this.context

    return (
      <div className="navbar" style={{ padding: '10px' }}>
        <Menu secondary>
          {leftItems
            .filter((link) => link.always || link.loggedIn === isLoggedIn)
            .map((link) =>
              link.key !== 'staged' ? (
                <Menu.Item
                  key={link.key}
                  as={Link}
                  active={link.to == activeItem}
                  to={link.to}
                  onClick={onItemClick}
                  name={link.key}
                >
                  {link.value}
                </Menu.Item>
              ) : (
                staged > 0 && (
                  <Menu.Item
                    key={link.key}
                    as={Link}
                    active={link.to == activeItem}
                    to={link.to}
                    onClick={onItemClick}
                    name={link.key}
                  >
                    <>
                      {link.value}
                      <Label size="mini" circular color="red">
                        {staged}
                      </Label>
                    </>
                  </Menu.Item>
                )
              )
            )}

          {isLoggedIn && (
            <Menu.Menu position="right">
              <Menu.Item>
                <Icon name="user"></Icon> {user.username}
              </Menu.Item>
              <Menu.Item as={Link} onClick={onItemClick} to="/logout">
                <Icon name="sign out" />
              </Menu.Item>
              <Menu.Item
                as={Link}
                onClick={onItemClick}
                active={'/settings' == activeItem}
                to="/settings"
              >
                <Icon name="settings" />
              </Menu.Item>
            </Menu.Menu>
          )}
        </Menu>
      </div>
    )
  }
}

class NavBarChildren extends React.Component {
  static propTypes = {
    notifications: PropTypes.arrayOf(notificationType),
    size: PropTypes.string.isRequired, // used to specify the width styling of the segment
  }
  constructor(props) {
    super(props)
  }

  render() {
    const { notifications, size } = this.props

    let width = 'fit-content(0em)'
    if (size == 'tablet') {
      width = '95vw'
    }

    return (
      <React.Fragment>
        <Notifications notifications={notifications ?? []} />
        <Container
          style={{
            paddingTop: '25px',
            paddingBottom: '100px',
            minHeight: '93vh',
            z_index: 'auto',
            width: width,
          }}
        >
          <Switch>
            <ProtectedRoute path="/harvest" component={Harvest} />
            <ProtectedRoute path="/add-resource" component={AddResource} />
            <ProtectedRoute path="/archives" component={Archives} />
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
            <ProtectedRoute path="/upload/sip" component={UploadSIP} />
            <ProtectedRoute path="/upload/folder" component={UploadFolder} />
            <ProtectedRoute path="/staged" component={StagedRecords} />
            <ProtectedRoute path="/actions" component={Actions} />
            <ProtectedRoute path="/collections" component={Collections} />
            <ProtectedRoute path="/settings" component={Settings} />
            <ProtectedRoute path="/jobs" component={Jobs} />
            <ProtectedRoute path="/job/:id" component={JobDetails} />
            <Route path="/login/callback" component={LoginCallback} />
            <Route path="/logout" component={Logout} />
            <Route path="/login" component={Login} />
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </Container>
        <Footer />
      </React.Fragment>
    )
  }
}

class NavBarLoggedOut extends React.Component {
  static propTypes = {
    leftItems: PropTypes.arrayOf(object).isRequired,
    activeItem: PropTypes.string,
    notifications: PropTypes.arrayOf(notificationType),
    onItemClick: PropTypes.func,
  }
  constructor(props) {
    super(props)
  }

  render() {
    const { leftItems, activeItem, notifications, onItemClick } = this.props
    /* TODO: Return a different kind of navbar depending on the media query (as with the logged in one) */
    return (
      <div>
        <NavBarDesktop
          leftItems={leftItems}
          activeItem={activeItem}
          isLoggedIn={false}
          onItemClick={onItemClick}
        />
        <NavBarChildren notifications={notifications} size={'computer'} />
      </div>
    )
  }
}
