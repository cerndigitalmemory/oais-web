import React from "react";
import { api } from "@/api.js";
import { RecordsList } from "@/components/RecordsList.jsx";

export class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
    };

    this.handleSearch = this.handleSearch.bind(this);
  }

  handleSearch(source, query) {
    api.search(source, query).then((res) => {
      this.setState({ results: res });
    });
  }

  render() {
    return (
      <div>
        <SearchForm
          sources={["cds-test", "cds"]}
          onSearch={this.handleSearch}
        />
        <RecordsList records={this.state.results} />
      </div>
    );
  }
}

export class SearchForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      query: "",
      source: props.sources[0],
    };

    this.handleQueryChange = this.handleQueryChange.bind(this);
    this.handleSourceChange = this.handleSourceChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleQueryChange(event) {
    this.setState({ query: event.target.value });
  }

  handleSourceChange(event) {
    this.setState({ source: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.onSearch(this.state.source, this.state.query);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Query:
          <input
            type="text"
            value={this.state.query}
            onChange={this.handleQueryChange}
          />
        </label>
        <label>
          Source:
          <select value={this.state.source} onChange={this.handleSourceChange}>
            {this.props.sources.map((source, i) => (
              <option key={i} value={source}>
                {source}
              </option>
            ))}
          </select>
        </label>
        <input type="submit" value="Search" />
      </form>
    );
  }
}
