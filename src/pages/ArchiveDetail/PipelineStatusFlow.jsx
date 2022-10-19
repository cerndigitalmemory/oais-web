import { api } from '@/api.js'
import { AppContext } from '@/AppContext.js'
import { stepType, archiveType } from '@/types.js'
import { StepStatusLabel, StepNameLabel, hasPermission } from '@/utils.js'
import PropTypes from 'prop-types'
import React from 'react'
import {
  Button,
  Header,
  Popup,
  Segment,
  Label,
  Grid,
  Icon,
  Loader,
} from 'semantic-ui-react'

/**
 * This component shows a flow of the completed or pending steps.
 * It gets a list of steps and the archive details as props and
 * renders a grid of circular segments one for each step
 *
 */
export class StepsPipeline extends React.Component {
  static propTypes = {
    steps: PropTypes.arrayOf(stepType),
    archive: archiveType.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      nextSteps: this.props.archive.next_steps,
    }
  }

  render() {
    const { nextSteps } = this.state
    const { archive, steps } = this.props

    return (
      <Segment raised>
        <Label color="blue" ribbon>
          Pipeline overview
        </Label>
        <PipelineStatus steps={steps} archive={archive} nextSteps={nextSteps} />
      </Segment>
    )
  }
}

/**
 * This component creates the grid for the steps segments and
 * creates another one segment for the selection of the next step
 * if the nextSteps array is not null
 *
 */
class PipelineStatus extends React.Component {
  static propTypes = {
    steps: PropTypes.arrayOf(stepType),
    archive: archiveType.isRequired,
    nextSteps: PropTypes.arrayOf(Number),
  }

  constructor(props) {
    super(props)
  }

  static contextType = AppContext.Context
  
  render() {
    const { steps, archive, nextSteps } = this.props
    const { user } = this.context
    const lastStep = steps.at(-1) // Gets the latest step

    let canAccessArchive = false

    if (hasPermission(user, Permissions.CAN_ACCESS_ARCHIVE)) { canAccessArchive =  true} // If user can access all archival requests
    if (user.id == archive.creator.id) { canAccessArchive =  true} // If the user is the creator of the document

    // Creates the next step button if the next steps array length is greater than 0
    let nextStepButton
    if (nextSteps.length > 0) {
      nextStepButton = (
        <React.Fragment>
          <Popup
            position="top center"
            wide
            positionFixed
            trigger={
              <Segment
                circular
                style={{ width: 120, height: 120}}
                textAlign="center"
              >
                <Icon name="plus" />
              </Segment>
            }
            flowing
            hoverable
          >
            <Grid centered divided>
              <Grid.Column>
                <Grid.Row>
                  <Header>Choose Next Step</Header>
                </Grid.Row>
                {nextSteps.map((nextStep) => (
                  <NextStep
                    key={nextStep}
                    nextStep={nextStep}
                    archive={archive}
                  />
                ))}
              </Grid.Column>
            </Grid>
          </Popup>
        </React.Fragment>
      )
    }

    return (
      <React.Fragment>
        <Grid relaxed columns={steps.length + 1}>
          <Grid.Row>
            {steps
              .filter(
                (completedStep) =>
                  (completedStep.status == 4 ||
                    completedStep.id == lastStep.id) &&
                  completedStep.name !== 6
              )
              .map((step) => (
                <PipelineElement key={step.id} step={step} archive={archive} />
              ))}
            {canAccessArchive && <Grid.Column>{nextStepButton}</Grid.Column>}
            
          </Grid.Row>
        </Grid>
      </React.Fragment>
    )
  }
}

/**
 * This component renders each one of the steps only if it completed
 * or if it is the last one. If a step is failed and it is the latest one
 * shows a retry button
 */
class PipelineElement extends React.Component {
  static propTypes = {
    step: stepType.isRequired,
    archive: archiveType.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      loading: false, // If a failed step is retried show a spinner
    }
  }

  static contextType = AppContext.Context

  handleFailedStep = async (event, { value }) => {
    this.setState({ nextStep: event.target.value })
    await api.archiveNextStep(value, this.props.archive)
    this.setState({ loading: true })
  }

  render() {
    const { step, archive } = this.props
    const { user } = this.context
    const { loading } = this.state

    let color = 'grey'
    let retryFailed = null
    if (step.status === 6) {
      color = 'red'
    }
    if (step.status === 5) {
      color = 'yellow'
    }
    if (step.status === 4) {
      color = 'green'
    }
    if (step.status === 3) {
      color = 'red'
      // If the step is failed, show a retry step button
      if (!loading) {
        retryFailed = (
          <Button
            circular
            icon="redo"
            onClick={this.handleFailedStep}
            value={step.name}
          />
        )
      } else {
        retryFailed = <Loader active inline />
      }
    }
    if (step.status === 2) {
      color = 'blue'
    }
    if (step.status === 1) {
      color = 'teal'
    }

    let canAccessArchive = false

    if (hasPermission(user, Permissions.CAN_ACCESS_ARCHIVE)) { canAccessArchive =  true} // If user can access all archival requests
    if (user.id == archive.creator.id) { canAccessArchive =  true} // If the user is the creator of the document


    // const canApprove = hasPermission(user, Permissions.CAN_APPROVE_ARCHIVE);
    // const canReject = hasPermission(user, Permissions.CAN_REJECT_ARCHIVE);

    return (
      <Grid.Column width="2">
        <Segment circular style={{ width: 120, height: 120 }} color={color}>
          <Header as="h5" textAlign="center">
            {StepNameLabel[step.name]}
            <Header.Subheader>{StepStatusLabel[step.status]}</Header.Subheader>
            {canAccessArchive && <Header.Subheader>{retryFailed}</Header.Subheader> }
          </Header>
        </Segment>
      </Grid.Column>
    )
  }
}

/**
 * Shows a circular segment which contains a dropdown menu where the user can select the next step
 */
class NextStep extends React.Component {
  static propTypes = {
    nextStep: PropTypes.number.isRequired,
    archive: archiveType.isRequired,
  }
  constructor(props) {
    super(props)
    this.state = {
      ChooseNextStep: null,
      loading: false,
    }
  }

  static contextType = AppContext.Context

  handleStepChange = async (event, { value }) => {
    this.setState({ ChooseNextStep: event.target.value })
    this.setState({ loading: true })
    await api.archiveNextStep(value, this.props.archive)
  }

  render() {
    const { nextStep } = this.props
    // const canApprove = hasPermission(user, Permissions.CAN_APPROVE_ARCHIVE);
    // const canReject = hasPermission(user, Permissions.CAN_REJECT_ARCHIVE);

    return (
      <Grid.Row textAlign="center">
        <Button onClick={this.handleStepChange} value={nextStep}>
          {StepNameLabel[nextStep]}
        </Button>
      </Grid.Row>
    )
  }
}
