import { api } from '@/api.js'
import { AppContext } from '@/AppContext.js'
import { stepType, archiveType } from '@/types.js'
import {
  StepStatusLabel,
  StepNameLabel,
  formatDateTime,
  hasPermission,
  Permissions,
  sendNotification,
} from '@/utils.js'
import PropTypes from 'prop-types'
import React from 'react'
import { Button, Icon, Grid, Accordion, Container } from 'semantic-ui-react'

/**
 * This component gets the steps as a prop and renders a list of the steps
 * using the map function.
 *
 */
export class StepsList extends React.Component {
  static propTypes = {
    steps: PropTypes.arrayOf(stepType),
    archive: archiveType.isRequired,
  }

  render() {
    const { steps, archive } = this.props
    return (
      <React.Fragment>
        {steps.map((step) => (
          <Step
            key={step.id}
            step={step}
            archive={archive}
            lastStep={steps.at(-1)}
          />
        ))}
      </React.Fragment>
    )
  }
}

/**
 * This component gets each step from the map function of the parent component
 * and renders all relevant information.
 *
 */
class Step extends React.Component {
  static propTypes = {
    step: stepType.isRequired,
    archive: archiveType.isRequired,
    lastStep: stepType.isRequired,
  }
  state = {
    nextStep: null,
    activeIndex: 0,
    loading: false,
    output: null,
    artifact: null,
    renderDownloadButton: false,
    renderArchivematicaDetails: false,
  }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  componentDidMount() {
    this.loadArchivematicaDetails()
    this.loadDownloadButton()
  }

  static contextType = AppContext.Context

  approve = async () => {
    const { step } = this.props
    try {
      await api.approveArchive(step.id)
      this.setState({ loading: true })
    } catch (e) {
      sendNotification('Error while approving archive', e.message, 'error')
    }
  }

  reject = async () => {
    const { step } = this.props
    try {
      await api.rejectArchive(step.id)
      this.setState({ loading: true })
    } catch (e) {
      sendNotification('Error while rejecting archive', e.message, 'error')
    }
  }

  handleNextStep = async (event, { value }) => {
    this.setState({ nextStep: event.target.value })
    await api.archiveNextStep(value, this.props.archive)
  }

  loadArchivematicaDetails = () => {
    const step = this.props.step
    if (step.name === 5) {
      if (step.output_data !== null) {
        // In order to display the JSON correctly double quotes must be replaced with single quotes
        try {
          var output = JSON.parse(step.output_data.replaceAll("'", '"'))
          this.setState({ output: output, renderArchivematicaDetails: true })
        } catch (e) {
          sendNotification('Error while rejecting archive', e.message)
        }
      }
    }
  }

  loadDownloadButton = () => {
    const step = this.props.step
    if (step.output_data !== null) {
      try {
        var output = JSON.parse(
          step.output_data.replaceAll("'", '"').replaceAll('None', '"null"')
        )
        if (output.artifact) {
          this.setState({
            artifact: output.artifact,
            renderDownloadButton: true,
          })
        }
      } catch (e) {
        sendNotification('Error while parsing archive', e.message)
      }
    }
  }

