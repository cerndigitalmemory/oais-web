import _ from 'lodash';
import React from "react";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import PropTypes from "prop-types";
import {
    Button,
    Form,
    Input,
    Checkbox,
    Grid,
    GridColumn,
  } from 'semantic-ui-react';

/* 
  HarvestRedirect page is displayed at /add-resource page. 
  It shows the search component as in the Harvest page but instead of performing the search,
  it updates the redux state and redirects to the Harvest page to show the results.
*/
class HarvestRedirect extends React.Component {

  state = {
    results: null,
    isRedirect: false,
    activePage: 1,
    totalNumHits: null,
    hitsPerPage: 20,
  };

  handleQueryChange = (query) => {
    // Changes the value of the query state (redux)
    this.props.setQuery(query);
  }

  handleSourceChange = (source) => {
    // Changes the value of the source state (redux)
    this.props.setSource(source);
  }

  handleSearchByIdChange = (searchById) => {
    // Changes the value of the searchByID state (redux)
    this.props.setID(searchById);
  }

  handleRedirect = async () => {
    // Handles the redirect state to the Harvest page
    this.setState({ isRedirect: true});
  };


  render() {
    const { isRedirect } = this.state;
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
      </React.Fragment>
    );
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
    // Handles the isRedirect state
    event.preventDefault();
    this.props.onSearch();
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
