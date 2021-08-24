import { api } from "@/api.js";
import { RecordsList } from "@/components/RecordsList.jsx";
import { sendNotification } from "@/utils.js";
import PropTypes from "prop-types";
import React from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import Pagination from 'react-bootstrap/Pagination'

export class Search extends React.Component {
  state = {
    results: [],
    isLoading: false,
    source: "",
    query: "",
    active_page: 1,
  };

  handleSearch = async (source, query, page=1) => {
    this.setState({ isLoading: true });
    this.setState({ active_page: Number(page) });
    try {
      const results = await api.search(source, query, page);
      this.setState({ results });
    } catch (e) {
      sendNotification("Error while searching", e.message);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleQueryChange = (query) => {
    this.setState({ query: query });
  }

  handleSourceChange = (source) => {
    this.setState({ source: source });
  }

  render() {
    const { isLoading, results } = this.state;
    return (
      <React.Fragment>
        <h1>Search</h1>
        <SearchForm
          sources={["cds-test", "cds", "zenodo", "inveniordm", "cod"]}
          onSearch={this.handleSearch}
          isLoading={isLoading}
          onQueryChange={this.handleQueryChange}
          onSourceChange={this.handleSourceChange}
        />
        <Pages 
          onSearch={this.handleSearch}
          source={this.state.source}
          query={this.state.query}
          hasResults={results && results.length > 0}
          active_page={this.state.active_page}
        />
        <RecordsList records={results} />
      </React.Fragment>
    );
  }
}

export class Pages extends React.Component {
  static propTypes = {
    onSearch: PropTypes.func.isRequired,
    query: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    hasResults : PropTypes.bool.isRequired,
    active_page : PropTypes.number.isRequired,
  };
  
  constructor(props) {
    super(props);
  }

  handleNextPage = (event) => {
    event.preventDefault();
    this.props.onSearch(this.props.source, this.props.query, event.target.id);
  };

  render() {
    let items = [];
    for (let number = 1; number <= 10; number++) {
      items.push(
        <Pagination.Item key={number} id={number}
        active={number == this.props.active_page} 
        onClick={this.handleNextPage}>
          {number}
        </Pagination.Item>,
      );
    }

    return (
      <div>
        {this.props.hasResults || this.props.active_page > 1 ? <Pagination>{items}</Pagination> : null}
      </div>
    );
  }

}

export class SearchForm extends React.Component {
  static propTypes = {
    sources: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSearch: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    onQueryChange: PropTypes.func.isRequired,
    onSourceChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      query: "",
      source: props.sources[0],
    };
  }

  handleQueryChange = (event) => {
    this.props.onQueryChange(event.target.value );
    this.setState({ query: event.target.value });
  };

  handleSourceChange = (event) => {
    this.props.onSourceChange(event.target.value );
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
