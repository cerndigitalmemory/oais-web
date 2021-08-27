import { api } from "@/api.js";
import { RecordsList } from "@/components/RecordsList.jsx";
import { sendNotification } from "@/utils.js";
import PropTypes from "prop-types";
import React from "react";
import { Button, Col, Form, Row, Spinner, ButtonGroup, ToggleButton } from "react-bootstrap";
import { SearchPagination } from "@/components/SearchPagination.jsx";

export class Search extends React.Component {
  state = {
    results: null,
    isLoading: false,
    source: "",
    query: "",
    activePage: 1,
    totalNumHits: null,
    hitsPerPage: 20,
    searchById: false,
  };

  handleSearch = async (source, query, page=1, size=20) => {
    this.setState({ isLoading: true, 
                    activePage: Number(page), 
                    hitsPerPage: Number(size) });
    try {
      if(this.state.searchById){
        const response = await api.search_by_id(source, query);
        this.setState({ results : response.result,
                        totalNumHits : response.result.length });
      } else {
        const response = await api.search(source, query, page, size);
        this.setState({ results : response.results,
                        totalNumHits : Number(response.total_num_hits) });
      }
    } catch (e) {
      sendNotification("Error while searching", e.message);
    } finally {
      this.setState({ isLoading: false });
    }
  };

  handleQueryChange = (query) => {
    this.setState({ query });
  }

  handleSourceChange = (source) => {
    this.setState({ source });
  }

  handleSearchByIdChange = (searchById) => {
    this.setState({ searchById });
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
          hitsPerPage={this.state.hitsPerPage}
          onSearchByIdChange={this.handleSearchByIdChange}
        />
        <div className="d-flex justify-content-between">
          <SearchPagination 
            onSearch={this.handleSearch}
            source={this.state.source}
            query={this.state.query}
            hasResults={results != null && results.length > 0}
            activePage={this.state.activePage}
            totalNumHits={this.state.totalNumHits}
            hitsPerPage={this.state.hitsPerPage}
          />
          <SizeRadio
            onSearch={this.handleSearch}
            source={this.state.source}
            query={this.state.query}
            hasResults={results != null && results.length > 0}
            hitsPerPage={this.state.hitsPerPage}
          />
        </div>

        { this.state.results == null ?
          null : 
          ( this.state.results.length > 0 ?
            <RecordsList records={results} /> :
            <p>No results found.</p>)
        }
      </React.Fragment>
    );
  }
}

export class SizeRadio extends React.Component {
  static propTypes = {
    hitsPerPage: PropTypes.number.isRequired,
    onSearch: PropTypes.func.isRequired,
    query: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    hasResults : PropTypes.bool.isRequired,
  };

  sizeChange = (event) => {
    event.preventDefault();
    this.props.onSearch(this.props.source, this.props.query, 1, event.target.value)
  }

  render() {
    let sizeOptions = [10,20,50]

    return(
      this.props.hasResults ?
      <div className="align-self-center mb-3">
        <span className="me-3">Results per page: </span>
        <ButtonGroup size="sm" className="text-nowrap align-self-center">
        {
            sizeOptions.map((size, idx) => (
              <ToggleButton
              key={idx}
              id={`size-${idx}`}
              type="radio"
              variant="outline-primary"
              name="radio"
              value={size}
              checked={size === this.props.hitsPerPage}
              onChange={this.sizeChange}
            >
              {size}
            </ToggleButton>
            ))
        }
        </ButtonGroup>
      </div> : null 
    )
  }
}

export class SearchForm extends React.Component {
  static propTypes = {
    sources: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSearch: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
    onQueryChange: PropTypes.func.isRequired,
    onSourceChange: PropTypes.func.isRequired,
    hitsPerPage: PropTypes.number.isRequired,
    onSearchByIdChange: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      query: "",
      source: props.sources[0],
      searchById: false,
    };
  }

  handleQueryChange = (event) => {
    this.props.onQueryChange(event.target.value);
    this.setState({ query: event.target.value });
  };

  handleSourceChange = (event) => {
    this.props.onSourceChange(event.target.value);
    this.setState({ source: event.target.value });
  };

  handleCheckboxChange = (event) => {
    this.props.onSearchByIdChange(event.target.checked);
    this.setState({ searchById: event.target.checked});
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if(this.state.searchById){
      this.props.onSearch(this.state.source, this.state.query);
    } else {
      this.props.onSearch(this.state.source, this.state.query, 1, this.props.hitsPerPage);
    }
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
          <Col xs="12" lg="4" xl="5">
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

          <Col xs="12" lg="3" xl="2">
            <Form.Group as={Row} className="ps-2 my-2" controlId="formCheckbox">
              <Form.Check 
                type="checkbox" 
                label="Search by Record ID"
                onChange={this.handleCheckboxChange} />
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
