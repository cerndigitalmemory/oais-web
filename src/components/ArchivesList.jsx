import React from "react";

export class ArchivesList extends React.Component {
  render() {
    return (
      <table className="archive-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Record</th>
            <th>Creator</th>
            <th>Creation Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {this.props.archives.map((archive, i) => (
            <Archive key={i} archive={archive} />
          ))}
        </tbody>
      </table>
    );
  }
}

const STATUS = [
  "",
  /* 1 */ "Pending",
  /* 2 */ "In progress",
  /* 3 */ "Failed",
  /* 4 */ "Completed",
];

class Archive extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}
  render() {
    const { archive } = this.props;
    return (
      <tr className="archive-table-row">
        <td>{archive.id}</td>
        <td>
          {archive.record.recid} ({archive.record.source})
        </td>
        <td>{archive.creator.username}</td>
        <td>{archive.creation_date}</td>
        <td className="center-col">{STATUS[archive.status]}</td>
      </tr>
    );
  }
}
