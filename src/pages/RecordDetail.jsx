import { api } from "@/api.js";
import { PaginatedArchivesList } from "@/components/PaginatedArchivesList.jsx";
import React from "react";

export class RecordDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: {},
    };
  }

  async componentDidMount() {
    const { id } = this.props.match.params;
    const record = await api.record(id);
    this.setState({ record });
  }

  render() {
    const { id } = this.props.match.params;
    const { record } = this.state;
    return (
      <React.Fragment>
        <h1>Record {record.id}</h1>
        <h2>
          Record {record.recid} from {record.source}
        </h2>
        <PaginatedArchivesList
          getArchives={(page) => api.archivesByRecord(id, page)}
        />
      </React.Fragment>
    );
  }
}
