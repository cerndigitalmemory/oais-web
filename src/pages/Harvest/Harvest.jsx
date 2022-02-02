import { api } from '@/api.js';
import { RecordsList } from '@/pages/Harvest/RecordsList.jsx';
import { sendNotification } from '@/utils.js';
import _ from 'lodash';
import React from 'react';
import { SearchPagination } from '@/pages/Harvest/SearchPagination.jsx';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Grid } from 'semantic-ui-react';
import SearchForm from '@/pages/Harvest/HarvestSearchForm.jsx';

// Harvest page is displayed at /harvest page.
// It performs the search and displays the results through the RecordList component

class Harvest extends React.Component {
  state = {
    results: null,
    isLoading: false,
    activePage: 1,
    totalNumHits: null,
    hitsPerPage: 20,
  };

  // Changes the query state at the redux
  handleQueryChange = (query) => {
    this.props.setQuery(query);
  };

  // Changes the source state at redux
  handleSourceChange = (source) => {
    this.props.setSource(source);
  };

  // Changes the search by ID state at redux
  handleSearchByIdChange = (searchById) => {
    this.props.setID(searchById);
  };

  checkRecordAdd = (record) => {
    this.props.addRecord(record);
  };

  removeAllRecords = () => {
    this.props.removeAll();
  };

  addAllRecords = (record) => {
    this.props.addAll(record);
  };

  checkRecordRemove = (record) => {
    this.props.removeRecord(record);
  };

  // Calls the handleSearch function when the component is mounted and there is an active state from redux
  componentDidMount() {
    if (this.props.source && this.props.query) {
      this.handleSearch(this.props.source, this.props.query);
    }
  }

  // Handles the search
  handleSearch = async (source, query, page = 1, size = 20) => {
    this.setState({
      isLoading: true,
      activePage: Number(page),
      hitsPerPage: Number(size),
    });
    try {
      if (this.props.searchById) {
        const response = await api.search_by_id(source, query);
        this.setState({
          results: response.result,
          totalNumHits: response.result.length,
        });
      } else {
        const response = await api.search(source, query, page, size);
        this.setState({
          results: response.results,
          totalNumHits: Number(response.total_num_hits),
        });
      }
    } catch (e) {
      sendNotification('Error while searching', e.message);
    } finally {
      this.setState({ isLoading: false });
    }
    console.log(
      'Query: ',
      this.props.query,
      'Source:',
      this.props.source,
      'Search by ID',
      this.props.searchById
    );
  };

  render() {
    const { isLoading, results } = this.state;
    return (
      <React.Fragment>
        <h1>Harvest</h1>
        <p>
          Create SIP packages from the supported digital repositories (uses
          Bagit Create tool)
        </p>
        <SearchForm
          sources={['cds-test', 'cds', 'zenodo', 'inveniordm', 'cod', 'indico']}
          activeSource={this.props.source}
          onSearch={this.handleSearch}
          isLoading={isLoading}
          onQueryChange={this.handleQueryChange.bind(this)}
          onSourceChange={this.handleSourceChange.bind(this)}
          hitsPerPage={this.state.hitsPerPage}
          onSearchByIdChange={this.handleSearchByIdChange.bind(this)}
        />
        <div>
          <Grid columns={2} verticalAlign="middle">
            <Grid.Column>
              <SearchPagination
                onSearch={this.handleSearch}
                source={this.props.source}
                query={this.props.query}
                hasResults={results != null && results.length > 0}
                activePage={this.state.activePage}
                totalNumHits={this.state.totalNumHits}
                hitsPerPage={this.state.hitsPerPage}
              />
            </Grid.Column>
            <Grid.Column textAlign="right">
              <SizeRadio
                onSearch={this.handleSearch}
                source={this.props.source}
                query={this.props.query}
                hasResults={results != null && results.length > 0}
                hitsPerPage={this.state.hitsPerPage}
              />
            </Grid.Column>
          </Grid>
        </div>

        {this.state.results == null ? null : this.state.results.length > 0 ? (
          <RecordsList
            records={results}
            addRecord={this.checkRecordAdd}
            removeRecord={this.checkRecordRemove}
            removeAll={this.removeAllRecords}
            checkAll={this.addAllRecords}
            checkedList={this.props.checkedRecords}
          />
        ) : (
          <p>No results found.</p>
        )}
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
    hasResults: PropTypes.bool.isRequired,
  };

  sizeChange = (event, { value }) => {
    console.log('Value:', value);
    event.preventDefault();
    this.props.onSearch(this.props.source, this.props.query, 1, value);
  };

  render() {
    let sizeOptions = [10, 20, 50];

    return this.props.hasResults ? (
      <div>
        <span>Results per page: </span>
        <Button.Group size="small">
          {sizeOptions.map((size, idx) => (
            <Button
              key={idx}
              active={size === this.props.hitsPerPage}
              value={size}
              onClick={this.sizeChange}
            >
              {size}
            </Button>
          ))}
        </Button.Group>
      </div>
    ) : null;
  }
}

// Binds the redux states with this component's props
const mapStateToProps = (state) => {
  return {
    query: state.query,
    source: state.source,
    searchById: state.searchById,
    checkedRecords: state.checkedRecords,
  };
};

// Dispatches the following functions which change the redux state when called
const mapDispatchToProps = (dispatch) => {
  return {
    setQuery: (query) => {
      dispatch({ type: 'setQuery', query: query });
    },
    setSource: (source) => {
      dispatch({ type: 'setSource', source: source });
    },
    setID: (searchById) => {
      dispatch({ type: 'setID', searchById: searchById });
    },
    addRecord: (record) => {
      dispatch({ type: 'addRecord', record: record });
    },
    removeRecord: (record) => {
      dispatch({ type: 'removeRecord', record: record });
    },
    removeAll: () => {
      dispatch({ type: 'removeAll' });
    },
    addAll: (records) => {
      dispatch({ type: 'addAll', record: records });
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Harvest);