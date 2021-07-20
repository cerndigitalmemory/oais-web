import { api } from "@/api.js";
import { recordType } from "@/types.js";
import { sendNotification } from "@/utils.js";
import PropTypes from "prop-types";
import React from "react";
import { Button, ButtonGroup, ListGroup } from "react-bootstrap";

export class RecordsList extends React.Component {
  static propTypes = {
    records: PropTypes.arrayOf(recordType).isRequired,
  };

  render() {
    return (
      <ListGroup>
        {this.props.records.map((record, i) => (
          <Record key={i} record={record} />
        ))}
      </ListGroup>
    );
  }
}

class Record extends React.Component {
  static propTypes = {
    record: recordType.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
    };
  }

  handleHarvest = async () => {
    const { record } = this.props;
    try {
      const archive = await api.harvest(record.source, record.recid);
      // TODO: show the new archive to the user
      console.log(archive);
    } catch (e) {
      sendNotification("Error while harvesting", e.message);
    }
  };

  toggleCollapse = () => {
    this.setState((state) => ({
      collapsed: !state.collapsed,
    }));
  };

  render() {
    const { record } = this.props;
    const { collapsed } = this.state;

    let details = null;
    if (!collapsed) {
      details = (
        <div>
          {record.authors.map((author, i) => (
            <small className="me-3 d-inline-block" key={i}>
              {author}
            </small>
          ))}
        </div>
      );
    }

    const detailsButton = (
      <Button
        active={!collapsed}
        variant="outline-primary"
        onClick={this.toggleCollapse}
        title="Show details"
      >
        <i className="bi-info-lg" />
      </Button>
    );

    const harvestButton = (
      <Button
        variant="outline-primary"
        onClick={this.handleHarvest}
        title="Harvest"
      >
        <i className="bi-cloud-download" />
      </Button>
    );

    const sourceURLButton = (
      <Button
        variant="outline-primary"
        href={record.url}
        title="Source URL"
        target="_blank"
      >
        <i className="bi-box-arrow-up-right" />
      </Button>
    );

    return (
      <ListGroup.Item>
        <div className="d-flex justify-content-between">
          <div className="fw-bold me-3 align-self-center">{record.title}</div>
          <ButtonGroup size="sm" className="text-nowrap align-self-center">
            {detailsButton}
            {harvestButton}
            {sourceURLButton}
          </ButtonGroup>
        </div>
        {details}
      </ListGroup.Item>
    );
  }
}
