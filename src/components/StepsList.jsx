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
import { Button, Table, Icon } from "semantic-ui-react";

export class StepsList extends React.Component {
  static propTypes = {
    steps: PropTypes.arrayOf(stepType),
    onStepUpdate: PropTypes.func.isRequired,
  };

  render() {
    const { steps, onStepUpdate } = this.props;
    return (
      <Table textAlign="center">
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Start Date</Table.HeaderCell>
            <Table.HeaderCell>End Date</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Input Step</Table.HeaderCell>
            <Table.HeaderCell>Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {steps.map((step) => (
            <Step
              key={step.id}
              step={step}
              onStepUpdate={onStepUpdate}
            />
          ))}
        </Table.Body>
      </Table>
    );
  }
}

class Step extends React.Component {
  static propTypes = {
    step: stepType.isRequired,
    onStepUpdate: PropTypes.func.isRequired,
  };

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
      <Table.Row>
        <Table.Cell>{step.id}</Table.Cell>
        <Table.Cell>
            {StepNameLabel[step.name]}
        </Table.Cell>
        <Table.Cell>
          {formatDateTime(step.start_date)}
        </Table.Cell>
        <Table.Cell>{formatDateTime(step.end_date)}</Table.Cell>
        <Table.Cell>{StepStatusLabel[step.status]}</Table.Cell>
        <Table.Cell>{step.input_step}</Table.Cell>
        <Table.Cell>{actions}</Table.Cell>
      </Table.Row>
    );
  }
}
