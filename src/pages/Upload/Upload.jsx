import React from "react";
import { api } from "@/api.js";
import { Button, Grid, Form } from "semantic-ui-react";

import { sendNotification } from "@/utils.js";

export class Upload extends React.Component {
    state = {
        file: null,
        response: null
    };
    
    handleFileUpload = (event) => {
        event.preventDefault();
        this.setState({file : event.target.files[0]})
    };

    handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await api.ingest(this.state.file);
            this.setState({response : response.msg})
        } catch (e) {
        sendNotification("Error while uploading file", e.message);
        }
    };
  
    render() {
    return (
      <React.Fragment>
        <h1>Upload SIP</h1>
        <p>Upload a SIP from your local machine (as ZIP file) </p>
        <Form onSubmit={this.handleSubmit}>
            <Grid>
                <Grid.Row columns={3}>
                    <Grid.Column width={3} verticalAlign='middle'> 
                            <h5>Select compressed SIP:</h5>  
                    </Grid.Column>
                    <Grid.Column> 
                            <input
                                ref={this.fileInputRef}
                                type="file"
                                accept=".zip, .tar, .rar, .7z, .gz" 
                                onChange={this.handleFileUpload}
                            />   
                    </Grid.Column>
                    <Grid.Column>
                    <Button
                                content="Submit"
                                labelPosition="left"
                                icon="file"
                                type="submit"
                            />
                    </Grid.Column>    
                </Grid.Row>
            </Grid>
        </Form>

        <p>{this.state.response}</p>
      </React.Fragment>
    );
  }
}
