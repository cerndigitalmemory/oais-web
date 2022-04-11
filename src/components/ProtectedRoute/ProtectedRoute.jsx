import { AppContext } from '@/AppContext.js'
import PropTypes from 'prop-types'
import React from 'react'
import { Redirect, Route } from 'react-router'
import { sendNotification } from '@/utils.js'
import { api } from '@/api.js'
import { getCookie } from '@/utils.js'
import axios from 'axios'

/**
 * When trying to access a protected route while unauthenticated, makes the user
 * authenticate and redirects them to the requested page after the login.
 */

function addCSRFToken(options) {
  const CSRFToken = getCookie('csrftoken')

  if (!CSRFToken) {
    return options
  }

  options.headers ??= {}
  options.headers['X-CSRFToken'] = CSRFToken
  return options
}

export class ProtectedRoute extends React.Component {
  static propTypes = {
    component: PropTypes.elementType,
  }
  state = {
    isLoading: true,
    isLogged: false,
  }

  static contextType = AppContext.Context

  checkUser = async () => {
    /**
     * Checks if user is authenticated by calling api.me method.
     * If the user is authenticated, and response is 200 OK, then
     * user is authenticated, if there is a 403 Forbidden error,
     * then the user is not authenticated anymore.
     */
    await axios
      .get(`/api/me/`, {
        headers: { 'X-CSRFToken': getCookie('csrftoken') },
      })
      .then((response) => {
        this.setState({ isLogged: true })
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status == 403) {
            AppContext.logout()
            this.setState({ isLogged: false })
          }
        }
      })
    this.setState({ isLoading: false })
  }

  async componentDidMount() {
    this.checkUser()
  }

  componentDidUpdate(prevProps) {
    if (this.props.component !== prevProps.component) {
      this.checkUser()
    }
  }

  handleLogout(routeProps) {
    const { location } = routeProps
    const redirect = new URLSearchParams({
      redirect: location.pathname + location.search,
    })

    return (
      <Redirect
        to={{
          pathname: '/login',
          search: '?' + redirect.toString(),
        }}
      />
    )
  }

  render() {
    const { isLoggedIn } = this.context
    const { component, ...rest } = this.props
    const { isLoading, isLogged } = this.state

    return (
      <Route
        {...rest}
        render={(routeProps) => {
          if (!isLoggedIn) {
            // Pass the current URL as a query parameter.
            // After the login, the user will be redirected to the current page.
            return this.handleLogout(routeProps)
          } else if (!isLogged && !isLoading) {
            // If the checkUser fails, log out the current user
            return this.handleLogout(routeProps)
          } else if (component) {
            const Component = component
            return <Component {...routeProps} />
          }
        }}
      />
    )
  }
}
