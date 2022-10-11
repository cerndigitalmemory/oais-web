import _ from 'lodash'
import PropTypes from 'prop-types'
import { Storage } from '@/storage.js'
import React from 'react'
import {
  Button,
  Form,
  Input,
  Checkbox,
  Grid,
  Icon,
  Loader,
} from 'semantic-ui-react'
import { connect } from 'react-redux'

// The SearchForm function contains the form for the search

class SearchForm extends React.Component {
  static propTypes = {
    sources: PropTypes.arrayOf(PropTypes.string).isRequired,
    activeSource: PropTypes.string,
    onSearch: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired,
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

  // When the component first mounts, we need the state as a placeholder at the query form and the source
  componentDidMount() {
    if (this.props.source && this.props.query) {
      this.setState({
        query: this.props.query,
        source: this.props.source,
        searchById: this.props.searchById,
      })
    }
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
    event.preventDefault()
    if (this.state.searchById) {
      this.props.onSearch(this.state.source, this.state.query)
    } else {
      this.props.onSearch(
        this.state.source,
        this.state.query,
        1,
        this.props.hitsPerPage
      )
    }
  }

  handleSourceButton = (event) => {
    event.preventDefault()
    const user = Storage.getUser()
    let query
    if (event.target.value == 'indico') {
      query = 'person:' + user.first_name + ' ' + user.last_name
    } else {
      query = user.first_name + ' ' + user.last_name
    }
    let source = event.target.value
    let searchById = false

    this.setState({
      query: query,
      source: source,
      searchById: searchById,
    })
    this.props.onQueryChange(query)
    this.props.onSourceChange(source)
    this.props.onSearch(source, query, 1, this.props.hitsPerPage)
  }

  render() {
    const { isLoading } = this.props
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
              onClick={this.handleSourceButton}
            >
              <Icon name="plus" />
              Find all your events on Indico
            </Button>
          </Grid.Column>
        </Grid.Row>
      )
    }
    let submitButton
    if (isLoading) {
      // if the search is already in progress, show a spinner
      submitButton = (
        <Button loading primary fluid>
          Loading
        </Button>
      )
    } else {
      submitButton = (
        <Button primary className="standard_button">
          Search
        </Button>
      )
    }

    return (
      <Form onSubmit={this.handleSubmit}>
        <Grid stackable columns={4}>
          <Grid.Column width={6}>
            <Form.Field
              control={Input}
              value={this.state.query}
              onChange={this.handleQueryChange}
              label="Query"
              placeholder="Query"
            />
          </Grid.Column>
          <Grid.Column verticalAlign="bottom" width={2}>
            <Form.Field>
              <Checkbox
                label="Search Record by ID"
                checked={this.props.searchById}
                onChange={this.handleCheckboxChange}
              />
            </Form.Field>
          </Grid.Column>
          <Grid.Column verticalAlign="bottom" width={5}>
            <Form.Select
              label="Source"
              onChange={this.handleSourceChange}
              value={this.state.source}
              options={sourceOptions}
              placeholder="Source"
            />
          </Grid.Column>
          <Grid.Column verticalAlign="bottom" width={3}>
            {submitButton}
          </Grid.Column>
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
  }
}

export default connect(mapStateToProps)(SearchForm)
