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
    addRecord: PropTypes.func.isRequired,
    removeRecord: PropTypes.func.isRequired,
    removeAll: PropTypes.func.isRequired,
    checkAll: PropTypes.func.isRequired,
    checkedList: PropTypes.arrayOf(recordType).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      archivedList: null,
    }
  }

  componentDidUpdate(prevProps) {
    /* 
      Each time the component updates if there is a change of state, 
      clear all the records from the checkedList and re-create the references to each record
    */
    if (this.props.records != prevProps.records) {
      this.props.removeAll();
    }
  }

  autoArchive = async (checkedRecord) => {
    try {
      await api.harvest(checkedRecord.source, checkedRecord.recid);
      console.log("Record ", checkedRecord.recid, " archived successfully");
    } catch (e) {
      sendNotification("Error while archiving", e.message);
    }
  }

  handleArchiveButtonClick = async () => {
    if (this.props.checkedList.length === 0) {
      sendNotification("There are no records checked")
    } else {
      this.setState({archivedList : this.props.checkedList})
      this.props.checkedList.map((checkedRecord) => {
        this.autoArchive(checkedRecord);
      })
    }
    this.props.removeAll();

  };

  handleCheckAll = () => {
    this.props.checkAll(this.props.records);
  }

  handleRemoveAll = () => {
    this.props.removeAll();
  }

  printList = () => {
    console.log(this.props.checkedList)
  }

  render() {
    const archiveButton = (
      <div>
        <Button variant="primary" onClick={this.handleArchiveButtonClick}>Archive Selected</Button>
        <Button color="red" onClick={this.handleRemoveAll}>Remove all</Button>
        <Button color="green" onClick={this.handleCheckAll}>Add all</Button>
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
            <Record key={i} record={record} checkRecordAdd={this.props.addRecord} checkRecordRemove={this.props.removeRecord} checkedList = {this.props.checkedList} archivedList={this.state.archivedList}/>
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
    checkedList: PropTypes.arrayOf(recordType).isRequired,
    archivedList: PropTypes.arrayOf(recordType),
  };


  constructor(props) {
    super(props);
    this.state = {
      collapsed: true,
      checked: false,
      archived: false,
      archive: null,
    };
  }

  componentDidUpdate(prevProps) {
    /* 
      Each time the component updates if there is a change of state, 
      clear the archive state from all records.
    */
    if (this.state.archive != prevProps.archive) {
      this.setState({archive: null});
    }
    /* 
      Each time the component updates if there is a change of state, 
      and if the record id is in the checkedList then toogle checked status to true.
      If it is not in the list toogle status to false
    */
    if (prevProps.checkedList != this.props.checkedList) {
      let checked = false;
      this.props.checkedList.map((checkedItem) => {
        if (checkedItem.recid === this.props.record.recid){
          checked = true;
        }
      }
      
    )
    this.setState({checked: checked})
    }
    /* 
      Each time the component updates if there is a change of state, 
      and if the record id is in the archivedList then toogle checked status to true.
      If it is not in the list toogle status to false
    */
    if (prevProps.archivedList != this.props.archivedList) {
      let archived = false;
      this.props.archivedList.map((archivedItem) => {
        if (archivedItem.recid === this.props.record.recid){
          archived = true;
        }
      }
      
    )
    this.setState({archived: archived})
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


  toggleCollapse = () => {
    this.setState((state) => ({
      collapsed: !state.collapsed,
    }));
  };

  render() {
    const { record } = this.props;
    const { collapsed, archive, checked, archived } = this.state;

    return (

      <Table.Row>
        <Table.Cell textAlign="left"><b>{record.title}</b></Table.Cell>
        <Table.Cell textAlign="right">{record.recid}</Table.Cell>
        <Table.Cell textAlign="right"><RecordActions
            {...{ record, archive, collapsed, checked, archived }}
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
    archived: PropTypes.bool.isRequired,
    collapsed: PropTypes.bool.isRequired,
    checked: PropTypes.bool,
    toggleCollapse: PropTypes.func.isRequired,
    toggleChecked: PropTypes.func.isRequired,
  };


  render() {
    const { record, archived, collapsed, checked } = this.props;
    const { toggleCollapse, toggleChecked } = this.props;

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
    if(archived == false){
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
          icon = 'check'
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
