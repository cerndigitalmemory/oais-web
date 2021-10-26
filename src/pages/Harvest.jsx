import { api } from "@/api.js";
import { RecordsList } from "@/components/RecordsList.jsx";
import { sendNotification } from "@/utils.js";
import _ from 'lodash';
import PropTypes from "prop-types";
import React from "react";
import {
    Button,
    Form,
    Input,
    Checkbox,
    Grid,
    GridColumn,
  } from 'semantic-ui-react'
import { SearchPagination } from "@/components/SearchPagination.jsx";

export class Harvest extends React.Component {
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
    print(this.state.searchById);
  }

  render() {
    const { isLoading, results } = this.state;
    return (
      <React.Fragment>
        <h1>Harvest</h1>
        <p>Create SIP packages from the supported digital repositories (uses Bagit Create tool)</p>
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

  sizeChange = (event, {value}) => {
    event.preventDefault();
    this.props.onSearch(this.props.source, this.props.query, 1, value);
    
  }

  render() {
    let sizeOptions = [10,20,50]

    return(
      this.props.hasResults ?
      <div className="align-self-center mb-3">
        <span className="me-3">Results per page: </span>
        <Button.Group size="small">
        {
            sizeOptions.map((size, idx) => (
              <Button
              key={idx}
              value={size}
              checked={size === this.props.hitsPerPage}
              onChange={this.sizeChange}
            >
              {size}
            </Button>
            ))
        }
        </Button.Group>
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

  handleSourceChange = (event, {value}) => {
    this.props.onSourceChange( value );
    this.setState({ source: value });
  };

  handleCheckboxChange = () => {
    this.props.onSearchByIdChange();
    this.setState({ searchById: !this.state.searchById});
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
    const sourceOptions = _.map(this.props.sources, (source) => ({
      key: source,
      text: source,
      value: source,
    }));   


    let submitButton;
    if (isLoading) {
      // if the search is already in progress, show a spinner
      submitButton = (
        <Button loading primary>
            Loading
        </Button>
      );
    } else {
      submitButton = <Button primary>Search</Button>;
    }

    return (
        
        <Form onSubmit={this.handleSubmit}> 
          <Grid>
            <Grid.Row columns={4}>
              <Grid.Column width={6} verticalAlign='middle'>
                    <Form.Field 
              
                        control={Input}
                        value={this.state.query}
                        onChange={this.handleQueryChange}
                        label='Query'
                        placeholder='Query'
                    />
              </Grid.Column>
              <GridColumn verticalAlign='bottom' width={2}>
                    <Form.Field>              
                      <Checkbox 
                        label='Search Record by ID'
                        onChange={this.handleCheckboxChange}/>
                    </Form.Field>
                </GridColumn>
                <Grid.Column verticalAlign='bottom'>
                    < Form.Select
                    label='Source'
                    onChange={this.handleSourceChange}
                    options={sourceOptions}
                />
                </Grid.Column>
                <GridColumn verticalAlign='bottom' floated='right'>
                {submitButton}
               </GridColumn>
            </Grid.Row>
          </Grid>
        </Form>
    );
  }
}
