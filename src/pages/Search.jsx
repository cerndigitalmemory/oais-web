import { api } from "@/api.js";
import { RecordsList } from "@/components/RecordsList.jsx";
import { sendNotification } from "@/utils.js";
import PropTypes from "prop-types";
import React from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";

export class Search extends React.Component {
  state = {
    results: [],
    isLoading: false,
  };

  handleSearch = async (source, query) => {
    this.setState({ isLoading: true });
    try {
      const results = await api.search(source, query);
      this.setState({ results });
    } catch (e) {
      sendNotification("Error while searching", e.message);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  render() {
    const { isLoading, results } = this.state;
    return (
      <React.Fragment>
        <h1>Search</h1>
        <SearchForm
          sources={["cds-test", "cds"]}
          onSearch={this.handleSearch}
          isLoading={isLoading}
        />
        <RecordsList records={results} />
      </React.Fragment>
    );
  }
}

export class SearchForm extends React.Component {
  static propTypes = {
    sources: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSearch: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
  };

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
    const { isLoading } = this.props;

    let submitButton;
    if (isLoading) {
      // if the search is already in progress, show a spinner
      submitButton = (
        <Button type="submit" disabled>
          <Spinner as="span" animation="border" size="sm" role="status" />
        </Button>
      );
    } else {
      submitButton = <Button type="submit">Search</Button>;
    }

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
            {submitButton}
          </Col>
        </Row>
      </Form>
    );
  }
}
