import React from 'react'
import { Header, Icon, Grid, Button, Loader } from 'semantic-ui-react'
import { AppContext } from '@/AppContext.js'
import { StatisticsGrid } from '@/pages/Home/HomeStatisticsGrid.jsx'
import { Link } from 'react-router-dom'

export class Home extends React.Component {
  static contextType = AppContext.Context
  constructor(props) {
    super(props)
  }

  render() {
    const { isLoggedIn, user } = this.context

    let userName
    if (user) {
      userName = user.username
    }

    return (
      <React.Fragment>
        <h1>
          {' '}
          <center>Welcome to the CERN Digital Memory Platform </center>
        </h1>
        {(isLoggedIn) ? (
          <React.Fragment>
            <Header as="h2" icon textAlign="center">
              <Icon name="line graph" circular />
              <Header.Content>Statistics</Header.Content>
            </Header>
            <StatisticsGrid/>
            <Header as="h2" icon textAlign="center">
              <Icon name="mouse pointer" circular />
              <Header.Content>Quick Actions</Header.Content>
            </Header>
            <QuickActions />
          </React.Fragment>
        ) : <Loader/>}
      </React.Fragment>
    )
  }
}

export class QuickActions extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Grid columns={2} stackable>
        <Grid.Row>
          <Grid.Column>
            <Link to={`/harvest/`}>
              <Button fluid>Harvest from a source</Button>
            </Link>
          </Grid.Column>

          <Grid.Column>
            <Link to={`/upload/`}>
              <Button fluid>Upload a SIP</Button>
            </Link>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Link to={`/staged/`}>
              <Button fluid>See your staged archives</Button>
            </Link>
          </Grid.Column>

          <Grid.Column>
            <Link to={`/collections/`}>
              <Button fluid>See your collections</Button>
            </Link>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}
