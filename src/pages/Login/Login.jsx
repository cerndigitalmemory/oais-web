import { api, API_URL } from '@/api.js'
import { AppContext } from '@/AppContext.js'
import { sendNotification } from '@/utils.js'
import PropTypes from 'prop-types'
import React from 'react'
import { Button, Divider, Form, Grid, Segment, Header } from 'semantic-ui-react'
import 'semantic-ui-css-b/semantic.min.css'
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
    try {
      const user = await api.login(this.state.username, this.state.password)
      AppContext.setUser(user)
    } catch (e) {
      sendNotification('Error while logging in', e.message, 'error')
    }
  }

  render() {
    const { isLoggedIn } = this.context

    if (isLoggedIn) {
      const params = new URLSearchParams(this.props.location.search)
      const redirectURL = params.get('redirect') ?? '/'
      return <Redirect to={redirectURL} />
    }

    return (
      <div>
        <h1>Login</h1>
        <Segment placeholder>
          <Grid columns={2} relaxed="very" stackable divided>
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

            <Grid.Column verticalAlign="middle" textAlign="center">
              <Button href={API_URL + 'oidc/authenticate/'} color="blue">
                Login with a CERN Account
              </Button>
            </Grid.Column>
          </Grid>
        </Segment>
      </div>
    )
  }
}
