import React from 'react'
import { api } from '@/api.js'
import { Button, Grid, Form, Icon } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { sendNotification } from '@/utils.js'

export class UploadSIP extends React.Component {
  state = {
    file: null,
  }

  handleFileUpload = (event) => {
    event.preventDefault()
    this.setState({ file: event.target.files[0] })
  }

  handleSubmit = async (event) => {
    event.preventDefault()
    try {
      const response = await api.upload(this.state.file)
      sendNotification(
        response.msg,
        <Link to={`/archive/${response.archive}`}>
          <p>See created archive</p>
        </Link>,
        'success'
      )
      this.setState({ file: null })
    } catch (e) {
      this.setState({ file: null })
      sendNotification('Error while uploading file', e.message, 'error')
    }
  }

  render() {
    return (
      <React.Fragment>
        <h1>Upload Submission Bag</h1>
        <p>
          Upload a Submission Bag from your local machine (as a ZIP file). To
          create such bags you can use the{' '}
          <a
            href="https://gitlab.cern.ch/digitalmemory/bagit-create"
            target="_blank"
            rel="noreferrer"
          >
            BagIt Create tool
          </a>{' '}
          or check the{' '}
          <a
            href="https://gitlab.cern.ch/digitalmemory/sip-spec"
            target="_blank"
            rel="noreferrer"
          >
            format specification
          </a>
          .
        </p>
        <Form onSubmit={this.handleSubmit}>
          <Grid stackable columns={3}>
            <Grid.Column width={4} verticalAlign="middle">
              <h5>Select compressed SIP:</h5>
            </Grid.Column>
            <Grid.Column width={9}>
              <input
                ref={this.fileInputRef}
                type="file"
                accept=".zip, .tar, .rar, .7z, .gz"
                onChange={this.handleFileUpload}
              />
            </Grid.Column>
            <Grid.Column width={3}>
              <Button primary fluid type="submit">
                <Icon name="upload" /> Upload{' '}
              </Button>
            </Grid.Column>
          </Grid>
        </Form>
      </React.Fragment>
    )
  }
}
