import { AppContext } from '@/AppContext'
import { notificationType } from '@/types.js'
import PropTypes from 'prop-types'
import React from 'react'
import { Container, Message } from 'semantic-ui-react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export class Notifications extends React.Component {
  static propTypes = {
    notifications: PropTypes.arrayOf(notificationType).isRequired,
  }

  handleClose(notification) {
    AppContext.removeNotification(notification)
  }

  render() {
    const { notifications } = this.props

    notifications.map((notification) => {
      if (notification.type == 'warning') {
        toast.warn(
          <div>
            <b>{notification.title}</b> <br /> <p>{notification.body}</p>
          </div>,
          {
            position: 'top-center',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            enableMultiContainer: false,
            onOpen: this.handleClose(notification),
          }
        )
      } else if (notification.type == 'error') {
        toast.error(
          <div>
            <b>{notification.title}</b> <br /> <p>{notification.body}</p>
          </div>,
          {
            position: 'top-center',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            enableMultiContainer: false,
            onOpen: this.handleClose(notification),
          }
        )
      } else if (notification.type == 'success') {
        toast.success(
          <div>
            <b>{notification.title}</b> <br /> <p>{notification.body}</p>
          </div>,
          {
            position: 'top-center',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            enableMultiContainer: false,
            onOpen: this.handleClose(notification),
          }
        )
      } else {
        toast(
          <div>
            <b>{notification.title}</b> <br /> <p>{notification.body}</p>
          </div>,
          {
            position: 'top-center',
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            enableMultiContainer: false,
            onOpen: this.handleClose(notification),
          }
        )
      }
    })

    return (
      <Container>
        <ToastContainer />
      </Container>
    )
  }
}
