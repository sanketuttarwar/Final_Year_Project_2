import React, { Component } from "react";
import web3 from "../ethereum/web3";
import axios from "axios";
import Layout from "../components/layout";
import own from "../ethereum/build/Owner";
import addMap from "../ethereum/build/AddressMapping";
import { Router } from "../routes";
import validator from "validator";
import aadharValidator from "aadhaar-validator";
import BannerInsurance from "../components/BannerInsurance";
import RequestRequests from "../components/RequestRequests";
import Head from 'next/head';
import {
  Segment,
  Statistic,
  Tab,
  Form,
  Table,
  Card,
  Confirm,
  Step,
  Input,
  Image,
  Progress,
  Header,
  Message,
  Icon,
  Label,
  Button,
  Grid,
  Dropdown,
  Divider,
  Modal,
  Container,
} from "semantic-ui-react";

class OwnerHomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      owner: "0x0000000000000000000000000000000000000000",
      insurancesIssuedNum: 234234,
      pendingRequestsNum: 34,
      approvedRequestsNum: 0,
      rejectedRequestsNum: 333,
      insurancesIssued: null,
      pendingRequests: null,
      approvedRequests: null,
      rejectedRequests: null,
      insName: "",
      insNameError: false,
      insAadhar: "",
      insAadharError: false,
      insAmount: "",
      insAmountError: false,
      insDetails: "",
      insDetailsError: false,
      insDocuments: "",
      insDocumentsError: false,
      loaded: 0,
      selectedFile: null,
      loadingFile: false,
      loadingIns: false,
      isDashBoardActive: false,
      isLoginActive: true,
      password: "",
      passwordError: false,
      signinLoading: false,
      signupLoading: false,
      isModalOpen: false,
      modalContent: "",
      modalHeader: "",
      modalIconColor: "red",
      modalIconName: "clock",
      requests: null,
      ready: false,
      isLogoutModal: false,
      passwordCopy: "",
    };
  }



  async componentDidMount() {
    if(window.ethereum) {
      await ethereum.enable();
    }
  }

  logoutModalOpen = () => {
    this.setState({ isLogoutModal: true });
  };
  logout = () => {
    this.setState({
      isLogoutModal: false,
      password: "",
      isDashBoardActive: false,
      isLoginActive: true,
    });
  };
  logoutModalClose = () => {
    this.setState({ isLogoutModal: false });
  };
  modalTopple = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  refresh = async () => {
    const myContract = new web3.eth.Contract(own.abi, this.state.owner);

    myContract.events
      .ChangeOccured({}, function (error, event) {
        console.log(event);
      })
      .on("data", async (event) => {
        const accounts = await web3.eth.getAccounts();
        let output;
        try {
          const address = new web3.eth.Contract(own.abi, this.state.owner);
          output = await address.methods
            .getData(this.state.passwordCopy)
            .call({ from: accounts[0] });
        } catch (err) {
          return;
        }
        this.setState({ ready: false });
        this.setState({
          insurancesIssuedNum: output[1].length,
          insurancesIssued: output[1],
          requests: output[2],
          owner: output[3],
        });
        this.assign();
      })
      .on("changed", function (event) {
        // remove event from local database
      })
      .on("error", console.error);
  };

  onFileSelect = (event) => {
    var files = event.target.files;
    this.setState({
      selectedFile: files,
    });
  };

  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };

  padDigits = (number, digits) => {
    return (
      Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number
    );
  };

  createNewInsurance = async () => {
    let errorFlag = false;

    if (
      !validator.isAlpha(this.state.insName) ||
      validator.isEmpty(this.state.insName)
    ) {
      this.setState({ insNameError: "Incorrect Name" });
      errorFlag = true;
    } else {
      this.setState({ insNameError: false });
    }

    if (
      !aadharValidator.isValidNumber(String(this.state.insAadhar)) ||
      validator.isEmpty(this.state.insAadhar)
    ) {
      this.setState({ insAadharError: "Enter Correct Aadhar Number" });
      errorFlag = true;
    } else {
      this.setState({ insAadharError: false });
    }

    if (
      !validator.isNumeric(this.state.insAmount) ||
      this.state.insAmount > 100000000 ||
      validator.isEmpty(this.state.insAmount)
    ) {
      this.setState({ insAmountError: "Enter Correct Amount" });
      errorFlag = true;
    } else {
      this.setState({ insAmountError: false });
    }

    if (validator.isEmpty(this.state.insDetails)) {
      this.setState({ insDetailsError: "Please Enter Details" });
      errorFlag = true;
    } else {
      this.setState({ insDetailsError: false });
    }

    if (
      this.state.insDocuments.length !== 46 ||
      validator.isEmpty(this.state.insDocuments)
    ) {
      this.setState({ insDocumentsError: "Please Upload Document" });
      errorFlag = true;
    } else {
      this.setState({ insDocumentsError: false });
    }

    if (!errorFlag) {
      this.setState({ loadingIns: true });
      const accounts = await web3.eth.getAccounts();
      let count;

      try {
        const address = new web3.eth.Contract(
          addMap.abi,
          "0xc821543770F3256f9f78354D6193777dA338f6D1"
        );
        count = await address.methods
          .getInsuranceNumberCount(this.state.insAadhar)
          .call({ from: accounts[0] });
      } catch (err) {
        this.setState({ loadingIns: false });
        return;
      }

      try {
        const address1 = new web3.eth.Contract(own.abi, this.state.owner);
        await address1.methods
          .createInsurance(
            this.state.insName,
            this.state.insAadhar,
            this.state.insAmount,
            this.state.insDetails,
            this.state.insDocuments,
            this.state.insAadhar.concat(this.padDigits(parseInt(count), 4)),
            parseInt(count) + 1
          )
          .send({ from: accounts[0], gas: 9999999, gasPrice: "40000000000" });
      } catch (err) {
        this.setState({ loadingIns: false });
        alert(err.message);
        this.setState({
          modalHeader: "Error",
          modalContent: "No Insurance Created",
          modalIconColor: "red",
          modalIconName: "cancel",
          isModalOpen: true,
        });
        return;
      }
      this.setState({ loadingIns: false });
      this.setState({
        modalHeader: "Insurance Created Successfully",
        modalContent: "Please Note Insurance Number : ".concat(
          this.state.insAadhar.concat(this.padDigits(parseInt(count), 4))
        ),
        modalIconColor: "green",
        modalIconName: "check circle",
        isModalOpen: true,
        insName: "",
        insAadhar: "",
        insAmount: "",
        insDetails: "",
        insDocuments: "",
      });
    }
  };

  uploadFiles = () => {
    let errorFlag = false;
    if (
      !aadharValidator.isValidNumber(String(this.state.insAadhar)) ||
      validator.isEmpty(this.state.insAadhar)
    ) {
      this.setState({ insAadharError: "Enter Correct Aadhar Number" });
      errorFlag = true;
    } else {
      this.setState({ insAadharError: false });
    }

    if (this.state.selectedFile == null) {
      this.setState({
        modalHeader: "Error",
        modalContent: "Select Atleast One File And Enter Valid Aadhar",
        modalIconColor: "red",
        modalIconName: "cancel",
        isModalOpen: true,
      });
      errorFlag = true;
    }

    if (!errorFlag) {
      this.setState({
        loadingFile: true,
        loaded: 0,
      });
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
            password: this.state.insAadhar,
          },
        })
        .then((res) => {
          // then print response status
          this.setState({
            insDocuments: res.data,
            selectedFile: null,
            loadingFile: false,
          });
        })
        .catch((err) => {
          // then print response status
        });
    }
  };

  renderRequests = (type) => {
    if (this.state.ready == true) {
      if (type == "pending") {
        let filteredPendingRequests = this.state.pendingRequests.filter(
          function (request) {
            return request[0] != "0x0000000000000000000000000000000000000000";
          }
        );
        return filteredPendingRequests.map((req, index) => {
          return <RequestRequests key={index} request={req} type="pending" />;
        });
      } else if (type == "approved") {
        return this.state.approvedRequests.map((req, index) => {
          return <RequestRequests key={index} request={req} type="approved" />;
        });
      } else {
        return this.state.rejectedRequests.map((req, index) => {
          return <RequestRequests key={index} request={req} type="rejected" />;
        });
      }
    }
  };

  renderTable = () => {

    if (this.state.ready == true) {
      const { Row, Cell } = Table;
      return this.state.insurancesIssued.map((n, i) => {
        return (
          <Row>
            <Cell>{n}</Cell>
          </Row>
        );
      });
    }
  };

  getPanesData = () => {
    const panes = [
      {
        menuItem: "New",
        render: () => (
          <Tab.Pane>
            <Grid
              textAlign="left"
              verticalAlign="top"
              columns={1}
            >
              <Grid.Column>
                <Header
                  color="grey"
                  size="huge"
                  as="h1"
                  textAlign="center"
                  style={{
                    fontSize: "40px",
                    fontFamily: '"Arial Black", Gadget, sans-serif',
                    marginTop: "45px",
                    color: "white",
                  }}
                >
                  Insurance
                </Header>
                <Divider horizontal>
                  <Header color="grey" as="h4" style={{ color: "white" }}>
                    Details
                  </Header>
                </Divider>
                <Form
                  onSubmit={this.createNewInsurance}
                  error={!!this.state.errorMessage}
                  className='attached fluid segment'
                >
                  <Form.Field>
                    <label style={{ color: "#767676" }}>Patient Name</label>
                    <Form.Input
                      fluid
                      value={this.state.insName}
                      onChange={(event) =>
                        this.setState({ insName: event.target.value })
                      }
                      placeholder="Name"
                      error={this.state.insNameError}
                    />
                  </Form.Field>
                  <Form.Group widths="equal">
                    <Form.Field>
                      <label style={{ color: "#767676" }}>Aadhar</label>
                      <Form.Input
                        fluid
                        value={this.state.insAadhar}
                        onChange={(event) =>
                          this.setState({ insAadhar: event.target.value })
                        }
                        placeholder="Aadhar"
                        error={this.state.insAadharError}
                      />
                    </Form.Field>
                    <Form.Field>
                      <label style={{ color: "#767676" }}>Amount</label>
                      <Form.Input
                        fluid
                        value={this.state.insAmount}
                        onChange={(event) =>
                          this.setState({ insAmount: event.target.value })
                        }
                        placeholder="Amount"
                        error={this.state.insAmountError}
                      />
                    </Form.Field>
                  </Form.Group>
                  <Form.Field>
                    <label style={{ color: "#767676" }}>Details</label>
                    <Form.Input
                      fluid
                      value={this.state.insDetails}
                      onChange={(event) =>
                        this.setState({ insDetails: event.target.value })
                      }
                      placeholder="Details"
                      error={this.state.insDetailsError}
                    />
                  </Form.Field>
                  <Form.Field>
                    <label style={{ color: "#767676" }}>Documents</label>
                    <Form.Input
                      fluid
                      value={this.state.insDocuments}
                      onChange={(event) =>
                        this.setState({ insDocuments: event.target.value })
                      }
                      placeholder="Document Hash"
                      error={this.state.insDocumentsError}
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
                        loading={this.state.loadingFile}
                        disabled={this.state.loadingFile}
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
                  <Button
                    type="submit"
                    loading={this.state.loadingIns}
                    disabled={this.state.loadingIns}
                    content="Create Insurance"
                    primary
                  />
                </Form>
                <Message attached='bottom' info>
              <Message.Header>Need Help?</Message.Header>
              <p>To create new insurance</p>
                <Message.List>
                  <Message.Item>All details are <b>compulsory</b></Message.Item>
                  <Message.Item><b>Aadhar:</b> Enter aadhar no of <b>registered patient</b> </Message.Item>
                  <Message.Item>You can add <b>multiple files</b> simultaneously in <b>"Select files for upload"</b></Message.Item>
                  <Message.Item>After uploading files, wait till it <b>generates hash</b> and reflects it in the form</Message.Item>
                  <Message.Item>After clicking <b>"Create Insurance"</b> wait till the pop up appears and <b>"note the insurance number"</b></Message.Item>
                  
                </Message.List>
            </Message>
              </Grid.Column>
            </Grid>

          </Tab.Pane>
        ),
      },
      {
        menuItem: "Insurances Issued",
        render: () => (
          <Tab.Pane>
            <Table color="violet" className='attached fluid segment'>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Insurance Issued</Table.HeaderCell>
                </Table.Row>
              </Table.Header>

              <Table.Body>{this.renderTable()}</Table.Body>
            </Table>
            <Message attached='bottom' info>
              <Message.Header>Need Help?</Message.Header>
              <p>Shows insurance issused</p>
                <Message.List>
                  <Message.Item>Shows the <b>deployed address</b> of insurance issused</Message.Item>
                  
                  
                </Message.List>
            </Message>
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Pending",
        render: () => (
          <Tab.Pane>
            <Card.Group centered className='attached fluid segment'>{this.renderRequests("pending")}</Card.Group>
            <Message attached='bottom' info>
              <Message.Header>Need Help?</Message.Header>
              <p>Shows pending insurance requests</p>
              <Message.List>
                <Message.Item>Shows the details of pending requests</Message.Item>
                <Message.Item>You can download the bills and documents</Message.Item>
                <Message.Item>Also approve or reject the request</Message.Item>
                <Message.Item>After clicking <b>"Approve"</b>, wait till the pop up says <b>"Request Approved Successfully"</b></Message.Item>
                <Message.Item>After clicking <b>"Reject"</b>, wait till the pop up says <b>"Request Rejected Successfully"</b></Message.Item>
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
              <p>Shows approved insurance requests</p>
              <Message.List>
                <Message.Item>Shows the details of approved insurance requests</Message.Item>
                <Message.Item>You can download the bills and documents</Message.Item>
              </Message.List>
            </Message>
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Rejected",
        render: () => (
          <Tab.Pane>
            <Card.Group centered className='attached fluid segment'>{this.renderRequests("rejected")}</Card.Group>
            <Message attached='bottom' info>
              <Message.Header>Need Help?</Message.Header>
              <p>Shows rejected insurance requests</p>
              <Message.List>
                <Message.Item>Shows the details of rejected insurance requests</Message.Item>
                <Message.Item>You can download the bills and documents</Message.Item>
              </Message.List>
            </Message>
          </Tab.Pane>
        ),
      },
    ];

    return panes;
  };

  ownerSignin = async () => {
    let errorFlag = false;
    if (validator.isEmpty(this.state.password)) {
      this.setState({
        passwordError: "Enter Correct Aadhar Number",
      });
      errorFlag = true;
    } else {
      this.setState({ passwordError: false });
    }

    if (!errorFlag) {
      let ownAdd, output;
      this.setState({ signinLoading: true, passwordCopy: this.state.password });
      const accounts = await web3.eth.getAccounts();

      try {
        const address = new web3.eth.Contract(
          addMap.abi,
          "0xc821543770F3256f9f78354D6193777dA338f6D1"
        );
        ownAdd = await address.methods
          .getOwnerAddress()
          .call({ from: accounts[0] });
      } catch (err) {
        this.setState({ signinLoading: false });
        return;
      }
      if (ownAdd == 0x0000000000000000000000000000000000000000) {
        this.setState({ signinLoading: false });
        this.setState({
          modalHeader: "Error",
          modalContent: "No Account Exists",
          modalIconColor: "red",
          modalIconName: "cancel",
          isModalOpen: true,
        });
        return;
      } else {
        try {
          const address1 = new web3.eth.Contract(own.abi, ownAdd);
          output = await address1.methods
            .getData(this.state.password)
            .call({ from: accounts[0] });
        } catch (err) {
          this.setState({ signinLoading: false });
          return;
        }
      }
      if (output[0] == false) {
        this.setState({ signinLoading: false });
        this.setState({
          modalHeader: "Error",
          modalContent: "Incorrect Password",
          modalIconColor: "red",
          modalIconName: "cancel",
          isModalOpen: true,
        });
        return;
      } else {
        this.setState({
          insurancesIssuedNum: output[1].length,
          insurancesIssued: output[1],
          requests: output[2],
          owner: output[3],
        });
        this.assign();
        this.setState({
          signinLoading: false,
          isLoginActive: false,
          isDashBoardActive: true,
          password: "",
        });
        this.refresh();
      }
    }
    // const instance1 = new web3.eth.Contract(AddMap.abi, );
    // const instance2 = new web3.eth.Contract(Owner.abi, await instance1.methods.getOwner().call() );
    // const da = await instance.methods.isPasswordCorrect().call( { from: accounts[0] } );
  };

  assign = () => {
    let pendingRequestsTemp = [],
      approvedRequestsTemp = [],
      rejectedRequestsTemp = [],
      i;

    for (i = 0; i < this.state.requests.length; i++) {
      if (this.state.requests[i][11] == false) {
        pendingRequestsTemp.push(this.state.requests[i]);
      } else if (
        this.state.requests[i][11] == true &&
        this.state.requests[i][5] == true
      ) {
        approvedRequestsTemp.push(this.state.requests[i]);
      } else {
        rejectedRequestsTemp.push(this.state.requests[i]);
      }
    }

    this.setState({
      pendingRequestsNum: pendingRequestsTemp.length,
      approvedRequestsNum: approvedRequestsTemp.length,
      rejectedRequestsNum: rejectedRequestsTemp.length,
      pendingRequests: pendingRequestsTemp,
      approvedRequests: approvedRequestsTemp,
      rejectedRequests: rejectedRequestsTemp,
      ready: true,
    });
  };

  ownerSignup = async () => {
    let errorFlag = false;
    if (
      !this.state.password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
      ) ||
      validator.isEmpty(this.state.password)
    ) {
      this.setState({
        modalHeader: "Error",
        modalContent:
          "Password must contain 1 lowercase, 1 uppercase, 1 numeric, 1 special char and length greater than 7",
        modalIconColor: "red",
        modalIconName: "cancel",
        isModalOpen: true,
      });

      errorFlag = true;
    } else {
      this.setState({ passwordError: false });
    }

    if (!errorFlag) {
      let ownAdd, output;
      this.setState({ signupLoading: true });
      const accounts = await web3.eth.getAccounts();

      try {
        const address = new web3.eth.Contract(
          addMap.abi,
          "0xc821543770F3256f9f78354D6193777dA338f6D1"
        );
        ownAdd = await address.methods
          .getOwnerAddress()
          .call({ from: accounts[0] });
      } catch (err) {
        this.setState({ signupLoading: false });
        return;
      }
      if (ownAdd != 0x0000000000000000000000000000000000000000) {
        this.setState({ signupLoading: false });
        this.setState({
          modalHeader: "Error",
          modalContent: "Already Registered",
          modalIconColor: "red",
          modalIconName: "cancel",
          isModalOpen: true,
        });
        return;
      } else {
        try {
          const address1 = new web3.eth.Contract(
            addMap.abi,
            "0xc821543770F3256f9f78354D6193777dA338f6D1"
          );
          await address1.methods
            .createOwner(this.state.password)
            .send({ from: accounts[0], gas: 9999999, gasPrice: "40000000000" });
        } catch (err) {
          this.setState({ signupLoading: false });
          return;
        }
      }

      try {
        const address2 = new web3.eth.Contract(
          addMap.abi,
          "0xc821543770F3256f9f78354D6193777dA338f6D1"
        );
        ownAdd = await address2.methods
          .getOwnerAddress()
          .call({ from: accounts[0] });
      } catch (err) {
        this.setState({ signupLoading: false });
        return;
      }

      try {
        const address3 = new web3.eth.Contract(own.abi, ownAdd);
        output = await address3.methods
          .getData(this.state.password)
          .call({ from: accounts[0] });
      } catch (err) {
        this.setState({ signupLoading: false });
        return;
      }

      this.setState({
        insurancesIssuedNum: 0,
        pendingRequestsNum: 0,
        approvedRequestsNum: 0,
        rejectedRequestsNum: 0,
        insurancesIssued: null,
        pendingRequests: null,
        approvedRequests: null,
        rejectedRequests: null,
        owner: output[3],
      });

      this.setState({
        signupLoading: false,
        isLoginActive: false,
        isDashBoardActive: true,
      });
    }
  };

  handleChange = (e, data) => this.setState(data);

  render() {
    return (
      <div>
        <Head>
          <title>Blockchain Health</title>
          <link rel="shortcut icon" href="/static/favicon.ico" />
        </Head>
        <Layout>
          <BannerInsurance />
          <Confirm
            open={this.state.isLogoutModal}
            onCancel={this.logoutModalClose}
            onConfirm={this.logout}
          />
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
          {this.state.isDashBoardActive ? (
            
            <Segment stacked style={{ background: "#F0F8FF" }}>
              <Container>
              <Button floated="right" onClick={this.logoutModalOpen} negative>
                {" "}
                <Icon name="sign-out" />
                Logout
              </Button>
              <Header color={"grey"} as="h1">
                Dashboard
              </Header>
              <Grid stackable>
                <Grid.Row>
                  <Grid.Column columns={1}>
                    <Statistic size="mini" color="red">
                      <Statistic.Value>{this.state.owner}</Statistic.Value>
                      <label style={{ color: "#767676" }}>Owner</label>
                    </Statistic>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                  <Grid.Column width={3}>
                    <Statistic size="tiny" color="orange">
                      <Statistic.Value>
                        {this.state.insurancesIssuedNum}
                      </Statistic.Value>
                      <label style={{ color: "#767676" }}>
                        Insurances Issued
                      </label>
                    </Statistic>
                  </Grid.Column>
                  <Grid.Column width={3}>
                    <Statistic size="tiny" color="green">
                      <Statistic.Value>
                        {this.state.pendingRequestsNum}
                      </Statistic.Value>
                      <label style={{ color: "#767676" }}>Requests Pending</label>
                    </Statistic>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row columns={2}>
                  <Grid.Column width={3}>
                    <Statistic size="tiny" color="teal">
                      <Statistic.Value>
                        {this.state.approvedRequestsNum}
                      </Statistic.Value>
                      <label style={{ color: "#767676" }}>
                        Requests Approved
                      </label>
                    </Statistic>
                  </Grid.Column>
                  <Grid.Column width={3}>
                    <Statistic size="tiny" color="violet">
                      <Statistic.Value>
                        {this.state.rejectedRequestsNum}
                      </Statistic.Value>
                      <label style={{ color: "#767676" }}>
                        Requests Rejected
                      </label>
                    </Statistic>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
              {/* <Tab
                defaultActiveIndex={1}
                menu={{ color: "teal"}}
                
                style={{ marginTop: "4px" }}
                panes={this.getPanesData()}
                onTabChange={this.handleChange}
              /> */}
              <Tab
                defaultActiveIndex="1"
                color="red"
                style={{ marginTop: "4px" }}
                onTabChange={this.handleChange}
                panes={this.getPanesData()}
              />
            </Container>
            </Segment>
            
          ) : null}
          {this.state.isLoginActive ? (
            <Segment stacked style={{ height: "35vh", background: "#F0F8FF" }}>
              <Grid
                textAlign="center"
                style={{ height: "30vh" }}
                verticalAlign="middle"
              >
                <Grid.Column style={{ maxWidth: 450 }}>
                  <Header as="h2" color="teal" textAlign="center">
                    Log-in to your account
                  </Header>
                  <Input
                    label="Password"
                    fluid
                    onChange={(event) =>
                      this.setState({ password: event.target.value })
                    }
                    value={this.state.password}
                    type="password"
                    placeholder="Password"
                    error={this.state.passwordError}
                    style={{ marginBottom: "4px" }}
                  ></Input>
                  <Button
                    loading={this.state.signinLoading}
                    disabled={this.state.signinLoading}
                    onClick={this.ownerSignin}
                    color="blue"
                  >
                    <Icon name="sign-in" />
                    Sign-In
                  </Button>
                  <Button
                    onClick={this.ownerSignup}
                    loading={this.state.signupLoading}
                    disabled={this.state.signupLoading}
                    color="green"
                  >
                    <Icon name="signup" />
                    Sign-Up
                  </Button>
                </Grid.Column>
              </Grid>
            </Segment>
          ) : null}
        </Layout>
      </div>
    );
  }
}

export default OwnerHomePage;
