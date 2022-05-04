import _ from 'lodash'
import React from 'react'
import { Storage } from '@/storage.js'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Button,
  Form,
  Input,
  Checkbox,
  Grid,
  GridColumn,
  Icon,
} from 'semantic-ui-react'

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
  }

  handleQueryChange = (query) => {
    // Changes the value of the query state (redux)
    this.props.setQuery(query)
  }

  handleSourceChange = (source) => {
    // Changes the value of the source state (redux)
    this.props.setSource(source)
  }

  handleSearchByIdChange = (searchById) => {
    // Changes the value of the searchByID state (redux)
    this.props.setID(searchById)
  }

  handleRedirect = async () => {
    // Handles the redirect state to the Harvest page
    this.setState({ isRedirect: true })
  }

  render() {
    const { isRedirect } = this.state
    const sources = ['cds', 'zenodo', 'inveniordm', 'cod', 'indico']
    return (
      <React.Fragment>
        <h1>Harvest</h1>
        <p>
          Create SIP packages from the supported digital repositories (uses
          Bagit Create tool)
        </p>
        <SearchForm
          sources={sources}
          onSearch={this.handleRedirect}
          isRedirect={isRedirect}
          activeSource={sources[0]}
          onQueryChange={this.handleQueryChange.bind(this)}
          onSourceChange={this.handleSourceChange.bind(this)}
          hitsPerPage={this.state.hitsPerPage}
          onSearchByIdChange={this.handleSearchByIdChange.bind(this)}
        />
      </React.Fragment>
    )
  }
}

export class SearchForm extends React.Component {
  static propTypes = {
    sources: PropTypes.arrayOf(PropTypes.string).isRequired,
    onSearch: PropTypes.func.isRequired,
    activeSource: PropTypes.string,
    isRedirect: PropTypes.bool.isRequired,
    onQueryChange: PropTypes.func.isRequired,
    onSourceChange: PropTypes.func.isRequired,
    hitsPerPage: PropTypes.number.isRequired,
    onSearchByIdChange: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = {
      query: '',
      source: this.props.activeSource,
      searchById: false,
    }
  }

  componentDidMount() {
    this.setState({
      source: this.props.activeSource,
    })
  }

  handleQueryChange = (event) => {
    this.props.onQueryChange(event.target.value)
    this.setState({ query: event.target.value })
  }

  handleSourceChange = (event, { value }) => {
    this.props.onSourceChange(value)
    this.setState({ source: value })
  }

  handleCheckboxChange = () => {
    this.props.onSearchByIdChange()
    this.setState({ searchById: !this.state.searchById })
  }

  handleSubmit = (event) => {
    // Handles the isRedirect state
    event.preventDefault()
    this.props.onSearch()
  }

  handleSourceButton = (event) => {
    event.preventDefault()
    const user = Storage.getUser()

    this.setState({
      query: user.first_name + ' ' + user.last_name,
      source: event.target.value,
      searchById: false,
    })
    this.props.onQueryChange(user.first_name + ' ' + user.last_name)
    this.props.onSourceChange(event.target.value)
    this.props.onSearch()
  }

  handleIndicoSearch = (event) => {
    event.preventDefault()
    const user = Storage.getUser()

    this.setState({
      query: 'person:' + user.first_name + ' ' + user.last_name,
      source: event.target.value,
      searchById: false,
    })
    this.props.onQueryChange('person:' + user.first_name + ' ' + user.last_name)
    this.props.onSourceChange(event.target.value)
    this.props.onSearch()
  }

  render() {
    const { isRedirect } = this.props
    const sourceOptions = _.map(this.props.sources, (source) => ({
      key: source,
      text: source,
      value: source,
    }))
    const user = Storage.getUser()

    let showSourceButtons
    if (user.first_name || user.last_name) {
      showSourceButtons = (
        <Grid.Row>
          <Grid.Column>
            <Button
              icon
              labelPosition="left"
              size="mini"
              fluid
              value="cds"
              onClick={this.handleSourceButton}
            >
              <Icon name="plus" />
              Find all your records on CDS
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button
              icon
              labelPosition="left"
              size="mini"
              fluid
              value="inveniordm"
              onClick={this.handleSourceButton}
            >
              <Icon name="plus" />
              Find all your records on InvenioRDM
            </Button>
          </Grid.Column>
          <Grid.Column>
            <Button
              icon
              labelPosition="left"
              size="mini"
              fluid
              value="indico"
              onClick={this.handleIndicoSearch}
            >
              <Icon name="plus" />
              Find all your events on Indico
            </Button>
          </Grid.Column>
        </Grid.Row>
      )
    }

    let submitButton
    if (isRedirect) {
      // if the search is already in progress, move to harvest page
      submitButton = <Redirect to="/harvest" />
    } else {
      submitButton = <Button primary>Search</Button>
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <Grid stackable columns={4}>
          <Grid.Column width={6} verticalAlign="bottom">
            <Form.Field
              control={Input}
              value={this.state.query}
              onChange={this.handleQueryChange}
              label="Query"
              placeholder="CMS Trigger System"
            />
          </Grid.Column>
          <GridColumn verticalAlign="bottom" width={3}>
            <Form.Field>
              <Checkbox
                label="Search Record by ID"
                onChange={this.handleCheckboxChange}
              />
            </Form.Field>
          </GridColumn>
          <Grid.Column verticalAlign="bottom" width={1}>
            <Form.Select
              label="Source"
              defaultValue={this.state.source}
              onChange={this.handleSourceChange}
              options={sourceOptions}
              placeholder="Source"
            />
          </Grid.Column>
          <GridColumn verticalAlign="bottom" floated="right">
            {submitButton}
          </GridColumn>
          {showSourceButtons}
        </Grid>
      </Form>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    query: state.query,
    source: state.source,
    searchById: state.searchById,
    searchPerson: state.searchPerson,
  }
}

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
    setPerson: (searchPerson) => {
      dispatch({ type: 'setPerson', searchPerson: searchPerson })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HarvestRedirect)
