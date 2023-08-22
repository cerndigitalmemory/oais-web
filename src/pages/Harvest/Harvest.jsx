import { api } from '@/api.js'
import { RecordsList } from '@/pages/Harvest/RecordsList.jsx'
import { SourceStatus, SourceStatusLabel, sendNotification } from '@/utils.js'
import _ from 'lodash'
import React from 'react'
import { SearchPagination } from '@/pages/Harvest/SearchPagination.jsx'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Button, Grid, Message } from 'semantic-ui-react'
import SearchForm from '@/pages/Harvest/HarvestSearchForm.jsx'
import { AppContext } from '@/AppContext.js'
import { Link, Redirect } from 'react-router-dom'

// Harvest page is displayed at /harvest page.
// It performs the search and displays the results through the RecordList component

class Harvest extends React.Component {
  static contextType = AppContext.Context
  static propTypes = {
    // This allows the search to (optionally) "land" on another page 
    // (useful for example when the search is executed from a widget clicking 
    // the Search button should bring the user to a dedicated Harvest/Search page)
    redirectURL: PropTypes.string,
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
    referrer: null,
    tokenMessageVisible: false,
    sourceStatus: null,
  }

  // Changes the query state at the redux
  handleQueryChange = (query) => {
    this.props.setQuery(query)
  }

