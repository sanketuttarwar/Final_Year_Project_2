import React, { Component } from "react";
import {
  Button,
  Confirm,
  Grid,
  Segment,
  Container,
  GridColumn,
} from "semantic-ui-react";
import {
  Form,
  Header,
  Tab,
  Divider,
  Icon,
  Search,
  Image,
  Message,
  Input,
  Modal,
} from "semantic-ui-react";
import Layout from "../components/layout";
import doctor from "../ethereum/build/Doctor";
import medRec from "../ethereum/build/MedicalRecord";
import addMap from "../ethereum/build/AddressMapping";
import own from "../ethereum/build/Owner";

import web3 from "../ethereum/web3";
import validator from "validator";
import MedicalRecordForm from "../components/MedicalRecordForm";
import ShowMedicalRecord from "../components/ShowMedicalRecord";
import BannerDoctor from "../components/BannerDoctor";
import aadharValidator from "aadhaar-validator";
import Head from 'next/head';
import { Link } from "../routes";

export default class DoctorPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      patientData: null,
      searchPatientAadhar: "",
      searchPatientAadharError: false,
      aadhar: "",
      aadharError: false,
      name: "",
      nameError: false,
      details: "",
      detailsError: false,
      newDoctorErrorMessage: "",
      newDoctorLoading: false,
      newDoctorErrorMessage: "",
      searchLoading: false,
      searchErrorMessage: "",
      isSearchPatientActive: true,
      isModalOpen: false,
      modalContent: "",
      modalHeader: "",
      modalIconColor: "red",
      modalIconName: "clock",
      medicalRecordAddress: "",
      once: false,
    };
  }

  async componentDidMount() {
    if(window.ethereum) {
      await ethereum.enable();
    }
  }

  getOnce = () => {
    if( this.state.once == false ) {
      this.setState( { once: true } );
      return false;
    }
    return this.state.once;
  }

  modalTopple = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  handleBackButton = () => {
    this.setState({ isSearchPatientActive: !this.state.isSearchPatientActive });
  };

  searchPatient = async (event) => {
    event.preventDefault();
    let errorFlag = false;

    if (
      !aadharValidator.isValidNumber(String(this.state.searchPatientAadhar)) ||
      validator.isEmpty(this.state.searchPatientAadhar)
    ) {
      this.setState({
        searchPatientAadharError: "Enter Correct Aadhar Number",
      });
      errorFlag = true;
    } else {
      this.setState({ searchPatientAadharError: false });
    }

    if (!errorFlag) {
      this.setState({ searchLoading: true, searchErrorMessage: "" });
      let accounts = await web3.eth.getAccounts();
      let output, medRecAdd;

      try {
        const address = new web3.eth.Contract(
          addMap.abi,
          "0xc821543770F3256f9f78354D6193777dA338f6D1"
        );
        medRecAdd = await address.methods
          .getRecordAddress(this.state.searchPatientAadhar)
          .call();
      } catch (err) {
        this.setState({ searchErrorMessage: err.message });
        this.setState({ searchLoading: err.message });
        return;
      }
      if (medRecAdd == 0x0000000000000000000000000000000000000000) {
        this.setState({
          modalHeader: "Error",
          modalContent: "No Record Exists",
          modalIconColor: "red",
          modalIconName: "cancel",
          isModalOpen: true,
        });
        this.setState({ searchLoading: false });
        return;
      } else {
        try {
          const address1 = new web3.eth.Contract(medRec.abi, medRecAdd);
          output = await address1.methods
            .getPatientData()
            .call({ from: accounts[0] });
        } catch (err) {
          this.setState({ searchErrorMessage: err.message });
          this.setState({ searchLoading: false });
          return;
        }
      }

      if (output[0] == false) {
        this.setState({
          modalHeader: "Error",
          modalContent: "You Are Not Authorized",
          modalIconColor: "red",
          modalIconName: "cancel",
          isModalOpen: true,
        });
        this.setState({ searchLoading: false });
        return;
      } else {
        this.setState({
          medicalRecordAddress: medRecAdd,
          patientData: output,
          isSearchPatientActive: false,
          searchLoading: false,
          searchPatientAadhar: "",
        });
      }
    }
  };

  addNewDoctor = async (event) => {
    event.preventDefault();

    let errorFlag = false;

    if (
      !aadharValidator.isValidNumber(String(this.state.aadhar)) ||
      validator.isEmpty(this.state.aadhar)
    ) {
      this.setState({ aadharError: "Enter Correct Aadhar Number" });
      errorFlag = true;
    } else {
      this.setState({ aadharError: false });
    }

    if (
      !this.state.name.match(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/) ||
      validator.isEmpty(this.state.name)
    ) {
      this.setState({ nameError: "Incorrect Name" });
      errorFlag = true;
    } else {
      this.setState({ nameError: false });
    }

    if (
      validator.isEmpty(this.state.details) ||
      !this.state.details.length > 10
    ) {
      this.setState({ detailsError: "Enter Details" });
      errorFlag = true;
    } else {
      this.setState({ detailsError: false });
    }

    if (!errorFlag) {
      this.setState({ newDoctorLoading: true, newDoctorErrorMessage: "" });
      let accounts = await web3.eth.getAccounts();
      let isDoctor;

      try {
        const address = new web3.eth.Contract(
          doctor.abi,
          "0x30E5039deCB6C107Ffd3e6625b0695265B03fAAA"
        );
        isDoctor = await address.methods.isDoctor(accounts[0]).call();
      } catch (err) {
        this.setState({ newDoctorErrorMessage: err.message });
        this.setState({ newDoctorLoading: false });
        return;
      }

      if (isDoctor) {
        this.setState({
          modalHeader: "Error",
          modalContent: "Already Registered",
          modalIconColor: "red",
          modalIconName: "cancel",
          isModalOpen: true,
        });
        this.setState({ newDoctorLoading: false });
        return;
      } else {
        try {
          const address1 = new web3.eth.Contract(
            doctor.abi,
            "0x30E5039deCB6C107Ffd3e6625b0695265B03fAAA"
          );
          await address1.methods
            .addDoctor(this.state.aadhar, this.state.name, this.state.details)
            .send({
              from: accounts[0], gas: 9999999, gasPrice: "40000000000"
            });
        } catch (err) {
          this.setState({ newDoctorErrorMessage: err.message });
          this.setState({ newDoctorLoading: false });
          return;
        }
      }
      this.setState({
        modalHeader: "Success",
        modalContent: "Registered Successfully",
        modalIconColor: "green",
        modalIconName: "check circle",
        isModalOpen: true,
        aadhar: "",
        name: "",
        details: "",
      });
      this.setState({ newDoctorLoading: false });
    }
  };

  backFunction = () => {
    this.setState({ isSearchPatientActive: true, once: false });
  };

  getPanesData = () => {
    const panes = [
      {
        menuItem: "New Doctor",
        render: () => (
          
          <Tab.Pane>
            <Container>
            <Segment className='attached fluid segment'>
            <Header as="h4" color="grey">
              Add Doctor
            </Header>
            <Form
              error={!!this.state.newDoctorErrorMessage}
              onSubmit={this.addNewDoctor}
            >
              <Form.Field>
                <label style={{ color: "#808080" }}>Aadhar</label>
                <Form.Input
                  fluid
                  value={this.state.aadhar}
                  onChange={(event) =>
                    this.setState({ aadhar: event.target.value })
                  }
                  placeholder="Aadhar"
                  error={this.state.aadharError}
                />
              </Form.Field>
              <Form.Field>
                <label style={{ color: "#808080" }}>Name</label>
                <Form.Input
                  fluid
                  value={this.state.name}
                  onChange={(event) =>
                    this.setState({ name: event.target.value })
                  }
                  placeholder="Name"
                  error={this.state.nameError}
                />
              </Form.Field>

              <label style={{ color: "#808080" }}>Details</label>
              <Form.TextArea
                error={this.state.detailsError}
                value={this.state.details}
                onChange={(event) =>
                  this.setState({ details: event.target.value })
                }
                placeholder="Tell us more about you..."
              />

              <Message
                hidden={!this.state.newDoctorErrorMessage.length != 0}
                header="Oops!"
                content={this.state.newDoctorErrorMessage}
              />
              <Button
                type="submit"
                loading={this.state.newDoctorLoading}
                div={this.state.newDoctorLoading}
                primary
              >
                Create
              </Button>
            </Form>
            </Segment>
            <Message attached='bottom' info>
            <Message.Header>Need Help?</Message.Header>
            <p>For adding new doctor</p>
              <Message.List>
                <Message.Item>All details are <b>compulsory</b></Message.Item>
                <Message.Item>Enter your valid <b>12 digit</b> Aadhar no. ( and not just any random no )!</Message.Item>
                <Message.Item>Also make sure that you use <b>new metamask account</b> with sufficient ethers to register a new Doctor, otherwise it will show already registered with that aadhar card even though you might not have ( as that existing metamask account might already have a registered doctor)</Message.Item>
                {/* <Message.Item>For adding new Doctor <b>0.4 gas fee</b> will be deducted from your metamask account, after that wait till the pop up says <b>"Registered successfully"</b></Message.Item> */}
              </Message.List>
            </Message>
            </Container>
          </Tab.Pane>
          
        ),
      },
      {
        menuItem: "Search Patient",
        render: () => (
          
          <Tab.Pane>
            <Container>
            <Segment className='attached fluid segment'>
            {this.state.isSearchPatientActive ? (
              <div>
                <Header style={{ color: "white" }} textAlign="center" icon>
                  <Icon color="grey" name="search" />
                  Search Patient
                </Header>
                <Form
                  error={!!this.state.errorMessage}
                  onSubmit={this.searchPatient}
                >
                  <Form.Field>
                    <label style={{ color: "#808080" }}>Aadhar</label>
                    <Form.Input
                      fluid
                      value={this.state.searchPatientAadhar}
                      onChange={(event) =>
                        this.setState({
                          searchPatientAadhar: event.target.value,
                        })
                      }
                      placeholder="Aadhar"
                      error={this.state.searchPatientAadharError}
                    />
                  </Form.Field>
                  <Button
                    type="submit"
                    loading={this.state.searchLoading}
                    primary
                  >
                    Search
                  </Button>
                </Form>
              </div>
            ) : (
              <div>
                <ShowMedicalRecord
                  data={this.state.patientData}
                  type="doctor"
                  call={this.backFunction}
                  address={this.state.medicalRecordAddress}
                  password=""
                  once={this.getOnce}
                ></ShowMedicalRecord>
              </div>
            )}
            </Segment>
            <Message attached='bottom' info>
            <Message.Header>Need Help?</Message.Header>
            <p>To search patient</p>
              <Message.List>
              <Message.Item>Only <b>authorized doctors</b> can view, edit and get logs of details of their registered patients and download the files uploaded</Message.Item>
              <Message.Item>Also <b>authorized doctors</b> can claim new request insurance and see pending, approved and rejected requests</Message.Item>
              </Message.List>
            </Message>
            </Container>
          </Tab.Pane>
          
        ),
      },
      {
        menuItem: "New Patient",
        render: () => (
          
          <Tab.Pane>
            <Container>
              <Segment>
                          <MedicalRecordForm></MedicalRecordForm>
              </Segment >
              
              
            </Container>
          </Tab.Pane>
          
        ),
      },
    ];
    return panes;
  };

  render() {
    return (
      <div>
        <Head>
          <title>Blockchain Health</title>
          <link rel="shortcut icon" href="/static/favicon.ico" />
        </Head>
        <Layout>
          <BannerDoctor />
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

          <Segment style={{ background: "#f0f8ff" }}>
            <Container>
            <Tab defaultActiveIndex="1" color="red" panes={this.getPanesData()} />
            </Container>
          </Segment>
        </Layout>
      </div>
    );
  }
}
