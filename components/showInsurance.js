//addmap 0x67f69aCd17ef015cEE647f1900b05D57Cbfe034a
//doc 0x47e336B222Da6E0b445Cb8dF564D67E6ab778DB4

//mapp 0x99801d6161e06ed954435a41219ebe5df38b19bd
//addmap 0x246107b036bfDD31cAAAB68681954369104853D3

import React, { Component } from "react";
import web3 from "../ethereum/web3";
//import Layout from "./layout";
import axios from "axios";
import ins from "../ethereum/build/Insurance";
import doctor from "../ethereum/build/Doctor";
import validator from "validator";
//import { InputFile } from "semantic-ui-react-input-file";
import RequestInsRequests from "./RequestInsRequests";
import {
  Segment,
  Header,
  Icon,
  Loader,
  Modal,
  Dimmer,
  Grid,
  Statistic,
  Message,
  Button,
  Tab,
  Divider,
  Form,
  Input,
  Progress,
  Card,
} from "semantic-ui-react";

export class showInsurance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: "jhjhgj",
      deployedAddress: "jhjghgj",
      name: "hghgf",
      aadhar: "jhbjhg",
      details: "jhgh",
      documents: "",
      amount: 0,
      newTitle: "",
      newTitleError: false,
      newDetails: "",
      newDetailsError: false,
      newFileHash: "",
      newFileHashError: false,
      selectedFile: null,
      loadingFile: false,
      loaded: 0,
      requests: null,
      pendingRequests: null,
      approvedRequests: null,
      rejectedRequests: null,
      newRequestFormLoading: false,
      errorMessage: "",
      isModalOpen: false,
      modalContent: "",
      modalHeader: "",
      modalIconColor: "red",
      modalIconName: "clock",
      isLoaderDimmerActive: false,
      loadderDimmerContent: "asdasd",
      downloadLoading: "",
      ready: false,
    };
  }

  modalTopple = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  refresh = () => {
    let pendingRequestsTemp = this.state.requests.filter((req) => {
      return req[8] == false;
    });
    let approvedRequestsTemp = this.state.requests.filter((req) => {
      return req[8] == true && req[5] == true;
    });
    let rejectedRequestsTemp = this.state.requests.filter((req) => {
      return req[8] == true && req[5] == false;
    });

    this.setState({
      pendingRequests: pendingRequestsTemp,
      rejectedRequests: rejectedRequestsTemp,
      approvedRequests: approvedRequestsTemp,
    });

    this.setState({ ready: true });
  };

  componentDidMount() {
    this.setState(
      {
        deployedAddress: this.props.data[0],
        owner: this.props.data[1],
        name: this.props.data[2],
        aadhar: this.props.data[3],
        details: this.props.data[4],
        documents: this.props.data[5],
        amount: this.props.data[6],
        requests: this.props.data[7],
      },
      function () {
        this.refresh();
      }
    );

    const myContract = new web3.eth.Contract(ins.abi, this.props.insAdd);

    myContract.events
      .ChangeOccured({}, function (error, event) {
        console.log(event);
      })
      .on("data", async (event) => {
        const accounts = await web3.eth.getAccounts();
        let output;
        try {
          let address1 = new web3.eth.Contract(ins.abi, this.props.insAdd);
          output = await address1.methods.getData().call();
        } catch (err) {
          return;
        }

        this.setState({ ready: false });
        this.setState(
          {
            deployedAddress: output[0],
            owner: output[1],
            name: output[2],
            aadhar: output[3],
            details: output[4],
            documents: output[5],
            amount: output[6],
            requests: output[7],
          },
          function () {
            this.refresh();
          }
        );
      })
      .on("changed", function (event) {
        // remove event from local database
      })
      .on("error", console.error);
  }

  refreshData = async () => {
    let output;
    try {
      let address1 = new web3.eth.Contract(ins.abi, this.state.deployedAddress);
      output = await address1.methods.getData().call();
    } catch (err) {
      return;
    }
    this.setState({ requests: output[7] });
  };

  newInsuranceForm = async (e) => {
    e.preventDefault();

    let errorFlag;
    if (validator.isEmpty(this.state.newTitle)) {
      this.setState({ newTitleError: "Enter Title" });
      errorFlag = true;
    } else {
      this.setState({ newTitleError: false });
    }

    if (validator.isEmpty(this.state.newDetails)) {
      this.setState({ newDetailsError: "Enter Details" });
      errorFlag = true;
    } else {
      this.setState({ newDetailsError: false });
    }

    if (
      validator.isEmpty(this.state.newFileHash) ||
      this.state.newFileHash.length != 46
    ) {
      this.setState({ newFileHashError: "Upload File" });
      errorFlag = true;
    } else {
      this.setState({ newFileHashError: false });
    }

    if (!errorFlag) {
      this.setState({ newRequestFormLoading: true, errorMessage: "" });
      let accounts = await web3.eth.getAccounts();
      let isDoctor;

      try {
        const address = new web3.eth.Contract(
          doctor.abi,
          "0x4893E591fE23770B088F2f9d7Bc6B314c5cDC583"
        );
        isDoctor = await address.methods.isDoctor(accounts[0]).call();
      } catch (err) {
        this.setState({ errorMessage: err.message });
        this.setState({ newRequestFormLoading: false });
        return;
      }

      if (!isDoctor) {
        this.setState({
          modalHeader: "Error",
          modalContent: "You are Not Authorized",
          modalIconColor: "red",
          modalIconName: "cancel",
          isModalOpen: true,
        });
        this.setState({ newRequestFormLoading: false });
        return;
      } else {
        try {
          const address1 = new web3.eth.Contract(
            ins.abi,
            this.state.deployedAddress
          );
          await address1.methods
            .applyClaim(
              this.state.newFileHash,
              this.state.newTitle,
              this.state.newDetails
            )
            .send({ from: accounts[0], gas: 9999999, gasPrice: "40000000000" });
        } catch (err) {
          this.setState({
            errorMessage: err.message,
            newRequestFormLoading: false,
          });
          return;
        }
      }
      this.refreshData();
      this.setState({ newRequestFormLoading: false });
      this.setState({
        modalHeader: "Success",
        modalContent: "Request Submitted Successfully",
        modalIconColor: "green",
        modalIconName: "check circle",
        isModalOpen: true,
        newTitle: "",
        newDetails: "",
        newFileHash: "",
      });
    }
  };

  onFileSelect = (event) => {
    var files = event.target.files;
    this.setState({
      selectedFile: files,
    });
  };

  uploadFiles = () => {
    let errorFlag = false;
    if (this.state.selectedFile == null) {
      this.setState({
        modalHeader: "Error",
        modalContent: "Select Atleast One File",
        modalIconColor: "red",
        modalIconName: "cancel",
        isModalOpen: true,
      });
      errorFlag = true;
    }

    if (!errorFlag) {
      this.setState({ loadingFile: true, loaded: 0 });
      const data = new FormData();
      for (var x = 0; x < this.state.selectedFile.length; x++) {
        data.append("file", this.state.selectedFile[x]);
      }

      axios
        .post("/upload", data, {
          onUploadProgress: (ProgressEvent) => {
            this.setState({
              loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100,
            });
          },
          params: {
            password: this.state.aadhar,
          },
        })
        .then((res) => {
          // then print response status
          this.setState({
            newFileHash: res.data,
            selectedFile: null,
            loadingFile: false,
          });
        })
        .catch((err) => {
          // then print response status
        });
    }
  };

  getDocuments = async () => {
    this.setState({ downloadLoading: true ,
      isLoaderDimmerActive: true});
    axios
      .get("/download", {
        params: {
          data: this.state.documents,
          password: this.state.aadhar,
        },
        responseType: "blob",
      })
      .then((res) => {
        if(res["headers"]["flag"] == "false") {	
          this.setState({	
            modalHeader: "Error",	
            modalContent: "Something went wrong !!!",	
            modalIconColor: "red",	
            modalIconName: "cancel",	
            isModalOpen: true,	
          });	
        }else {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "download.zip");
        document.body.appendChild(link);
        link.click(); // then print response status
        this.setState({ downloadLoading: false });
        }
        this.setState( { isLoaderDimmerActive: false } );
      })
      .catch((err) => {
        // then print response status
      });
  };

  renderRequests = (input) => {
    if (this.state.ready == true) {
      if (input == "pending") {
        if (this.state.pendingRequests != null) {
          return this.state.pendingRequests.map((req, index) => {
            return (
              <RequestInsRequests
                requestData={req}
                type="pending"
                aadhar={this.state.aadhar}
              />
            );
          });
        }
      }
      if (input == "approved") {
        if (this.state.approvedRequests != null) {
          return this.state.approvedRequests.map((req, index) => {
            return (
              <RequestInsRequests
                requestData={req}
                type="approved"
                aadhar={this.state.aadhar}
              />
            );
          });
        }
      }
      if (input == "rejected") {
        if (this.state.rejectedRequests != null) {
          return this.state.rejectedRequests.map((req, index) => {
            return (
              <RequestInsRequests
                requestData={req}
                type="rejected"
                aadhar={this.state.aadhar}
              />
            );
          });
        }
      }
    }
  };

  getPanesData = () => {
    const panes = [
      {
        menuItem: "Pending",
        render: () => (
          <Tab.Pane>
            <Card.Group centered className='attached fluid segment'>{this.renderRequests("pending")}</Card.Group>
            <Message attached='bottom' info>
                  <Message.Header>Need Help?</Message.Header>
                  <p>Shows pending requests</p>
                    <Message.List>
                    <Message.Item>Shows details of pending requests</Message.Item>
                    <Message.Item>You can download the bills</Message.Item>
                   
                    </Message.List>
                </Message>
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Approved",
        render: () => (
          <Tab.Pane>
            <Card.Group centered className='attached fluid segment'>{this.renderRequests("approved")}</Card.Group>
            <Message attached='bottom' info>
                  <Message.Header>Need Help?</Message.Header>
                  <p>Shows approved insurances</p>
                    <Message.List>
                    <Message.Item>Shows the details of approved insurance requests</Message.Item>
                <     Message.Item>You can download the bills</Message.Item>
                    </Message.List>
                </Message>
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Rejected",
        render: () => (
          <Tab.Pane>
            <Card.Group centered className="attached fluid segment">{this.renderRequests("rejected")}</Card.Group>
            <Message attached='bottom' info>
                  <Message.Header>Need Help?</Message.Header>
                  <p>Shows rejected insurance</p>
                    <Message.List>
                      <Message.Item>Shows the details of rejected insurance requests</Message.Item>
                      <Message.Item>You can download the bills</Message.Item>
                    </Message.List>
                </Message>
          </Tab.Pane>
        ),
      },
    ];

    if (this.props.type == "doctor") {
      panes.push({
        menuItem: "New",
        render: () => (
          <Tab.Pane>
            <Grid textAlign="left" verticalAlign="top" columns={1}>
              <Grid.Column>
                <Header
                  color="grey"
                  size="huge"
                  as="h1"
                  textAlign="center"
                  style={{ marginTop: "45px", color: "white" }}
                >
                  Insurance
                </Header>
                <Divider horizontal>
                  <Header color="grey" as="h4" style={{ color: "white" }}>
                    New Request
                  </Header>
                </Divider>
                <Form
                  onSubmit={this.newInsuranceForm}
                  error={!!this.state.errorMessage}
                  className='attached fluid segment'
                >
                  <Form.Field>
                    <label style={{ color: "#808080" }}>Title</label>
                    <Form.Input
                      fluid
                      value={this.state.newTitle}
                      onChange={(event) =>
                        this.setState({ newTitle: event.target.value })
                      }
                      placeholder="Title"
                      error={this.state.newTitleError}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label style={{ color: "#808080" }}>Details</label>
                    <Form.Input
                      fluid
                      value={this.state.newDetails}
                      onChange={(event) =>
                        this.setState({ newDetails: event.target.value })
                      }
                      placeholder="Details"
                      error={this.state.newDetailsError}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label style={{ color: "#808080" }}>Bills</label>
                    <Form.Input
                      fluid
                      value={this.state.newFileHash}
                      onChange={(event) =>
                        this.setState({ newFileHash: event.target.value })
                      }
                      placeholder="FileHash"
                      error={this.state.newFileHashError}
                    />
                  </Form.Field>
                  <Form.Group>
                    <Form.Field>
                      <Button
                        floated
                        style={{ height: "36.5px" }}
                        color="orange"
                        as="label"
                        htmlFor="file"
                        type="button"
                      >
                        <Icon name="upload" size="large" />
                        Select Files For Upload
                      </Button>
                      <input
                        type="file"
                        id="file"
                        style={{ visibility: "hidden", display: "none" }}
                        multiple
                        onChange={this.onFileSelect}
                      />
                    </Form.Field>
                    <Form.Field>
                      <Button
                        type="button"
                        disabled={this.state.loadingFile}
                        loading={this.state.loadingFile}
                        color="green"
                        onClick={this.uploadFiles}
                      >
                        Upload Files and Generate Hash
                      </Button>
                    </Form.Field>
                  </Form.Group>
                  <Progress percent={this.state.loaded} progress success>
                    success
                  </Progress>
                  <Message
                    hidden={!this.state.errorMessage.length != 0}
                    header="Oops!"
                    content={this.state.errorMessage}
                  />
                  <Button
                    type="submit"
                    loading={this.state.newRequestFormLoading}
                    disabled={this.state.newRequestFormLoading}
                    content="Submit Request"
                    primary
                  />
                </Form>
                <Message attached='bottom' info>
                  <Message.Header>Need Help?</Message.Header>
                  <p>To claim insurance</p>
                    <Message.List>
                    <Message.Item>Only <b>authorized doctors</b> can claim insurance</Message.Item>
                    <Message.Item>All details are <b>compulsory</b></Message.Item>
                    <Message.Item>You have to upload <b>atleast one file</b></Message.Item>
                    <Message.Item>After clicking on <b>"submit request"</b>, wait till the pop up says <b>"Request submitted successfully"</b></Message.Item>
                    </Message.List>
                </Message>
              </Grid.Column>
            </Grid>
            <style jsx>
              {`
                .inputfile {
                  visibility: hidden;
                }
              `}
            </style>
          </Tab.Pane>
        ),
      });
    }

    return panes;
  };
  render() {
    return (
      <div>
    
        <Dimmer active={this.state.isLoaderDimmerActive}>
          <Loader active={this.state.isLoaderDimmerActive} inline="centered">Loading</Loader>
        </Dimmer>
        <Modal open={this.state.isModalOpen}>
          <Header>
            <Icon
              color={this.state.modalIconColor}
              name={this.state.modalIconName}
              size="big"
            />
            {this.state.modalHeader}
          </Header>
          <Modal.Content>{this.state.modalContent}</Modal.Content>
          <Modal.Actions>
            <Button color="blue" onClick={this.modalTopple}>
              <Icon name="checkmark" /> Ok
            </Button>
          </Modal.Actions>
        </Modal>
        <Header color={"grey"} as="h1">
          Insurance
        </Header>
        <Grid stackable>
          <Grid.Column>
            <Grid.Row style={{ marginBottom: "4px" }}>
              <Statistic size="mini" color="blue">
                <Statistic.Value>{this.state.owner}</Statistic.Value>
                <label style={{ color: "#767676" }}>Owner</label>
              </Statistic>
            </Grid.Row>
            <Grid.Row style={{ marginBottom: "4px" }}>
              <Statistic size="mini" color="red">
                <Statistic.Value>{this.state.deployedAddress}</Statistic.Value>
                <label style={{ color: "#767676" }}>Deployed Address</label>
              </Statistic>
            </Grid.Row>
          </Grid.Column>
        </Grid>

        <Grid stackable>
          <Grid.Row columns={3}>
            <Grid.Column>
              <label style={{ color: "#767676" }}>Name</label>
              <Message content={this.state.name} color="blue"></Message>
            </Grid.Column>
            <Grid.Column>
              <label style={{ color: "#767676" }}>Aadhar</label>
              <Message content={this.state.aadhar} color="blue"></Message>
            </Grid.Column>
            <Grid.Column>
              <label style={{ color: "#767676" }}>Amount</label>
              <Message content={this.state.amount} color="blue"></Message>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <label style={{ color: "#767676" }}>Details</label>
              <Message content={this.state.details} color="blue"></Message>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Button
                loading={this.state.downloadLoading}
                disabled={this.state.downloadLoading}
                onClick={this.getDocuments}
                style={{ marginBottom: "4px" }}
                color="blue"
              >
                Get Documents
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
        <Tab
          defaultActiveIndex="1"
          color="red"
          panes={this.getPanesData()}
          style={{ marginTop: "4px" }}
          onTabChange={this.handleChange}
        />

        <style jsx>
          {`
            .inputfile {
              width: 0.1px;
              height: 0.1px;
              opacity: 0;
              overflow: hidden;
              position: absolute;
              z-index: -1;
            }
          `}
        </style>
      </div>
    );
  }
}

export default showInsurance;
