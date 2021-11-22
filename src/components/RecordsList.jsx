import { api } from "@/api.js";
import { archiveType, recordType } from "@/types.js";
import { sendNotification } from "@/utils.js";
import PropTypes from "prop-types";
import React from "react";
import { Button, Table } from 'semantic-ui-react';

export class RecordsList extends React.Component {
  /* 
    Shows the results of the Harvest search including the available actions
  */

  static propTypes = {
    records: PropTypes.arrayOf(recordType).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      // CheckedList is a list of all the selected-to-archive records
      checkedList: [],
    };
    // Creates a reference for each result record in order to access each record state and perform actions.
    this.recordElement = Array(this.props.records.length).fill(0).map(() => React.createRef());
  }

  componentDidUpdate(prevProps) {
    /* 
      Each time the component updates if there is a change of state, 
      clear all the records from the checkedList and re-create the references to each record
    */
    if (this.props.records != prevProps.records) {
      this.removeAll();
      this.recordElement = Array(this.props.records.length).fill(0).map(() => React.createRef());
    }
  }

  autoArchive = async (checkedRecord) => {
    try {
      const archive = await api.harvest(checkedRecord.source, checkedRecord.recid);
      this.recordElement.map((el) => {
        if (checkedRecord.recid == el.current.props.record.recid) {
          el.current.state.archive = archive;
          console.log(archive);
        }      
      })
      console.log("Record ", checkedRecord.recid, " archived successfully");
    } catch (e) {
      sendNotification("Error while archiving", e.message);
    }
  }

  handleArchiveButtonClick = async () => {
    if (this.state.checkedList.length === 0) {
      sendNotification("There are no records checked")
    } else {
      this.state.checkedList.map((checkedRecord) => {
        this.autoArchive(checkedRecord);
      })
    }
    this.removeAll();

  };

  checkRecordAdd = async (record) => {
    /*
      Checks if a record is in the checkedList and if not it appends it
    */
    if (this.state.checkedList.length == 0) {
      const checkedList = [record]
      this.setState({ checkedList })
    } else {
      this.state.checkedList.map((checkedRecord) => {
        if (checkedRecord == record) {
          console.log(record, " already in the list")
        } else {
          const checkedList = this.state.checkedList.concat(record);
          this.setState({ checkedList })
        }
      })
    }
  };

  checkRecordRemove = async (record) => {
    /*
      When a record is unchecked, it removes it from the checkedList
    */
    this.state.checkedList.map((checkedRecord) => {
      if (checkedRecord == record) {
        const checkedList = this.state.checkedList.filter((item) => item != record);
        this.setState({ checkedList });
      }
    })
  }

  removeAll = () => {
    /*
      Removes all records from the checklist
    */
    this.recordElement.map((el) => {
      try {
        el.current.state.checked = false;
      } catch {
        console.log("Record removed");
      }
    })
    const checkedList = [];
    this.setState({ checkedList });
  }

  checkAll = () => {
    /* 
      For all the records, checks if it is in the checkedList and if not, it adds it 
    */
    let checkedList = []
    this.recordElement.map((el) => {
      if (!el.current.state.archive) {
        el.current.state.checked = true;
        checkedList.push(el.current.props.record)
      }
    })
    this.setState({ checkedList });
  }

  printList = () => {
    console.log(this.state.checkedList)
  }

  render() {
    const archiveButton = (
      <div>
        <Button variant="primary" onClick={this.handleArchiveButtonClick}>Archive Selected</Button>
        <Button color="red" onClick={this.removeAll}>Remove all</Button>
        <Button color="green" onClick={this.checkAll}>Add all</Button>
        <Button variant="secondary" onClick={this.printList}>Print list</Button>
      </div>

    );

    return (
      <div>
      <Table>
        {this.props.records.length > 0 ? 
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell width="12">Title</Table.HeaderCell>
            <Table.HeaderCell width="2" textAlign="right">Record ID</Table.HeaderCell>
            <Table.HeaderCell width="2" textAlign="center">Actions</Table.HeaderCell>
          </Table.Row>
        </Table.Header>: null }
        <Table.Body>
        {this.props.records.map((record, i) => (
            <Record key={i} record={record} checkRecordAdd={this.checkRecordAdd} checkRecordRemove={this.checkRecordRemove} ref={this.recordElement[i]} />
          ))}
        </Table.Body>
      </Table>
      {archiveButton}
      </div>
      
    );
  }
}

class Record extends React.Component {
  static propTypes = {
    record: recordType.isRequired,
    checkRecordAdd: PropTypes.func.isRequired,
    checkRecordRemove: PropTypes.func.isRequired,
  };


  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      checked: false,
      archive: null,
    };
  }

  componentDidUpdate(prevProps) {
    // If the component is updated change the archive status to null
    if (this.state.archive != prevProps.archive) {
      this.state.archive = null;
    }
  }


  toggleChecked = () => {
    // Handles the check/uncheck of a record
    const { record } = this.props;
    const { checkRecordAdd } = this.props;
    const { checkRecordRemove } = this.props;
    this.setState((state) => ({
      checked: !state.checked,
    }));
    if (!this.state.checked) {
      checkRecordAdd(record);
    } else {
      checkRecordRemove(record);
    }
  };


  handleHarvest = async () => {
    // Handles the archive request of a record
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
    const { collapsed, archive, checked } = this.state;

    return (

      <Table.Row>
        <Table.Cell textAlign="left"><b>{record.title}</b></Table.Cell>
        <Table.Cell textAlign="right">{record.recid}</Table.Cell>
        <Table.Cell textAlign="right"><RecordActions
            {...{ record, archive, collapsed, checked }}
            handleHarvest={this.handleHarvest}
            toggleCollapse={this.toggleCollapse}
            toggleChecked={this.toggleChecked}
          /></Table.Cell>
      </Table.Row>

    );
  }
}

class RecordActions extends React.Component {
  static propTypes = {
    record: recordType.isRequired,
    archive: archiveType,
    collapsed: PropTypes.bool.isRequired,
    checked: PropTypes.bool,
    toggleCollapse: PropTypes.func.isRequired,
    handleHarvest: PropTypes.func.isRequired,
    toggleChecked: PropTypes.func.isRequired,
  };


  render() {
    const { record, archive, collapsed, checked } = this.props;
    const { toggleCollapse, handleHarvest, toggleChecked } = this.props;

    const detailsButton = (
      <Button
        active={!collapsed}
        variant="outline-primary"
        onClick={toggleCollapse}
        title="Show details"
        icon='info'
      />
    );

    let checkButton;
    if(!archive){
      if(checked){
        checkButton = (
        <Button
          circular
          color='olive' 
          icon = 'check'
          onClick={toggleChecked}
          title="Check"
        />);
      } else {
          checkButton = (
            <Button
              circular
              basic
              color='olive' 
              icon = 'check'
              onClick={toggleChecked}
              title="Check"
            />
    
          );
        }
    } else {
      checkButton = (
        <Button
          circular
          basic
          color='olive' 
          icon = 'check'
          onClick={toggleChecked}
          title="Check"
          disabled
        />);
    }
  



    const sourceURLButton = (
      <Button
        href={record.url}
        title="Source URL"
        target="_blank"
        icon='globe'
      />
    );

    return (
      <div>
         <Button.Group basic size='small'>
          {detailsButton}
          {sourceURLButton}
         </Button.Group>
        {checkButton}
      </div>
    );
  }
}
