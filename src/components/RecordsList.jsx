import { api } from "@/api.js";
import { archiveType, recordType } from "@/types.js";
import { sendNotification } from "@/utils.js";
import PropTypes from "prop-types";
import React from "react";
import { Button, ButtonGroup, ListGroup } from "react-bootstrap";
import { Link } from "react-router-dom";

export class RecordsList extends React.Component {
  static propTypes = {
    records: PropTypes.arrayOf(recordType).isRequired,
  };

  render() {
    return (
      <ListGroup className="mb-3">
         {this.props.records.length > 0 ? 
         <ListGroup.Item className="bg-primary">
          < div className="d-flex align-items-start">
            <div className="fw-bold align-self-center me-auto text-white">Title</div>
            <div className="fw-bold mx-3 align-self-center text-white">Record ID</div>
            <div className="fw-bold mx-3 align-self-center text-white">Actions</div>
          </div>
        </ListGroup.Item> 
        : null}
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

  state = {
    collapsed: true,
    archive: null,
  };

  handleHarvest = async () => {
    const { record } = this.props;
    try {
      const archive = await api.harvest(record.source, record.recid);
      this.setState({ archive });
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
    const { collapsed, archive } = this.state;

    return (
      <ListGroup.Item>
        <div className="d-flex align-items-start">
          <div className="fw-bold align-self-center me-auto">{record.title}</div>
          <div className="fw-bold mx-3 align-self-center">{record.recid}</div>
          <RecordActions
            {...{ record, archive, collapsed }}
            handleHarvest={this.handleHarvest}
            toggleCollapse={this.toggleCollapse}
          />
        </div>
        {!collapsed && (
          <div>
            {record.authors.map((author, i) => (
              <small className="me-3 d-inline-block" key={i}>
                {author}
              </small>
            ))}
          </div>
        )}
      </ListGroup.Item>
    );
  }
}

class RecordActions extends React.Component {
  static propTypes = {
    record: recordType.isRequired,
    archive: archiveType,
    collapsed: PropTypes.bool.isRequired,
    toggleCollapse: PropTypes.func.isRequired,
    handleHarvest: PropTypes.func.isRequired,
  };

  render() {
    const { record, archive, collapsed } = this.props;
    const { toggleCollapse, handleHarvest } = this.props;

    const detailsButton = (
      <Button
        active={!collapsed}
        variant="outline-primary"
        onClick={toggleCollapse}
        title="Show details"
      >
        <i className="bi-info-lg" />
      </Button>
    );

    let harvestButton;
    if (!archive) {
      harvestButton = (
        <Button
          variant="outline-primary"
          onClick={handleHarvest}
          title="Harvest"
        >
          <i className="bi-cloud-download" />
        </Button>
      );
    } else {
      harvestButton = (
        <Button
          variant="success"
          title="Go to archives"
          as={Link}
          to="/archives"
        >
          <i className="bi-archive" />
        </Button>
      );
    }

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
      <ButtonGroup size="sm" className="text-nowrap align-self-center">
        {detailsButton}
        {harvestButton}
        {sourceURLButton}
      </ButtonGroup>
    );
  }
}
