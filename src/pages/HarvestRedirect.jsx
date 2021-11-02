import { api } from "@/api.js";
import { RecordsList } from "@/components/RecordsList.jsx";
import { sendNotification } from "@/utils.js";
import _ from 'lodash';
import React from "react";
import { SearchPagination } from "@/components/SearchPagination.jsx";
import { connect } from 'react-redux';
import { Link, Redirect } from 'react-router-dom';
import PropTypes from "prop-types";
import {
    Button,
    Form,
    Input,
    Checkbox,
    Grid,
    GridColumn,
  } from 'semantic-ui-react';


class HarvestRedirect extends React.Component {

  state = {
    results: null,
    isRedirect: false,
    activePage: 1,
    totalNumHits: null,
    hitsPerPage: 20,
  };

  handleQueryChange = (query) => {
    this.props.setQuery(query);
  }

  handleSourceChange = (source) => {
    this.props.setSource(source);
  }

  handleSearchByIdChange = (searchById) => {
    this.props.setID(searchById);
  }

  handleRedirect = async (source, query, page=1, size=20) => {
    this.setState({ isRedirect: true});
  };


  render() {
    const { isRedirect, results } = this.state;
    return (
      <React.Fragment>
        <h1>Harvest</h1>
        <p>Create SIP packages from the supported digital repositories (uses Bagit Create tool)</p>
        <SearchForm
          sources={["cds-test", "cds", "zenodo", "inveniordm", "cod", "indico"]}
          onSearch={this.handleRedirect}
          isRedirect={isRedirect}
          onQueryChange={this.handleQueryChange.bind(this)}
          onSourceChange={this.handleSourceChange.bind(this)}
          hitsPerPage={this.state.hitsPerPage}
          onSearchByIdChange={this.handleSearchByIdChange.bind(this)}
        />
        <div className="d-flex justify-content-between">
          <SearchPagination 
            onSearch={this.handleRedirect}
            source={this.props.source}
            query={this.props.query}
            hasResults={results != null && results.length > 0}
            activePage={this.state.activePage}
            totalNumHits={this.state.totalNumHits}
            hitsPerPage={this.state.hitsPerPage}
          />
          <SizeRadio
            onSearch={this.handleRedirect}
            source={this.props.source}
            query={this.props.query}
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
    console.log("Value:", value);
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
              active={size === this.props.hitsPerPage}
              value={size}
              onClick={this.sizeChange}
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
    isRedirect: PropTypes.bool.isRequired,
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
    const { isRedirect } = this.props;
    const sourceOptions = _.map(this.props.sources, (source) => ({
      key: source,
      text: source,
      value: source,
    }));   


    let submitButton;
    if (isRedirect) {
      // if the search is already in progress, move to harvest page
      submitButton = <Redirect to="/harvest"/>;
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

const mapStateToProps = state => {
  return {
    query: state.query,
    source: state.source,
    searchById: state.searchById,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setQuery: (query) => {dispatch({ type: 'setQuery', query: query})},
    setSource: (source) => {dispatch({ type: 'setSource', source: source })},
    setID: (searchById) => {dispatch({ type: 'setID', searchById: searchById })},
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(HarvestRedirect);
