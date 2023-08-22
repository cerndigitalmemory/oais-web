import React from 'react'
import { Redirect } from 'react-router-dom'
import { api } from '@/api.js'
import { Button, Grid, Form, Input, Icon } from 'semantic-ui-react'
import { sendNotification } from '@/utils.js'

export class Announce extends React.Component {
  /**
   * URL parse component contains a form field where the
   * user can enter a path where an SIP was already uploaded
   * and announce it to the system
   */
  state = {
    announcePath: '', // Stores the url to be parsed
    isRedirect: false, // Triggered when the user presses the submit button and redirects to the created archive page
    redirectToArchive: null,
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
      const response = await api.announce(this.state.announcePath)
      this.setState({
        announcePath: '',
        redirectToArchive: response.id,
        isRedirect: true,
      })
      sendNotification(
        'Success',
        'SIP sent successfully to OAIS platform',
        'success'
      )
    } catch (e) {
      sendNotification('Error while parsing URL', e.message, 'error')
    }
  }

  handlePathChange = (event) => {
    /**
     * Updates the path state each time the url text in the form changes
     */
    event.preventDefault()
    this.setState({ announcePath: event.target.value })
  }

  render() {
    const { isRedirect, redirectToArchive } = this.state

    let submitButton
    /**
     * If the isRedirect flag is false, renders a submit type button,
     * if it is true, redirects to the harvest page
     */
    if (isRedirect) {
      // if the url parsing has been completed, move to harvest page
      submitButton = <Redirect to={'/archive/' + redirectToArchive} />
    } else {
      submitButton = (
        <Button primary fluid type="submit">
          <Icon name="rss" />
          Announce
        </Button>
      )
    }

    return (
      <React.Fragment>
        <h1>Announce Submission Bag</h1>
        <p>
          If you already uploaded your SIP on EOS, you can add it to the
          platform by entering its absolute path here. Make sure you have
          granted the necessary permissions (give the &quot;oais&quot; user read
          access if the folder is private) and that the path directly points to
          the SIP folder (i.e. it contains <code>data/meta/sip.json</code>).
        </p>
        <Form onSubmit={this.handleSubmit}>
          <Grid columns={3} stackable>
            <Grid.Column width={13} verticalAlign="middle">
              <Form.Field
                control={Input}
                value={this.state.announcePath}
                onChange={this.handlePathChange}
                label="EOS Path"
                placeholder="/eos/home-u/user/sip_folder"
              />
            </Grid.Column>
            <Grid.Column verticalAlign="bottom" width={3}>
              {submitButton}
            </Grid.Column>
          </Grid>
        </Form>

        <p>{this.state.response}</p>
      </React.Fragment>
    )
  }
}
