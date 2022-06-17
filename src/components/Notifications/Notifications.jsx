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

  constructor() {
    super()
    this.state = {
      networkError: false,
    }
  }

  showWarning = (notification) =>
    toast.warn(
      <div>
        <b>{notification.title}</b> <br /> <p>{notification.body}</p>
      </div>,
      {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        enableMultiContainer: false,
        onOpen: this.handleClose(notification),
      }
    )

  showError = (notification) =>
    toast.error(
      <div>
        <b>{notification.title}</b> <br /> <p>{notification.body}</p>
      </div>,
      {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        enableMultiContainer: false,
        onOpen: this.handleClose(notification),
      }
    )

  showSuccess = (notification) =>
    toast.success(
      <div>
        <b>{notification.title}</b> <br /> <p>{notification.body}</p>
      </div>,
      {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        enableMultiContainer: false,
        onOpen: this.handleClose(notification),
      }
    )

  showNotification = (notification) =>
    toast(
      <div>
        <b>{notification.title}</b> <br /> <p>{notification.body}</p>
      </div>,
      {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        enableMultiContainer: false,
        onOpen: this.handleClose(notification),
      }
    )

  updateComponent = () => {
    this.props.notifications.map((notification) => {
      if (notification.type == 'warning') {
        this.showWarning(notification)
      } else if (notification.type == 'error') {
        if (notification.body === 'Network Error') {
          this.setNetworkError()
        } else {
          this.showError(notification)
        }
      } else if (notification.type == 'success') {
        this.showSuccess(notification)
      } else {
        this.showNotification(notification)
      }
    })
  }

  componentDidMount() {
    // This is called only the first time the component is mounted
    this.updateComponent()
  }

  componentDidUpdate() {
    // This is called when the component props or state changes.
    // When the notification prop changes (a new notification is added), then the component should update
    this.updateComponent()
  }

  handleClose(notification) {
    AppContext.removeNotification(notification)
  }

  resetNetworkError() {
    this.setState({ networkError: false })
  }

  setToFalseTimeout = null

  setNetworkError() {
    if (this.state.networkError) {
      clearTimeout(this.setToFalseTimeout)
      this.setToFalseTimeout = setTimeout(() => this.resetNetworkError(), 6000)
    } else {
      this.setState({ networkError: true })
      this.setToFalseTimeout = setTimeout(() => this.resetNetworkError(), 6000)
    }
  }
  componentWillUnmount() {
    // Once we're done, stop with period call for refreshes
    clearTimeout(this.setToFalseTimeout)
  }

  render() {
    return (
      <Container>
        {this.state.networkError ? (
          <Message
            negative
            icon="warning sign"
            header="Network Error"
            content="Check your network connection and try again."
          />
        ) : (
          <ToastContainer limit={3} />
        )}
      </Container>
    )
  }
}
