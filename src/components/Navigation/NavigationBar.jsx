import { AppContext } from '@/AppContext.js'
import { createMedia } from '@artsy/fresnel'
import PropTypes, { object } from 'prop-types'
import { userType, notificationType } from '@/types.js'
import { Link } from 'react-router-dom'
import { Menu, Icon, Sidebar, Segment, Loader } from 'semantic-ui-react'
import { Notifications } from '@/components/Notifications/Notifications.jsx'
import { ProtectedRoute } from '@/components/ProtectedRoute/ProtectedRoute.jsx'
import { Home } from '@/pages/Home/Home.jsx'
import { Archives } from '@/pages/Archives/Archives.jsx'
import { EditManifests } from '@/pages/EditManifests/EditManifests.jsx'
import { Search } from '@/pages/Search/Search.jsx'
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
import { Upload } from '@/pages/Upload/Upload.jsx'
import { Collections } from '@/pages/Collections/Collections.jsx'
import React from 'react'
import { Container } from 'semantic-ui-react'
import { Route, Switch } from 'react-router-dom'

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
          to: '/add-resource',
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
          key: 'actions',
          value: 'Actions',
          to: '/actions',
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
          key: 'search',
          value: 'Search',
          to: '/search',
          always: false,
          loggedIn: true,
        },
        {
          key: 'logout',
          value: 'Logout',
          to: '/logout',
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

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name })
  }

  render() {
    const { isLoggedIn, user } = this.context
    const { links, activeItem } = this.state
    // When the user is logged out there was a blank page, now a loggedOut navbar is displayed
    let showNavbar = 
        <NavBarLoggedOut
          leftItems={links}
          activeItem={activeItem}
          notifications={this.props.notifications}
        ></NavBarLoggedOut>
    if (user && isLoggedIn) {
      showNavbar = (
        <NavBar
          leftItems={links}
          isLoggedIn={isLoggedIn}
          user={user}
          activeItem={activeItem}
          notifications={this.props.notifications}
        ></NavBar>
      )
    }
    if (!isLoggedIn) {
      showNavbar = 
        <NavBarLoggedOut
          leftItems={links}
          activeItem={activeItem}
          notifications={this.props.notifications}
        ></NavBarLoggedOut>
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
  }
  state = {
    visible: false,
  }

  handlePusher = () => {
    const { visible } = this.state

    if (visible) this.setState({ visible: false })
  }

  handleToggle = () => this.setState({ visible: !this.state.visible })

  render() {
    const { leftItems, isLoggedIn, user, activeItem, notifications } = this.props
    const { visible } = this.state

    return (
      <div>
        <Media at="mobile">
          <NavBarMobile
            leftItems={leftItems}
            onPusherClick={this.handlePusher}
            onToggle={this.handleToggle}
            visible={visible}
            isLoggedIn={isLoggedIn}
            user={user}
            activeItem={activeItem}
            notifications={notifications}
          ></NavBarMobile>
        </Media>

        <Media greaterThan="mobile">
          <NavBarDesktop
            leftItems={leftItems}
            isLoggedIn={isLoggedIn}
            user={user}
            activeItem={activeItem}
          />
          <NavBarChildren notifications = {notifications}/>
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
  }
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
      notifications
    } = this.props

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
            .map((link) => (
              <Menu.Item
                key={link.key}
                as={Link}
                active={link.key == activeItem}
                to={link.to}
                onClick={this.handleItemClick}
                name={link.key}
              >
                {link.value}
              </Menu.Item>
            ))}
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
                  <Link to={`/users/${user.id}`}>{user.username}</Link>
                </Menu.Item>
                <Menu.Item as={Link} to="/settings">
                  <Icon name="settings" />
                </Menu.Item>
              </Menu.Menu>
            )}
          </Menu>
          <NavBarChildren notifications= {notifications}/>
          
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
  }
  constructor(props) {
    super(props)
  }

  render() {
    const { leftItems, isLoggedIn, user, activeItem } = this.props

    return (
      <Menu secondary>
        {leftItems
          .filter((link) => link.always || link.loggedIn === isLoggedIn)
          .map((link) => (
            <Menu.Item
              key={link.key}
              as={Link}
              active={link.key == activeItem}
              to={link.to}
              onClick={this.handleItemClick}
              name={link.key}
            >
              {link.value}
            </Menu.Item>
          ))}

        {isLoggedIn && (
          <Menu.Menu position="right">
            <Menu.Item>
              Hello,&nbsp; <Link to={`/users/${user.id}`}>{user.username}</Link>
            </Menu.Item>
            <Menu.Item as={Link} to="/settings">
              <Icon name="settings" />
            </Menu.Item>
          </Menu.Menu>
        )}
      </Menu>
    )
  }
}

class NavBarChildren extends React.Component {
  static propTypes = {
    notifications: PropTypes.arrayOf(notificationType),
  }
  constructor(props) {
    super(props)
  }

  render() {
    const { notifications } = this.props

    return (
      <React.Fragment>
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
      </React.Fragment>
    )
  }
}

class NavBarLoggedOut extends React.Component {
  static propTypes = {
    leftItems: PropTypes.arrayOf(object).isRequired,
    activeItem: PropTypes.string,
    notifications: PropTypes.arrayOf(notificationType),
  }


  render() {
    const { leftItems, activeItem, notifications } = this.props

    return (
      <div>

          <NavBarDesktop
            leftItems={leftItems}
            activeItem={activeItem}
            isLoggedIn={false}
          />
          <NavBarChildren notifications = {notifications}/>
      </div>
    )
  }
}
