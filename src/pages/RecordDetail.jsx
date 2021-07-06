import { api } from "@/api.js";
import { ArchivesList } from "@/components/ArchivesList.jsx";
import { Pagination } from "@/components/Pagination.jsx";
import React from "react";

export class RecordDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: {},
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    api.record(id).then((record) => {
      this.setState({
        record: record,
      });
    });
  }

  render() {
    const { record } = this.state;
    return (
      <React.Fragment>
        <h1>Record {record.id}</h1>
        <h2>
          Record {record.recid} from {record.source}
        </h2>
        <Pagination
          data={(page) => api.archivesByRecord(record.id, page)}
          render={({ results }) => <ArchivesList archives={results} />}
        />
      </React.Fragment>
    );
  }
}