  render() {
    const { step, lastStep } = this.props
    const { user } = this.context
    const {
      activeIndex,
      loading,
      renderDownloadButton,
      renderArchivematicaDetails,
      artifact,
      output,
    } = this.state

    const canApprove = hasPermission(user, Permissions.CAN_APPROVE_ARCHIVE)
    const canReject = hasPermission(user, Permissions.CAN_REJECT_ARCHIVE)

    let actions = null
    if (canApprove && canReject) {
      if (step.status === 5 && !loading) {
        actions = (
          <Button.Group>
            <Button onClick={this.approve} color="green" title="Approve">
              <Icon name="check" />
            </Button>

            <Button onClick={this.reject} color="red" title="Reject">
              <Icon name="cancel" />
            </Button>
          </Button.Group>
        )
      }
    }

    let retryFailedStep = null
    if (step.status === 3 && step.id === lastStep.id) {
      retryFailedStep = (
        <Button
          circular
          icon="redo"
          onClick={this.handleNextStep}
          value={step.name}
        />
      )
    }

    let showFailedDetails = null
    if (step.status === 3 && step.output_data) {
      var msg = JSON.parse(
        step.output_data.replaceAll("'", '"').replaceAll('None', '"null"')
      )
      if (msg.errormsg) {
        showFailedDetails = (
          <Grid.Row>
            <Grid.Column>
              <b>Details: </b> {msg.errormsg}
            </Grid.Column>
          </Grid.Row>
        )
      }
    }

    /*
    If the current step is Archivematica, 
    gets the information from step.output_data field and
    sets the renderArchivematicaDetails to true. 
    If this value is true then archivematica details are rendered
    */
    let downloadButton
    if (artifact && renderDownloadButton) {
      let downloadLink = ''
      if (artifact.artifact_name != 'Invenio Link') {
        downloadLink = '/api/steps/' + step.id + '/download-artifact'
      } else {
        downloadLink = artifact.artifact_url
      }
      downloadButton = (
        <Button
          size="tiny"
          color="blue"
          as="a"
          href={downloadLink}
          target="_blank"
        >
          <Icon name="download alternate"></Icon>
          {artifact.artifact_name}
        </Button>
      )
    }

    var artifactText = <span>Artifacts:&nbsp;</span>
    let accordionActions = null
    if (actions) {
      accordionActions = actions
    } else if (downloadButton) {
      accordionActions = [artifactText, downloadButton]
    }

    return (
      <Container>
        <Grid>
          <Grid.Row columns={2}>
            <Grid.Column floated="left" width={5}>
              <h3>{StepNameLabel[step.name]}</h3>
            </Grid.Column>
            <Grid.Column floated="right" textAlign="right">
              {accordionActions && <>{accordionActions}</>}
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Accordion fluid styled>
          <Accordion.Title
            active={activeIndex === 0}
            index={0}
            onClick={this.handleClick}
          >
            <Icon name="dropdown" />
            Step Details
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 0}>
            <Grid>
              <Grid.Row columns={4}>
                <Grid.Column>
                  <b>ID: </b> {step.id}
                </Grid.Column>
                <Grid.Column>
                  <b>Start Date: </b> {formatDateTime(step.start_date)}
                </Grid.Column>
                <Grid.Column>
                  <b>End Date: </b>{' '}
                  {step.finish_date != null && formatDateTime(step.finish_date)}
                </Grid.Column>
                <Grid.Column>
                  <b>Status: </b> {StepStatusLabel[step.status]}{' '}
                  {retryFailedStep}
                </Grid.Column>
              </Grid.Row>
              {step.status == 3 && showFailedDetails}
            </Grid>
          </Accordion.Content>
          <Accordion.Title
            active={activeIndex === 1}
            index={1}
            onClick={this.handleClick}
          >
            <Icon name="dropdown" />
            Celery Task Details
          </Accordion.Title>
          <Accordion.Content active={activeIndex === 1}>
            <Grid>
              <Grid.Row columns={1}>
                <Grid.Column>
                  <b>Task ID: </b> {step.celery_task_id}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Accordion.Content>
          {renderArchivematicaDetails && (
            <React.Fragment>
              <Accordion.Title
                active={activeIndex === 2}
                index={2}
                onClick={this.handleClick}
              >
                <Icon name="dropdown" />
                Archivematica Details
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 2}>
                <Grid>
                  <Grid.Row columns={3}>
                    <Grid.Column>
                      <b>Step: </b> {output.type}
                    </Grid.Column>
                    <Grid.Column>
                      <b>UUID: </b> {output.uuid}
                    </Grid.Column>
                    <Grid.Column>
                      <b>Status: </b> {output.status}
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      <b>Directory: </b> {output.directory}
                    </Grid.Column>
                    <Grid.Column>
                      <b>File Name: </b> {output.name}
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      <b>Microservice: </b> {output.microservice}
                    </Grid.Column>
                    <Grid.Column>
                      <b>Message: </b> {output.message}
                    </Grid.Column>
                  </Grid.Row>
                </Grid>
              </Accordion.Content>
            </React.Fragment>
          )}
        </Accordion>
        <br />
      </Container>
    )
  }
}
