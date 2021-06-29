import { api } from "@/api.js";
import React from "react";

export class RecordsList extends React.Component {
  render() {
    return (
      <div className="records-list">
        {this.props.records.map((x, i) => (
          <Record key={i} record={x} />
        ))}
      </div>
    );
  }
}

class Record extends React.Component {
  constructor(props) {
    super(props);
    this.handleHarvest = this.handleHarvest.bind(this);
  }
  get record() {
    return this.props.record;
  }

  handleHarvest() {
    api
      .harvest(this.record.source, this.record.recid)
      .then((res) => console.log(res));
  }

  render() {
    return (
      <div className="record">
        <div className="record-title">
          <a href={this.record.url}>{this.record.title}</a>
        </div>
        <div className="record-authors">
          {this.record.authors.map((author, i) => (
            <span key={i} className="record-author">
              {author}
            </span>
          ))}
        </div>
        <div className="record-actions">
          <button onClick={this.handleHarvest}>Harvest</button>
        </div>
      </div>
    );
  }
}
