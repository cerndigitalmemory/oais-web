import React from 'react'
import { api } from '@/api.js'
import { Button, Grid, Form } from 'semantic-ui-react'
import { Link } from 'react-router-dom'
import { sendNotification } from '@/utils.js'

export class UploadFolder extends React.Component {

    /**
     * files is assigned to a FileList object when handleFileUpload is called.
     * This object contains a list of File objects, with attritutes
     * such as webKitRelativePath, name, size...
     * 
     * these File objects are then sent on the body of a POST request (see src/api.js)
     * Django handles these and converts them to TemporarlyUploadedFiles (stored under /tmp),
     * or MemoryUploadedFile if small enough
     */
    state = {
        files: null,
    }

    handleFileUpload = (event) => {
        // Overwrite the browser default behaviour when submitting the form
        event.preventDefault()
        this.setState({ files: event.target.files })
    }

    handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const response = await api.uploadFolder(this.state.files)
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
                <h1>Upload folder</h1>
                <p>Upload files and folders from your local machine </p>
                <Form onSubmit={this.handleSubmit}>
                    <Grid stackable columns={3}>

                        <Grid.Column width={4} verticalAlign="middle">
                            <h5>Select folder:</h5>
                        </Grid.Column>
                        <Grid.Column width={8}>
                            <input
                                ref={this.fileInputRef}
                                type="file"
                                webkitdirectory="true"
                                onChange={this.handleFileUpload}
                            />
                        </Grid.Column>

                        <Grid.Column width={1}>
                            <Button primary content="Submit" type="submit" />
                        </Grid.Column>
                    </Grid>
                </Form>
            </React.Fragment>
        )
    }
}
