import React from 'react'
import {
  Header,
  Icon,
  Grid,
  Button,
  Loader,
  Message,
  List,
  Segment,
  Step,
  Container,
} from 'semantic-ui-react'
import PropTypes from 'prop-types'
import { AppContext } from '@/AppContext.js'
import { StatisticsGrid } from '@/pages/Home/HomeStatisticsGrid.jsx'
import { SourceStatusList } from '@/pages/Home/HomeSourceStatus.jsx'
import { Link } from 'react-router-dom'

export class Home extends React.Component {
  static contextType = AppContext.Context
  constructor(props) {
    super(props)
    this.state = {
      showInstructionsMessage: true,
    }
  }

  closeMessage = () => {
    this.setState({ showInstructionsMessage: false })
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
          <center>Welcome to Preserve, the CERN Digital Memory Platform </center>
        </h1>
        <Container textAlign="center">
          {' '}
          <span className="frontText">
            This service allows to retrieve your digital
            assets from CERN digital repositories and request
            their archival preparing them for the long term preservation, following the <a href="https://public.ccsds.org/Pubs/650x0m2.pdf">OAIS specifications</a>.
            <br></br>
            <br></br>
            <Grid.Row>
              <Grid.Column width={16}>
                {!isLoggedIn && (
                  <Message color="yellow">
                    <Message.Header>Warning</Message.Header>
                    The platform is in pre-production state. <br></br>Requesting new archives is currently limited to CERN Record Officers.{' '}
                    <br></br>
                    <small>
                      Contact us at digital.memory (at) cern.ch or open a{' '}
                      <a
                        target="_blank"
                        rel="noreferrer"
                        href="https://cern.service-now.com/service-portal?id=functional_element&name=Open-Archival-Information"
                      >
                        {' '}
                        ticket
                      </a>
                      .
                    </small>
                  </Message>
                )}
              </Grid.Column>
            </Grid.Row>
          </span>
        </Container>
        {isLoggedIn ? (
          <React.Fragment>
            {this.state.showInstructionsMessage && (
              <div>
                <Header as="h2" icon textAlign="center">
                  <Header.Content>Getting Started</Header.Content>
                </Header>
                <HomeInstructions
                  showInstructionsMessage={this.state.showInstructionsMessage}
                  handleInstructionMessage={this.closeMessage}
                />
              </div>
            )}
            <Header as="h2" icon textAlign="center">
              <Header.Content>Sources availability</Header.Content>
            </Header>
            <Container textAlign="center">
              Here&#39;s an overview of the available repositories to search form.
              Some of them may need additional
              <Link to="settings">
                {' '}
                 <b>configuration</b>
              </Link>{' '}.
              
            <div style={{marginTop: 10 + 'px'}}>
            <SourceStatusList/>
            </div>
            <small>Support for additional repositories is work in progress</small>.
            </Container>
            <br></br>
          </React.Fragment>
        ) : (
          <Loader />
        )}
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
      <div>
        <Grid columns={1}>
          <Grid.Column>
            <Link to={`/harvest/`}>
              <Button fluid>Harvest from source</Button>
            </Link>
          </Grid.Column>
        </Grid>

        <Grid columns={2} stackable>
          <Grid.Row>
            <Grid.Column>
              <Link to={`/upload/folder`}>
                <Button fluid>Upload local folder</Button>
              </Link>
            </Grid.Column>

            <Grid.Column>
              <Link to={`/upload/sip`}>
                <Button fluid>Upload SIP</Button>
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
      </div>
    )
  }
}

export class HomeInstructions extends React.Component {
  static propTypes = {
    showInstructionsMessage: PropTypes.bool.isRequired,
    handleInstructionMessage: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Container>
        <Grid columns={4} stackable>
          <Grid.Row>
            <HomeInstructionsColumn
              instructionNumber={1}
              title="Configure"
              description="To be able to fetch your private records you'll need to set up some API tokens first."
              linkTo="/settings/"
              icon="settings"
            />
            <HomeInstructionsColumn
              instructionNumber={2}
              title="Search"
              description="You can search for any records on Indico, CodiMD, CDS and Zenodo from the Search page. The platform will fetch the data for you."
              linkTo="/harvest/"
              icon="search"
            />
            <HomeInstructionsColumn
              instructionNumber={3}
              title="Organize"
              description="Once you selected your records, they will be waiting in the 'Staging Area', where you can organize them with custom tags."
              linkTo="/staged/"
              icon="tags"
            />
            <HomeInstructionsColumn
              instructionNumber={4}
              title="Download"
              description="Once you confirmed your selection from the staging area, the preservation process will start. Check after a while to get download links."
              linkTo="/archives/"
              icon="download"
            />
          </Grid.Row>
        </Grid>
      </Container>
    )
  }
}

export class HomeInstructionsColumn extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    linkTo: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    instructionNumber: PropTypes.number.isRequired,
  }

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <Grid.Column textAlign="center" className='incolumn'>
        <Segment className='instructionBox'>
          <Grid.Row>
            <Header as="h2">{this.props.instructionNumber}</Header>
          </Grid.Row>
          <hr />
          <Grid.Row style={{ minHeight: 250 }}>
            <h3>{this.props.title}</h3>
            <Icon name={this.props.icon} circular size="big" />
            <p>{this.props.description}</p>
          </Grid.Row>
          <Grid.Row>
            <Link to={this.props.linkTo}>
            <Button content={this.props.title} icon={this.props.icon} labelPosition='right' />
            </Link>
          </Grid.Row>
        </Segment>
      </Grid.Column>
    )
  }
}
