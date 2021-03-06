import { api } from '@/api'
import { AppContext } from '@/AppContext.js'
import { sendNotification } from '@/utils'
import React from 'react'
import { Redirect } from 'react-router-dom'

/**
 * Logouts the user and redirects to the home page.
 */
export class Logout extends React.Component {
  static contextType = AppContext.Context

  async componentDidMount() {
    try {
      await api.logout()
    } catch (e) {
      sendNotification('Error while logging out', e.message, 'error')
    }
    AppContext.logout()
  }

  render() {
    return <Redirect to="/" />
  }
}
