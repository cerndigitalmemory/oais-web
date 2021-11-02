import { api } from "@/api.js";
import { archiveType, recordType } from "@/types.js";
import { sendNotification } from "@/utils.js";
import PropTypes from "prop-types";
import React from "react";
import { List, Button } from 'semantic-ui-react';

export class RecordsList extends React.Component {
  static propTypes = {
    records: PropTypes.arrayOf(recordType).isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      checkedList: [],
    };
    this.recordElement = Array(this.props.records.length).fill(0).map(() => React.createRef());
  }

  componentDidUpdate(prevProps) {
    if (this.props.records != prevProps.records) {
      this.removeAll();
      this.recordElement = Array(this.props.records.length).fill(0).map(() => React.createRef());
    }
  }

  autoArchive = async (checkedRecord) => {
    try {
      const archive = await api.harvest(checkedRecord.source, checkedRecord.recid);
      // const updatedArchive = await api.approveArchive(archive.id);
      this.recordElement.map((el) => {
        if (checkedRecord.recid == el.current.props.record.recid) {
          el.current.state.archive = archive;
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
    this.state.checkedList.map((checkedRecord) => {
      if (checkedRecord == record) {
        const checkedList = this.state.checkedList.filter((item) => item != record);
        this.setState({ checkedList });
      }
    })
  }

  removeAll = () => {
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

        <List celled>
        {this.props.records.length > 0 ? 
         <List.Header>
          < div className="d-flex align-items-start">
            <div className="fw-bold align-self-center me-auto text-primary">Title</div>
            <div className="fw-bold mx-1 align-self-center text-primary">Record ID</div>
            <div className="fw-bold mx-1 align-self-center text-primary">Actions</div>
          </div>
       </List.Header>
        : null }
        {this.props.records.map((record, i) => (
          <Record key={i} record={record} checkRecordAdd={this.checkRecordAdd} checkRecordRemove={this.checkRecordRemove} ref={this.recordElement[i]} />
        ))}{archiveButton}
      </List>
      
    );
  }
}

class Record extends React.Component {
  static propTypes = {
    record: recordType.isRequired,
    checkRecordAdd: PropTypes.func.isRequired,
    checkRecordRemove: PropTypes.func.isRequired,
  };

  state = {
    collapsed: true,
    checked: false,
    archive: null,
  };

  toggleChecked = () => {
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
      <List.Item>
        <div className="d-flex align-items-start">
          <div className="fw-bold align-self-center me-auto">{record.title}</div>
          <div className="fw-bold mx-3 align-self-center">{record.recid}</div>
          <RecordActions
            {...{ record, archive, collapsed, checked }}
            handleHarvest={this.handleHarvest}
            toggleCollapse={this.toggleCollapse}
            toggleChecked={this.toggleChecked}
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
      </List.Item>
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
      <div className="text-nowrap align-self-center">
         <Button.Group basic size='small'>
          {detailsButton}
          {sourceURLButton}
         </Button.Group>
        {checkButton}
      </div>
    );
  }
}
