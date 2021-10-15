import React from "react";
import { api } from "@/api.js";
import { Button, Col, Form, Row, Spinner} from "react-bootstrap";
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
        console.log("Submit")
    };
  
    render() {
    return (
      <React.Fragment>
        <h1>Upload SIP</h1>
        <Form onSubmit={this.handleSubmit}>
            <Row>
                <Col xs="12" lg="7">
                    <Form.Group as={Row} controlId="formFile" className="mb-3">
                        <Form.Label column xs="3" lg="auto">Select compressed SIP</Form.Label>
                        <Col>
                        <Form.Control 
                            type="file" 
                            accept=".zip, .tar, .rar, .7z, .gz" 
                            onChange={this.handleFileUpload}/>
                        </Col>
                    </Form.Group>
                </Col>
                <Col xs="12" lg="3">
                    <Button type="submit">Upload</Button>
                </Col>    
            </Row>
        </Form>

        <p>{this.state.response}</p>
      </React.Fragment>
    );
  }
}
