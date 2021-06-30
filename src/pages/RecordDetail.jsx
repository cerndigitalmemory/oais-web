import { api } from "@/api.js";
import { ArchivesList } from "@/components/ArchivesList.jsx";
import React from "react";

export class RecordDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      record: {},
      archives: [],
    };
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    api.record(id).then((record) => {
      this.setState({
        record: record,
      });
    });
    api.archivesByRecord(id).then((res) => {
      this.setState({
        archives: res.results,
      });
    });
  }

  render() {
    const { record, archives } = this.state;
    return (
      <React.Fragment>
        <h1>Record {record.id}</h1>
        <h2>
          Record {record.recid} from {record.source}
        </h2>
        <ArchivesList archives={archives} />
      </React.Fragment>
    );
  }
}
