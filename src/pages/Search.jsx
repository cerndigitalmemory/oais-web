import { api } from "@/api.js";
import { RecordsList } from "@/components/RecordsList.jsx";
import { sendNotification } from "@/utils.js";
import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";

export class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
    };
  }

  handleSearch = async (source, query) => {
    try {
      const results = await api.search(source, query);
      this.setState({ results });
    } catch (e) {
      sendNotification("Error while searching", e.message);
    }
  };

  render() {
    return (
      <React.Fragment>
        <h1>Search</h1>
        <SearchForm
          sources={["cds-test", "cds"]}
          onSearch={this.handleSearch}
        />
        <RecordsList records={this.state.results} />
      </React.Fragment>
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
  }

  handleQueryChange = (event) => {
    this.setState({ query: event.target.value });
  };

  handleSourceChange = (event) => {
    this.setState({ source: event.target.value });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.onSearch(this.state.source, this.state.query);
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit} className="mb-3">
        <Row>
          <Col xs="12" lg="7">
            <Form.Group as={Row} className="mb-3" controlId="formQuery">
              <Form.Label column xs="2" lg="auto">
                Query
              </Form.Label>
              <Col>
                <Form.Control
                  type="text"
                  value={this.state.query}
                  onChange={this.handleQueryChange}
                />
              </Col>
            </Form.Group>
          </Col>

          <Col xs="12" lg="3">
            <Form.Group as={Row} className="mb-3" controlId="formSource">
              <Form.Label column xs="2" lg="auto">
                Source
              </Form.Label>
              <Col>
                <Form.Select
                  value={this.state.source}
                  onChange={this.handleSourceChange}
                >
                  {this.props.sources.map((source) => (
                    <option key={source} value={source}>
                      {source}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Form.Group>
          </Col>

          <Col xs="12" lg="2" className="text-center">
            <Button type="submit">Search</Button>
          </Col>
        </Row>
      </Form>
    );
  }
}
