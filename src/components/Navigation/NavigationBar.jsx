import { AppContext } from '@/AppContext.js';
import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'semantic-ui-react';

/**
 * Renders the Navigation Bar, keeping track of the active page and
 * showing some links only to authenticated users.
 */
export class NavigationBar extends React.Component {
  static contextType = AppContext.Context;

  constructor(props) {
    super(props);

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
          key: 'archives',
          value: 'Archives',
          to: '/archives',
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
          key: 'upload',
          value: 'Upload',
          to: '/upload',
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
    };
  }

  handleItemClick = (e, { name }) => {
    this.setState({ activeItem: name });
  };

  render() {
    const { isLoggedIn, user } = this.context;

    return (
      <Menu secondary>
        {this.state.links
          .filter((link) => link.always || link.loggedIn === isLoggedIn)
          .map((link) => (
            <Menu.Item
              key={link.key}
              as={Link}
              to={link.to}
              active={link.key == this.state.activeItem}
              onClick={this.handleItemClick}
              name={link.key}
            >
              {link.value}
            </Menu.Item>
          ))}
        {isLoggedIn && (
          <Menu.Menu position="right">
            <Menu.Item>
              Hello, <Link to={`/users/${user.id}`}>{user.username}</Link>
            </Menu.Item>
          </Menu.Menu>
        )}
      </Menu>
    );
  }
}
