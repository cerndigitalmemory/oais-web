import { api } from '@/api.js'
import { RecordsList } from '@/pages/Harvest/RecordsList.jsx'
import { sendNotification } from '@/utils.js'
import _ from 'lodash'
import React from 'react'
import { SearchPagination } from '@/pages/Harvest/SearchPagination.jsx'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Button, Grid } from 'semantic-ui-react'
import SearchForm from '@/pages/Harvest/HarvestSearchForm.jsx'
import { Redirect } from 'react-router-dom'

// Harvest page is displayed at /harvest page.
// It performs the search and displays the results through the RecordList component

class Harvest extends React.Component {
  static propTypes = {
    redirectURL: PropTypes.string, // a url to a page to redirect after the search is made
  }

  state = {
    results: null,
    detailedResults: null,
    isLoading: false,
    activePage: 1,
    totalNumHits: null,
    hitsPerPage: 20,
    StagedArchivesList: [],
    redirect: null, // When populated, triggers redirect to the page passed from props
  }

  // Changes the query state at the redux
  handleQueryChange = (query) => {
    this.props.setQuery(query)
  }

  // Changes the source state at redux
  handleSourceChange = (source) => {
    this.props.setSource(source)
  }

  // Changes the search by ID state at redux
  handleSearchByIdChange = (searchById) => {
    this.props.setID(searchById)
  }

  checkRecordAdd = (record) => {
    this.props.addRecord(record)
  }

  removeAllRecords = () => {
    this.props.removeAll()
  }

  addAllRecords = (records) => {
    this.props.addAll(records)
  }

  checkRecordRemove = (record) => {
    this.props.removeRecord(record)
  }

  // Calls the handleSearch function when the component is mounted and there is an active state from redux
  componentDidMount() {
    if (this.props.redirectURL) {
      if (this.props.source && this.props.query) {
        // Auto populate query and source with the redux values
        this.handleQueryChange(this.props.query)
        this.handleSourceChange(this.props.source)
      }
    } else if (this.props.source && this.props.query) {
      this.handleSearch(this.props.source, this.props.query)
    }
  }

  getDetailedRecords = (records) => api.getCheckRecordsArchived(records)

  // Handles the search
  handleSearch = async (source, query, page = 1, size = 20) => {
    this.setState({
      isLoading: true,
      activePage: Number(page),
      hitsPerPage: Number(size),
      detailedResults: null,
    })
    if (this.props.redirectURL) {
      // Handles the redirect state to the Harvest page
      this.setState({ redirect: this.props.redirectURL })
    } else {
      try {
        if (this.props.searchById) {
          const response = await api.search_by_id(source, query)
          this.setState({
            results: response.result,
            totalNumHits: response.result.length,
          })
        } else {
          const response = await api.search(source, query, page, size)
          this.setState({
            results: response.results,
            totalNumHits: Number(response.total_num_hits),
          })
        }
      } catch (e) {
        sendNotification('Error while searching', e.message, 'error')
        this.setState({ isLoading: false })
      } finally {
        const detailedResponse = await this.getDetailedRecords(
          this.state.results
        )
        this.setState({ detailedResults: detailedResponse })
        this.loadRecords()
      }
      this.setState({ isLoading: false })
    }
  }

  autoArchive = async (record) => {
    // Call the api method to create a staged archive
    api.createStagedArchive(record)
  }

  handleArchiveButtonClick = async () => {
    if (this.props.checkedRecords.length === 0) {
      sendNotification(
        'There are no records checked',
        'Please select records to stage',
        'warning'
      )
    } else {
      this.setState({ archivedList: this.props.checkedRecords })
      this.props.checkedRecords.map((checkedRecord) => {
        this.autoArchive(checkedRecord)
      })
      sendNotification(
        this.props.checkedRecords.length + ' record(s) staged successfully!',
        'Check staged records page for more information',
        'success'
      )
    }
    this.loadRecords()
    this.removeAllRecords()
  }

  loadRecords = async (page = 1) => {
    this.setState({ isLoading: true })
    try {
      const StagedArchivesList = await api.stagedArchives()
      this.setState({ StagedArchivesList: StagedArchivesList })
    } catch (e) {
      sendNotification('Error while fetching records', e.message, 'error')
    } finally {
      this.setState({ isLoading: false })
    }
  }

  handleCheckAll = () => {
    this.addAllRecords(this.state.results)
  }

  handleRemoveAll = () => {
    this.removeAllRecords()
  }

  render() {
    const {
      isLoading,
      detailedResults,
      results,
      StagedArchivesList,
      redirect,
    } = this.state

    const archiveButton = (
      <div>
        <Button color="primary" onClick={this.handleArchiveButtonClick}>
          Archive Selected
        </Button>
        <Button onClick={this.handleRemoveAll}>
          Remove all
        </Button>
        <Button onClick={this.handleCheckAll}>
          Add all
        </Button>
      </div>
    )

    return (
      <React.Fragment>
        <h1>Harvest</h1>
        {redirect && <Redirect to={redirect} />}
        <p>
          Create SIP packages from the supported digital repositories (uses
          Bagit Create tool)
        </p>
        <SearchForm
          sources={['cds', 'zenodo', 'inveniordm', 'cod', 'indico']}
          activeSource={this.props.source}
          onSearch={this.handleSearch}
          isLoading={isLoading}
          onQueryChange={this.handleQueryChange.bind(this)}
          onSourceChange={this.handleSourceChange.bind(this)}
          hitsPerPage={this.state.hitsPerPage}
          onSearchByIdChange={this.handleSearchByIdChange.bind(this)}
          redirectURL={this.props.redirectURL}
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

        {this.state.detailedResults == null ? null : this.state.detailedResults
            .length > 0 ? (
          <React.Fragment>
            <RecordsList
              records={results}
              recordsDetailed={detailedResults}
              addRecord={this.checkRecordAdd}
              removeRecord={this.checkRecordRemove}
              checkedList={this.props.checkedRecords}
              archivedList={StagedArchivesList}
              isLoading={isLoading}
            />
            {archiveButton}
          </React.Fragment>
        ) : (
          <p>No results found.</p>
        )}
      </React.Fragment>
    )
  }
}

export class SizeRadio extends React.Component {
  static propTypes = {
    hitsPerPage: PropTypes.number.isRequired,
    onSearch: PropTypes.func.isRequired,
    query: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    hasResults: PropTypes.bool.isRequired,
  }

  sizeChange = (event, { value }) => {
    event.preventDefault()
    this.props.onSearch(this.props.source, this.props.query, 1, value)
  }

  render() {
    let sizeOptions = [10, 20, 50]

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
    ) : null
  }
}

// Binds the redux states with this component's props
const mapStateToProps = (state) => {
  return {
    query: state.query,
    source: state.source,
    searchById: state.searchById,
    checkedRecords: state.checkedRecords,
  }
}

// Dispatches the following functions which change the redux state when called
const mapDispatchToProps = (dispatch) => {
  return {
    setQuery: (query) => {
      dispatch({ type: 'setQuery', query: query })
    },
    setSource: (source) => {
      dispatch({ type: 'setSource', source: source })
    },
    setID: (searchById) => {
      dispatch({ type: 'setID', searchById: searchById })
    },
    addRecord: (record) => {
      dispatch({ type: 'addRecord', record: record })
    },
    removeRecord: (record) => {
      dispatch({ type: 'removeRecord', record: record })
    },
    removeAll: () => {
      dispatch({ type: 'removeAll' })
    },
    addAll: (records) => {
      dispatch({ type: 'addAll', records: records })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Harvest)
