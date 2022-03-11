import { api } from '@/api.js';
import { PaginatedRecordsList } from '@/pages/StagedRecords/PaginatedStagedRecordsList.jsx';
import React from 'react';
import { sendNotification } from '@/utils.js';
import { Loader } from 'semantic-ui-react';
import { AppContext } from '@/AppContext.js';
import { Storage } from '@/storage.js';

/**
 * This page is the staging area for archives.
 * It provides a "temporary" (staging) area to prepare / allow the user to select
 * records and apply them tags/collections.
 *
 */
export class StagedRecords extends React.Component {
  static contextType = AppContext.Context;
  constructor(props) {
    super(props);
    this.state = {
      records: [],
      detailedRecords: [],
      totalRecords: 0,
      loading: true,
      page: 1,
      totalArchives: 0,
    };
    this.updateAll = this.updateAll.bind(this);
  }

  getDetailedRecords = (records) => api.getCheckRecordsArchived(records);

  loadRecords = async (page = 1) => {
    const records = Storage.getAllRecords();
    const { user } = this.context;
    try {
      if (records) {
        const detailedResponse = await this.getDetailedRecords(records);
        this.setState({
          records: detailedResponse,
          totalRecords: records.length,
        });
      }
    } catch (e) {
      sendNotification('Error while fetching records', e.message);
    }
  };

  componentDidMount() {
    this.loadRecords();
    this.setState({ loading: false });
  }

  updateAll = () => {
    this.setState({ loading: true });
    this.loadRecords();
    this.setState({ loading: false });
  };

  render() {
    const { user } = this.context;
    const { loading, page, totalRecords, records } = this.state;

    let loadingMessage;
    if (loading) {
      loadingMessage = <Loader inverted>Loading</Loader>;
    } else {
      loadingMessage = <p> No staged records</p>;
    }

    return (
      <React.Fragment>
        <h1>Staged Records</h1>
        In this page you can review all the records you selected until now. <br></br>

        You add or create tags to organize them or remove them from the queue. You will also see if the selected record is already in the system. <br></br>
        If you want to add more records, go back to the <b>Add Resource</b> page. <br></br>
        Once your&apos;re happy, click Next to proceed with the creation of Archives. <br></br><br></br>
        {loading || totalRecords == 0 ? (
          <div> {loadingMessage} </div>
        ) : (
          <PaginatedRecordsList
            records={records}
            onRecordUpdate={this.updateAll}
            totalRecords={totalRecords}
            page={page}
          />
        )}
      </React.Fragment>
    );
  }
}
