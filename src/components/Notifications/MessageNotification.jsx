import PropTypes from 'prop-types'
import React from 'react'
import { Message } from 'semantic-ui-react'
import 'react-toastify/dist/ReactToastify.css'

export class MessageNotification extends React.Component {
  static propTypes = {
    icon: PropTypes.string, // Used to render an icon: see https://react.semantic-ui.com/elements/icon/
    header: PropTypes.string.isRequired, // Header of the notification
    content: PropTypes.string.isRequired, // Description of the notification
    timer: PropTypes.number, // If populated, the notification will disappear after this time (in ms)
    color: PropTypes.string, // Color of the component
  }

  constructor() {
    super()
    this.state = {
      showMessage: true,
    }
  }

  componentDidMount() {
    // This is called only the first time the component is mounted
    if (this.props.timer) {
      this.setTimer()
    }
  }

  setToFalseTimeout = null

  setTimer() {
    this.setToFalseTimeout = setTimeout(
      () => this.resetMessage(),
      this.props.timer
    )
  }
  componentWillUnmount() {
    // Once we're done, stop with period call for refreshes
    clearTimeout(this.setToFalseTimeout)
  }

  resetMessage() {
    this.setState({ showMessage: false })
  }

  render() {
    const showMessage = this.state
    return (
      showMessage && (
        <Message
          style={{
            position: 'relative',
            top: '10%',
            width: '100%',
          }}
          color={this.props.color}
          icon={this.props.icon}
          header={this.props.header}
          content={this.props.content}
          onDismiss={this.resetMessage}
        />
      )
    )
  }
}
