import { api } from "@/api.js";
import { AppContext } from "@/AppContext.js";
import { stepType } from "@/types.js";
import {
  StepStatus,
  StepStatusLabel,
  StepNameLabel,
  StepName,
  formatDateTime,
  hasPermission,
  Permissions,
  sendNotification,
} from "@/utils.js";
import PropTypes from "prop-types";
import React from "react";
import { Button, Header, Icon, Segment, Grid, Accordion, Container, Image } from "semantic-ui-react";

export class StepsList extends React.Component {
  static propTypes = {
    steps: PropTypes.arrayOf(stepType),
    onStepUpdate: PropTypes.func.isRequired,
  };

  render() {
    const { steps, onStepUpdate } = this.props;
    return (
        <React.Fragment>
          {steps.map((step) => (
            <Step
              key={step.id}
              step={step}
              onStepUpdate={onStepUpdate}
            />
          ))}
        </React.Fragment>
    );
  }
}

class Step extends React.Component {
  static propTypes = {
    step: stepType.isRequired,
    onStepUpdate: PropTypes.func.isRequired,
  };

  state = { activeIndex: 0 }

  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  static contextType = AppContext.Context;

  approve = async () => {
    const { step, onStepUpdate } = this.props;
    try {
      const updatedStep = await api.approveArchive(step.id);
      onStepUpdate(updatedStep);
    } catch (e) {
      sendNotification("Error while approving archive", e.message);
    }
  };

  reject = async () => {
    const { step, onStepUpdate } = this.props;
    try {
      const updatedStep = await api.rejectArchive(step.id);
      onStepUpdate(updatedStep);
    } catch (e) {
      sendNotification("Error while rejecting archive", e.message);
    }
  };


  render() {
    const { step } = this.props;
    const { user } = this.context;
    const { activeIndex } = this.state
  
    // const canApprove = hasPermission(user, Permissions.CAN_APPROVE_ARCHIVE);
    // const canReject = hasPermission(user, Permissions.CAN_REJECT_ARCHIVE);
  
    let actions = null;
    if (step.status === 5) {
      actions = (
        <Button.Group>

            <Button onClick={this.approve} color="green" title="Approve">
              <Icon name='check' />
            </Button>

            <Button onClick={this.reject} color="red" title="Reject">
              <Icon name='cancel' />
            </Button>

        </Button.Group>
      );
    }


    return (
      <Container>
        <h3>{StepNameLabel[step.name]}</h3>
        <Accordion fluid styled>
        <Accordion.Title
          active={activeIndex === 0}
          index={0}
          onClick={this.handleClick}
        >
          <Icon name='dropdown' />
          Step Details
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 0}>
          <Grid>
          <Grid.Row columns={4}>
          <Grid.Column><b>ID: </b> {step.id}</Grid.Column>
          <Grid.Column><b>Start Date: </b> {formatDateTime(step.start_date)}</Grid.Column>
          <Grid.Column><b>End Date: </b> {formatDateTime(step.end_date)}</Grid.Column>
          <Grid.Column><b>Status: </b> {StepStatusLabel[step.status]}</Grid.Column>
          </Grid.Row>
          </Grid>
        </Accordion.Content>

        <Accordion.Title
          active={activeIndex === 1}
          index={1}
          onClick={this.handleClick}
        >
          <Icon name='dropdown' />
          Task Details
        </Accordion.Title>
        <Accordion.Content active={activeIndex === 1}>
        <Grid>
          
          <Grid.Row columns={2}>
          <Grid.Column><b>Task ID: </b> {step.celery_task_id}</Grid.Column>
          <Grid.Column><b>Actions: </b> {actions}</Grid.Column>
          </Grid.Row>
        </Grid>
        </Accordion.Content>

      
      </Accordion>
      <br/>

      </Container>
      
    );
  }
}

export class PipelineStatus extends React.Component {
  static propTypes = {
    steps: PropTypes.arrayOf(stepType),
    onStepUpdate: PropTypes.func.isRequired,
  };

  render() {
    const { steps, onStepUpdate } = this.props;
    return (
        <Container>
          {steps.map((step) => (
            <PipelineElement
              key={step.id}
              step={step}
              onStepUpdate={onStepUpdate}
            />
          ))}
        </Container>
    );
  }
}

class PipelineElement extends React.Component {
  static propTypes = {
    step: stepType.isRequired,
    onStepUpdate: PropTypes.func.isRequired,
  };

  static contextType = AppContext.Context;


  render() {
    const { step } = this.props;
    const { user } = this.context;
    
    let color = 'grey';
    if (step.status === 4) {
      color = 'green'
    } 
    if (step.status === 3) {
      color = 'red'
    } 
    if (step.status === 2) {
      color = 'blue'
    } 

  
    // const canApprove = hasPermission(user, Permissions.CAN_APPROVE_ARCHIVE);
    // const canReject = hasPermission(user, Permissions.CAN_REJECT_ARCHIVE);
  

    return (
        <Segment circular style={{ width: 125, height: 125}}  color={color}>
          <Header as='h4'>
          {StepNameLabel[step.name]}
            <Header.Subheader>{StepStatusLabel[step.status]}</Header.Subheader>
          </Header>
          </Segment>
      
      
      
      
    );
  }
}
