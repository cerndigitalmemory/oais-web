import { api } from '@/api.js'
import { AppContext } from '@/AppContext.js'
import { sendNotification } from '@/utils.js'
import React from 'react'
import { Loader } from 'semantic-ui-react'
import { Redirect } from 'react-router'

/**
 * Handles the authentication callback after a login.
 *
 * Rendered after a successful login, fetches the user
 * user information, so that the application knows that the user is now
 * logged in.
 */
export class LoginCallback extends React.Component {
  static contextType = AppContext.Context

  state = { isLoading: true }

  async componentDidMount() {
    const { isLoggedIn } = this.context
    if (!isLoggedIn) {
      try {
        const user = await api.userMe()
        AppContext.setUser(user)
      } catch (e) {
        sendNotification(
          'Error while logging in using CERN credentials',
          e.message,
          'error'
        )
      } finally {
        this.setState({ isLoading: false })
      }
    }
  }

  render() {
    const { isLoggedIn } = this.context
    const { isLoading } = this.state

    if (isLoading) {
      return (
        <div>
          <Loader active />
        </div>
      )
    } else if (isLoggedIn) {
      return <Redirect to="/" />
    } else {
      return <Redirect to="/login" />
    }
  }
}
