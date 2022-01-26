import { AppContext } from '@/AppContext.js';
import PropTypes from 'prop-types';
import React from 'react';
import { Redirect, Route } from 'react-router';

/**
 * When trying to access a protected route while unauthenticated, makes the user
 * authenticate and redirects them to the requested page after the login.
 */
export class ProtectedRoute extends React.Component {
  static propTypes = {
    component: PropTypes.elementType,
    render: PropTypes.func,
    children: PropTypes.node,
  };

  static contextType = AppContext.Context;

  render() {
    const { isLoggedIn } = this.context;
    const { component, render, children, ...rest } = this.props;
    return (
      <Route
        {...rest}
        render={(routeProps) => {
          if (!isLoggedIn) {
            // Pass the current URL as a query parameter.
            // After the login, the user will be redirected to the current page.
            const { location } = routeProps;
            const redirect = new URLSearchParams({
              redirect: location.pathname + location.search,
            });

            return (
              <Redirect
                to={{
                  pathname: '/login',
                  search: '?' + redirect.toString(),
                }}
              />
            );
          }

          if (component) {
            const Component = component;
            return <Component {...routeProps} />;
          } else if (render) {
            return render(routeProps);
          } else {
            return children;
          }
        }}
      />
    );
  }
}
