import React from 'react'
import { Redirect } from 'react-router-dom'
import { api } from '@/api.js'
import { Button, Grid, Form, Input } from 'semantic-ui-react'
import { connect } from 'react-redux'
import { sendNotification } from '@/utils.js'

class URLParse extends React.Component {
  /**
   * URL parse component contains a form field where the
   * user can enter a url from the supported libraries and
   * create an archive
   */
  state = {
    url: '', // Stores the url to be parsed
    isRedirect: false, // Triggered when the user presses the submit button and redirects to the harvest page
  }

  handleURLChange = (event) => {
    /**
     * Updates the url state each time the url text in the form changes
     */
    event.preventDefault()
    this.setState({ url: event.target.value })
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

  handleRedirect = (source, recid) => {
    /**
     * Called when the url parsing has finished,
     * then updates the query, source and search by id fields on redux
     * and sets the isRedirect state to true which redirects to the harvest page
     */
    this.handleQueryChange(recid)
    this.handleSourceChange(source)
    this.handleSearchByIdChange(false)
    this.setState({
      isRedirect: true,
    })
  }

  handleSubmit = async (event) => {
    /**
     * Called when the user presses the submit button,
     * then passes the url to the backend and gets the source and the recid.
     * If the api call is successful, calls the handleRedirect function.
     * If there is an error sends a notification to the user
     */
    event.preventDefault()
    try {
      const response = await api.parse_url(this.state.url)
      this.handleRedirect(response.source, response.recid)
    } catch (e) {
      sendNotification('Error while parsing URL', e.message)
    }
  }

  render() {
    const { isRedirect } = this.state

    let submitButton
    /**
     * If the isRedirect flag is false, renders a submit type button,
     * if it is true, redirects to the harvest page
     */
    if (isRedirect) {
      // if the url parsing has been completed, move to harvest page
      submitButton = <Redirect to="/harvest" />
    } else {
      submitButton = (
        <Button primary type="submit">
          Parse URL
        </Button>
      )
    }

    return (
      <React.Fragment>
        <h1>URL Harvest</h1>
        <p>
          Enter a URL from the supported digital repositories (CDS, Invenio,
          CERN opendata)
        </p>
        <Form onSubmit={this.handleSubmit}>
          <Grid columns={2} stackable>
            <Grid.Column width={12} verticalAlign="middle">
              <Form.Field
                control={Input}
                value={this.state.url}
                onChange={this.handleURLChange}
                label="Enter URL"
                placeholder="Enter URL here"
              />
            </Grid.Column>
            <Grid.Column verticalAlign="bottom" width={4}>
              {submitButton}
            </Grid.Column>
          </Grid>
        </Form>

        <p>{this.state.response}</p>
      </React.Fragment>
    )
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
      dispatch({ type: 'addAll', record: records })
    },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(URLParse)
