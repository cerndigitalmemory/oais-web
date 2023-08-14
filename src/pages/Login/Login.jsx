import { api, API_URL } from '@/api.js'
import { AppContext } from '@/AppContext.js'
import { sendNotification } from '@/utils.js'
import PropTypes from 'prop-types'
import React from 'react'
import {
  Button,
  Loader,
  Dimmer,
  Form,
  Grid,
  Segment,
  Header,
} from 'semantic-ui-react'
import { Redirect } from 'react-router'

export class Login extends React.Component {
  static propTypes = {
    location: PropTypes.shape({
      search: PropTypes.string.isRequired,
    }).isRequired,
  }
  static contextType = AppContext.Context

  constructor(props) {
    super(props)

    this.state = {
      username: '',
      password: '',
      active: false,
    }
  }

  handleUsernameChange = (event) => {
    this.setState({ username: event.target.value })
  }

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    this.setState({ active: true })
    try {
      const user = await api.login(this.state.username, this.state.password)
      AppContext.setUser(user)
    } catch (e) {
      sendNotification('Error while logging in', e.message, 'error')
    } finally {
      this.setState({ active: false })
    }
  }

  render() {
    const { isLoggedIn } = this.context
    const { active } = this.state

    if (isLoggedIn) {
      const params = new URLSearchParams(this.props.location.search)
      const redirectURL = params.get('redirect') ?? '/'
      return <Redirect to={redirectURL} />
    }

    // By default, we need 1 column and no additional login widgets
    let columns = 1
    let additional_login_widgets

    // If we're rendering the "extended login" page, let's add the local login form
    // (it must be supported/enabled by backend anyway)
    if (location.pathname === '/extended-login') {
      columns = 2
      additional_login_widgets = (
        <Grid.Column>
          <Form onSubmit={this.handleSubmit}>
            <Form.Input
              icon="user"
              iconPosition="left"
              label="Username"
              placeholder="Username"
              type="text"
              value={this.state.username}
              onChange={this.handleUsernameChange}
            />
            <Form.Input
              icon="lock"
              iconPosition="left"
              label="Password"
              placeholder="Password"
              type="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />
            <Button content="Login" primary />
          </Form>
        </Grid.Column>
      )
    }

    return (
      <div>
        <h1>Login</h1>
        <Dimmer.Dimmable dimmed={active}>
          <Segment placeholder>
            <Grid columns={columns} relaxed="very" stackable divided>
              {additional_login_widgets}
              <Grid.Column verticalAlign="middle" textAlign="center">
                <Button href={API_URL + 'oidc/authenticate/'} color="blue">
                  Login with a CERN Account
                </Button>
              </Grid.Column>
            </Grid>
          </Segment>

          <Dimmer active={active} inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
        </Dimmer.Dimmable>
      </div>
    )
  }
}
