import React from 'react'
import { Grid, Placeholder, Segment, Statistic } from 'semantic-ui-react'
import { api } from '@/api.js'
import { AppContext } from '@/AppContext.js'
import { StepStatus, StepName } from '@/utils.js'
import { Link } from 'react-router-dom'

export class StatisticsGrid extends React.Component {
  static contextType = AppContext.Context

  constructor(props) {
    super(props)
    this.state = {
      loadingArchives: true,
      loadingCollections: true,
      loadingWaitingApproval: true,
      loadingCompleted: true,
      archives: [],
      collections: [],
      stepsWaitingApproval: [],
      stepsCompleted: [],
      totalArchives: 0,
      totalCollections: 0,
    }
  }

  componentDidMount() {
    let { isLoggedIn } = this.context
    if (isLoggedIn) {
      this.loadArchives()
      this.loadCollections()
      this.loadCompletedArchives()
      this.loadWaitingArchives()
    }
  }

  getArchives = (page) => api.archives(page)

  loadArchives = async (page = 1) => {
    try {
      const { results: archives, count: totalArchives } =
        await this.getArchives(page)
      this.setState({ archives, totalArchives })
      this.setState({ loadingArchives: false })
    } catch (e) {
      this.setState({ loadingArchives: false })
    }
  }

  getCollections = (page, internal) => api.collections(page, internal)

  loadCollections = async (page = 1) => {
    try {
      const internal = false
      const { results: collections, count: totalCollections } =
        await this.getCollections(page, internal)
      this.setState({
        collections: collections,
        totalCollections: totalCollections,
        loadingCollections: false,
      })
    } catch (e) {
      this.setState({
        loadingCollections: false,
      })
    }
  }

  getSteps = (status, name) => api.getStepsStatus(status, name)

  loadCompletedArchives = async () => {
    try {
      const steps = await this.getSteps(
        StepStatus.COMPLETED,
        StepName.VALIDATION
      )
      this.setState({
        stepsCompleted: steps,
        loadingCompleted: false,
      })
    } catch (e) {
      this.setState({
        loadingCompleted: false,
      })
    }
  }

  loadWaitingArchives = async () => {
    try {
      const steps = await this.getSteps(
        StepStatus.WAITING_APPROVAL,
        StepName.HARVEST
      )
      this.setState({
        stepsWaitingApproval: steps,
        loadingWaitingApproval: false,
      })
    } catch (e) {
      this.setState({
        loadingWaitingApproval: false,
      })
    }
  }

  render() {
    const {
      totalArchives,
      loadingArchives,
      totalCollections,
      loadingCollections,
      stepsWaitingApproval,
      loadingWaitingApproval,
      stepsCompleted,
      loadingCompleted,
    } = this.state

    const loadingSegment = (
      <Placeholder>
        <Placeholder.Header image>
          <Placeholder.Line />
          <Placeholder.Line />
        </Placeholder.Header>
      </Placeholder>
    )

    return (
      <Grid columns={2} stackable>
        <Grid.Row>
          <Grid.Column>
            <Segment raised>
              {loadingArchives ? (
                <div>{loadingSegment}</div>
              ) : (
                <Link to={`/archives/`}>
                  <Statistic
                    horizontal
                    label="Archives"
                    value={totalArchives}
                  />
                </Link>
              )}
            </Segment>
          </Grid.Column>

          <Grid.Column>
            <Segment raised>
              {loadingCollections ? (
                <div>{loadingSegment}</div>
              ) : (
                <Link to={`/collections/`}>
                  <Statistic horizontal label="Tags" value={totalCollections} />
                </Link>
              )}
            </Segment>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Segment raised>
              {loadingCompleted ? (
                <div>{loadingSegment}</div>
              ) : (
                <Link to={`/archives/`}>
                  <Statistic
                    horizontal
                    label="Archives (SIP) are Completed"
                    value={stepsCompleted.length}
                  />
                </Link>
              )}
            </Segment>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    )
  }
}

StatisticsGrid.contextType = AppContext.Context