  // Changes the source state at redux
  handleSourceChange = (source) => {
    this.props.setSource(source)
    this.handleSourceConfigurationMessage(source)
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

  getSourceStatus = async () => {
    try {
      const sourceStatus = await api.getSourceStatus()
      this.setState({ sourceStatus: sourceStatus })
      this.handleSourceConfigurationMessage(this.props.source)
    } catch (e) {
      sendNotification(
        'Could not get source configuration status',
        e.message,
        'warning'
      )
    }
  }

  handleSourceConfigurationMessage = (source) => {
    const sourceStatus = this.state.sourceStatus
    if (sourceStatus) {
      if (sourceStatus[source] == SourceStatus.NEEDS_CONFIG) {
        this.setState({ tokenMessageVisible: true })
      } else if (sourceStatus[source] == SourceStatus.NEEDS_CONFIG_PRIVATE) {
        this.setState({ tokenMessageVisible: true })
      } else {
        this.setState({ tokenMessageVisible: false })
      }
    }
  }

  // Calls the handleSearch function when the component is mounted and there is an active state from redux
  componentDidMount() {
    this.getSourceStatus()
    if (this.props.redirectURL) {
      if (this.props.source && this.props.query) {
        // Auto populate query and source with the redux values
        this.handleQueryChange(this.props.query)
        this.handleSourceChange(this.props.source)
      } 
    }
    if (typeof this.props.location !== 'undefined' && this.props.location.state) {
        // If we're coming from the "add resource" execute the search immediatly so
        //  we avoid making the user clicking again
        if (this.props.location.state.referrer == '/add-resource') {
          this.handleSearch(this.props.source, this.props.query)
      }
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
          const response = await api.searchById(source, query)
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
        this.setState({
          results: [],
          totalNumHits: 0,
        })
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

  createStagedArchives = async (record) => {
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
      // use the await so the function waits for the response from the backend
      const { status: status } = await api.createStagedArchive(
        this.props.checkedRecords
      )
      sendNotification(
        this.props.checkedRecords.length + ' record(s) staged successfully!',
        'Check staged records page for more information',
        'success'
      )
      if (status == 0) {
        await this.loadRecords()
      }
    }
    // adds a delay of half a second so the staged records are created before retrieving them
    this.removeAllRecords()
  }

  loadRecords = async (page = 1) => {
    this.setState({ isLoading: true })
    try {
      const StagedArchivesList = await api.stagedArchives()
      this.setState({ StagedArchivesList: StagedArchivesList })
      // If there are records in the staged area update the staged value in the context
      if (StagedArchivesList) {
        AppContext.setStaged(StagedArchivesList.length)
      }
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

  handleDismiss = () => {
    this.setState({ tokenMessageVisible: false })
  }

  render() {
    const {
      isLoading,
      detailedResults,
      results,
      StagedArchivesList,
      redirect,
      sourceStatus,
    } = this.state

    let addRemoveButton = (
      <Button onClick={this.handleCheckAll}>Select all</Button>
    )
    let archiveAllButton = (
      <Button disabled positive onClick={this.handleArchiveButtonClick}>
        Archive Selected
      </Button>
    )
    if (this.props.checkedRecords.length > 0) {
      addRemoveButton = (
        <Button onClick={this.handleRemoveAll}>Clear selection</Button>
      )
      archiveAllButton = (
        <Button positive onClick={this.handleArchiveButtonClick}>
          Archive Selected
        </Button>
      )
    }

    const archiveButton = (
      <div>
        <Grid
          columns={2}
          style={{
            marginTop: '10px',
            marginBottom: '10px',
          }}
        >
          <Grid.Column floated="left" textAlign="left">
            {' '}
            {addRemoveButton}
          </Grid.Column>
          <Grid.Column floated="right" textAlign="right">
            {' '}
            {archiveAllButton}
          </Grid.Column>
        </Grid>
      </div>
    )

    let messageHeader
    let messageContent
    let messageColor

    if (sourceStatus) {
      if (sourceStatus[this.props.source] == SourceStatus.NEEDS_CONFIG) {
        messageHeader = 'Token configuration needed'
        messageColor = 'red'
        messageContent = (
          <>
            <p>
              To retrieve data from {this.props.source} you need to set the
              corresponding API token.
            </p>
            <p>
              <Link to="settings">-&gt; Go to Settings</Link>
            </p>
          </>
        )
      } else if (
        sourceStatus[this.props.source] == SourceStatus.NEEDS_CONFIG_PRIVATE
      ) {
        messageHeader = 'Token configuration recommended'
        messageColor = 'yellow'
        messageContent = (
          <>
            <p>
              You can only retrieve public data from {this.props.source}. To get
              private data you need to set the corresponding API token.
            </p>
            <p>
              <Link to="settings">-&gt; Go to Settings</Link>
            </p>
          </>
        )
      }
    }

    const showMessage = (
      <Grid.Row>
        <Grid.Column width={16}>
          <Message onDismiss={this.handleDismiss} color={messageColor}>
            <Message.Header>{messageHeader}</Message.Header>
            {messageContent}
          </Message>
        </Grid.Column>
      </Grid.Row>
    )

    return (
      <React.Fragment>
        <h1>Search and harvest</h1>
        {redirect && (
          <Redirect
            to={{
              pathname: redirect,
              state: { referrer: window.location.pathname },
            }}
          />
        )}
        <p>
          Search for records and documents from various CERN digital
          repositories (e.g. CDS, Invenio, Indico) and let the platform harvest
          the record for you.
        </p>
        <SearchForm
          sources={['cds', 'indico', 'codimd', 'zenodo']}
          activeSource={this.props.source}
          onSearch={this.handleSearch}
          isLoading={isLoading}
          onQueryChange={this.handleQueryChange.bind(this)}
          onSourceChange={this.handleSourceChange.bind(this)}
          hitsPerPage={this.state.hitsPerPage}
          onSearchByIdChange={this.handleSearchByIdChange.bind(this)}
          redirectURL={this.props.redirectURL}
        />

        <Grid
          columns={2}
          verticalAlign="middle"
          style={{
            marginBottom: '10px',
          }}
        >
          {' '}
          <Grid.Row>
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
          </Grid.Row>
          {this.state.tokenMessageVisible && showMessage}
        </Grid>

        {this.state.detailedResults == null ? null : this.state.detailedResults
            .length > 10 ? (
          <React.Fragment>{archiveButton}</React.Fragment>
        ) : (
          ' '
        )}

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
