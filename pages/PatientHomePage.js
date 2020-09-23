import React, { Component } from "react";
import Layout from "../components/layout";
import validator from "validator";
import ShowMedicalRecord from "../components/ShowMedicalRecord";
import medRec from "../ethereum/build/MedicalRecord";
import addMap from "../ethereum/build/AddressMapping";
import doc from "../ethereum/build/Doctor";
import web3 from "../ethereum/web3";
import aadharValidator from "aadhaar-validator";
import Head from 'next/head';

import {
  Segment,
  Form,
  Header,
  Tab,
  Button,
  Divider,
  Icon,
  Search,
  Image,
  Message,
  Input,
  Modal,
  Container,
} from "semantic-ui-react";

export class PatientHomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchPatientAadhar: "",
      searchPatientAadharError: false,
      searchPatientPassword: "",
      searchPatientPasswordError: false,
      emergencyAadhar: "",
      emergencyAadharError: false,
      aadhar: "",
      aadharError: false,
      docAadhar: "",
      docAadharError: false,
      password: "",
      passwordError: false,
      searchPatientLoading: false,
      emergencyLoading: false,
      addDoctorLoading: false,
      errorMessage: "",
      isSearchPatientActive: true,
      patientData: null,

      isModalOpen: false,
      modalContent: "",
      modalHeader: "",
      modalIconColor: "red",
      modalIconName: "clock",

      emergencyData: "",

      addInsuranceLoading: false,
      insAadhar: "",
      insAadharError: false,
      insNumber: "",
      insNumberError: false,
      insPassword: "",
      insPasswordError: false,
      medicalRecordAddress: false,

      passwordCopy: "",
      once: false,

      doctorDetailsAadhar: '',
      doctorDetailsAadharError: false,
      doctorDetailsLoading: false,
    };
  }

  getOnce = () => {
    if( this.state.once == false ) {
      this.setState( { once: true } );
      return false;
    }
    return this.state.once;
  }

  async componentDidMount() {
    if(window.ethereum) {
      await ethereum.enable();
    }
    // const myContract = new web3.eth.Contract(
    //   medRec.abi,
    //   "0x419a72047fE1A64742781F8C22ecc17228e9b217"
    // );
    // myContract
    //   .getPastEvents(
    //     "LogBook",
    //     {
    //       fromBlock: 0,
    //       toBlock: "latest",
    //     },
    //     function (error, events) {
    //     }
    //   )
    //   .then(function (events) {

    //   });

    // myContract.events
    //   .ChangeOccured({}, function (error, event) {

    //   })
    //   .on("data", function (event) {

    //   }
    //   )
    //   .on("changed", function (event) {
    //     // remove event from local database

    //   })
    //   .on("error", console.error);
  }

  modalTopple = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  addDoctor = async () => {
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
      !aadharValidator.isValidNumber(String(this.state.docAadhar)) ||
      validator.isEmpty(this.state.docAadhar)
    ) {
      this.setState({ docAadharError: "Enter Correct Aadhar Number" });
      errorFlag = true;
    } else {
      this.setState({ docAadharError: false });
    }

    if (!errorFlag) {
      this.setState({ addDoctorLoading: true, errorMessage: "" });
      let accounts = await web3.eth.getAccounts();
      let output, medRecAdd, docAdd, isDocAll;

      try {
        const address = new web3.eth.Contract(
          addMap.abi,
          "0xc821543770F3256f9f78354D6193777dA338f6D1"
        );
        medRecAdd = await address.methods
          .getRecordAddress(this.state.aadhar)
          .call();
      } catch (err) {
        this.setState({ errorMessage: err.message });
        this.setState({ searchPatientLoading: false });
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
        this.setState({ addDoctorLoading: false });
        return;
      } else {
        try {
          const address1 = new web3.eth.Contract(
            doc.abi,
            "0x30E5039deCB6C107Ffd3e6625b0695265B03fAAA"
          );
          docAdd = await address1.methods
            .getDoctorAddress(this.state.docAadhar)
            .call();
        } catch (err) {
          this.setState({ errorMessage: err.message });
          this.setState({ searchPatientLoading: false });
          return;
        }
      }

      if (docAdd == 0x0000000000000000000000000000000000000000) {
        this.setState({
          modalHeader: "Error",
          modalContent: "No Such Doctor Exists",
          modalIconColor: "red",
          modalIconName: "cancel",
          isModalOpen: true,
        });
        this.setState({ addDoctorLoading: false });
        return;
      } else {
        try {
          const address2 = new web3.eth.Contract(medRec.abi, medRecAdd);
          output = await address2.methods
            .isCorrectPassword(this.state.password)
            .call({ from: accounts[0] });
        } catch (err) {
          this.setState({ addDoctorLoading: false });
          return;
        }
      }

      if (output != true) {
        this.setState({
          modalHeader: "Error",
          modalContent: "Incorrect Password",
          modalIconColor: "red",
          modalIconName: "cancel",
          isModalOpen: true,
        });
        this.setState({ addDoctorLoading: false });
        return;
      } else {
        try {

          const address4 = new web3.eth.Contract(medRec.abi, medRecAdd);
          isDocAll = await address4.methods.isDoctorAllowed(docAdd).call();
        } catch (err) {
          this.setState({ addDoctorLoading: false });
          return;
        }
      }

      if (isDocAll == true) {
        this.setState({
          modalHeader: "Error",
          modalContent: "Doctor Already Authorised",
          modalIconColor: "red",
          modalIconName: "cancel",
          isModalOpen: true,
        });
        this.setState({ addDoctorLoading: false });
        return;
      } else {
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        try {
          const address3 = new web3.eth.Contract(medRec.abi, medRecAdd);
          await address3.methods
            .addDoctor(docAdd, this.state.password, "New Doctor Authorised at ".concat(dateTime), "Doctor Aadhar :-".concat(this.state.docAadhar).concat(" ").concat("Doctor Address :-").concat(docAdd))
            .send({ from: accounts[0], gas: 9999999, gasPrice: "40000000000" });
        } catch (err) {
          this.setState({ searchPatientLoading: false });
          return;
        }
      }
      this.setState({
        modalHeader: "Success",
        modalContent: "Doctor Added Successfully",
        modalIconColor: "green",
        modalIconName: "check circle",
        isModalOpen: true,
        aadhar: "",
        docAadhar: "",
        password: "",
      });
      this.setState({ addDoctorLoading: false });
    }
  };

  getEmergency = async () => {
    let errorFlag = false;

    if (
      !aadharValidator.isValidNumber(String(this.state.emergencyAadhar)) ||
      validator.isEmpty(this.state.emergencyAadhar)
    ) {
      this.setState({ emergencyAadharError: "Enter Correct Aadhar Number" });
      errorFlag = true;
    } else {
      this.setState({ emergencyAadharError: false });
    }

    if (!errorFlag) {
      this.setState({ emergencyLoading: true });
      let accounts = await web3.eth.getAccounts();
      let output, medRecAdd;

      try {
        const address = new web3.eth.Contract(
          addMap.abi,
          "0xc821543770F3256f9f78354D6193777dA338f6D1"
        );
        medRecAdd = await address.methods
          .getRecordAddress(this.state.emergencyAadhar)
          .call();
      } catch (err) {
        this.setState({ emergencyLoading: false });
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
        this.setState({ emergencyLoading: false });
        return;
      } else {
        try {
          const address1 = new web3.eth.Contract(medRec.abi, medRecAdd);
          output = await address1.methods.getEmergencyData().call();
        } catch (err) {
          this.setState({ emergencyLoading: false });
          return;
        }
      }

      this.setState({
        modalHeader: "Emergency",
        modalContent: output,
        modalIconColor: "blue",
        modalIconName: "emergency",
        isModalOpen: true,
        emergencyAadhar: "",
      });
      this.setState({ emergencyLoading: false });
    }
  };

  searchPatient = async () => {
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

    if (validator.isEmpty(this.state.searchPatientPassword)) {
      this.setState({
        searchPatientPasswordError: "Enter Correct Aadhar Number",
      });
      errorFlag = true;
    } else {
      this.setState({ searchPatientPasswordError: false });
    }

    if (!errorFlag) {
      this.setState({
        searchPatientLoading: true,
        passwordCopy: this.state.searchPatientPassword,
      });
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
        this.setState({ searchPatientLoading: false });
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
        this.setState({ searchPatientLoading: false });
        return;
      } else {
        try {
          const address1 = new web3.eth.Contract(medRec.abi, medRecAdd);
          output = await address1.methods
            .getPatientDataPassword(this.state.searchPatientPassword)
            .call({ from: accounts[0] });
            console.log(output);
        } catch (err) {
          this.setState({ searchPatientLoading: false });
          return;
        }
      }

      if (output[0] == false) {
        this.setState({
          modalHeader: "Error",
          modalContent: "Incorrect Password",
          modalIconColor: "red",
          modalIconName: "cancel",
          isModalOpen: true,
        });
        this.setState({ searchPatientLoading: false });
        return;
      } else {
        this.setState({
          medicalRecordAddress: medRecAdd,
          patientData: output,
          isSearchPatientActive: false,
          searchPatientLoading: false,
          searchPatientAadhar: "",
          searchPatientPassword: "",
        });
      }
    }
  };

  addInsurance = async () => {
    let errorFlag = false;

    if (
      !aadharValidator.isValidNumber(String(this.state.insAadhar)) ||
      validator.isEmpty(this.state.insAadhar)
    ) {
      this.setState({
        insAadharError: "Enter Correct Aadhar Number",
      });
      errorFlag = true;
    } else {
      this.setState({ insAadharError: false });
    }

    if (
      !validator.isNumeric(this.state.insNumber) ||
      validator.isEmpty(this.state.insNumber) ||
      this.state.insNumber.length != 16
    ) {
      this.setState({ insNumberError: "Enter Correct Insurance Number" });
      errorFlag = true;
    } else {
      this.setState({ insNumberError: false });
    }

    if (!errorFlag) {
      this.setState({ addInsuranceLoading: true });
      let accounts = await web3.eth.getAccounts();
      let output, medRecAdd, insNum;

      try {
        const address = new web3.eth.Contract(
          addMap.abi,
          "0xc821543770F3256f9f78354D6193777dA338f6D1"
        );
        medRecAdd = await address.methods
          .getRecordAddress(this.state.insAadhar)
          .call();
      } catch (err) {
        this.setState({ addInsuranceLoading: false });
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
        this.setState({ addInsuranceLoading: false });
        return;
      } else {
        try {
          const address3 = new web3.eth.Contract(
            addMap.abi,
            "0xc821543770F3256f9f78354D6193777dA338f6D1"
          );
          insNum = await address3.methods
            .getInsuranceAddress(this.state.insNumber)
            .call();
        } catch (err) {
          this.setState({ addInsuranceLoading: false });
          return;
        }
      }

      if (insNum == 0x0000000000000000000000000000000000000000) {
        this.setState({
          modalHeader: "Error",
          modalContent: "No Insurance Exists",
          modalIconColor: "red",
          modalIconName: "cancel",
          isModalOpen: true,
        });
        this.setState({ addInsuranceLoading: false });
        return;
      } else {
        try {
          const address1 = new web3.eth.Contract(medRec.abi, medRecAdd);
          output = await address1.methods
            .isCorrectPassword(this.state.insPassword)
            .call({ from: accounts[0] });
        } catch (err) {
          this.setState({ addInsuranceLoading: false });
          return;
        }
      }
      if (!output) {
        this.setState({
          modalHeader: "Error",
          modalContent: "Incorrect Password",
          modalIconColor: "red",
          modalIconName: "cancel",
          isModalOpen: true,
        });
        this.setState({ addInsuranceLoading: false });
        return;
      } else {
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        try {
          const address2 = new web3.eth.Contract(medRec.abi, medRecAdd);
          await address2.methods
            .addInsurance(this.state.insNumber, this.state.insPassword, "New Insurance Added at ".concat(dateTime), "Insurance with ID :-".concat(this.state.insNumber+" ").concat(" was added."))
            .send({ from: accounts[0], gas: 9999999, gasPrice: "40000000000" });
        } catch (err) {
          this.setState({ addInsuranceLoading: false });
          return;
        }
      }
      this.setState({
        modalHeader: "Success",
        modalContent: "Insurance Added Successfully",
        modalIconColor: "green",
        modalIconName: "check circle",
        isModalOpen: true,
        insAadhar: "",
        insNumber: "",
        insPassword: "",
      });
      this.setState({ addInsuranceLoading: false });
    }
  };

  backFunction = () => {
    this.setState({ isSearchPatientActive: true, once: false });
  };

  getDoctorDetails = async () => {
    let errorFlag = false;

    if((validator.isEmpty(this.state.doctorDetailsAadhar)) || (( this.state.doctorDetailsAadhar.length != 12 ) && (this.state.doctorDetailsAadhar.length != 42))) {
      this.setState( { doctorDetailsAadharError: "Please Enter Correct Details" } );
      errorFlag = true;
    } else {
      if(this.state.doctorDetailsAadhar.length == 12) {
        if (
          !aadharValidator.isValidNumber(String(this.state.doctorDetailsAadhar)) ||
          validator.isEmpty(this.state.doctorDetailsAadhar)
        ) {
          this.setState({
            doctorDetailsAadharError: "Enter Correct Aadhar Number",
          });
          errorFlag = true;
        } else {
          this.setState({ doctorDetailsAadharError: false });
        }
      }
    }

    if(!errorFlag) {
      if(this.state.doctorDetailsAadhar.length == 12) {
        this.setState({ doctorDetailsLoading: true });
        let accounts = await web3.eth.getAccounts();
        let output, docAddress;

        try {
          const address = new web3.eth.Contract(
            doc.abi,
            "0x30E5039deCB6C107Ffd3e6625b0695265B03fAAA"
          );
          docAddress = await address.methods.getDoctorAddress(this.state.doctorDetailsAadhar).call();
        } catch (err) {
          this.setState({ doctorDetailsLoading: false });
          return;
        }
        if(docAddress == '0x0000000000000000000000000000000000000000') {
          this.setState({
            modalHeader: "Error",
            modalContent: "No Such Doctor Exists",
            modalIconColor: "red",
            modalIconName: "cancel",
            isModalOpen: true,
            insAadhar: "",
            insNumber: "",
            insPassword: "",
          });
          this.setState({ doctorDetailsLoading: false });
          this.setState({ doctorDetailsAadhar: '' });
          return;
        } else {
          try {
            const address1 = new web3.eth.Contract(
              doc.abi,
              "0x30E5039deCB6C107Ffd3e6625b0695265B03fAAA"
            );
            output = await address1.methods.map(docAddress).call();
          } catch (err) {
            this.setState({ doctorDetailsLoading: false });
            this.setState({ doctorDetailsAadhar: '' });
            return;
          }
          this.setState({
            modalHeader: output[1],
            modalContent: "Details :- ".concat(output[2]),
            modalIconColor: "green",
            modalIconName: "doctor",
            isModalOpen: true,
            insAadhar: "",
            insNumber: "",
            insPassword: "",
          });
          this.setState({ doctorDetailsLoading: false });
          this.setState({ doctorDetailsAadhar: '' });
        }

      }else {
        this.setState({ doctorDetailsLoading: true });
        let accounts = await web3.eth.getAccounts();
        let output;
  
        try {
          const address = new web3.eth.Contract(
            doc.abi,
            "0x30E5039deCB6C107Ffd3e6625b0695265B03fAAA"
          );
          output = await address.methods.map(this.state.doctorDetailsAadhar).call();
        } catch (err) {
          this.setState({ doctorDetailsLoading: false });
          this.setState({ doctorDetailsAadhar: '' });
          return;
        }

        if(output[0] == 0) {
          this.setState({
            modalHeader: "Error",
            modalContent: "No Such Doctor Exists",
            modalIconColor: "red",
            modalIconName: "cancel",
            isModalOpen: true,
            insAadhar: "",
            insNumber: "",
            insPassword: "",
          });
          this.setState({ doctorDetailsLoading: false });
          this.setState({ doctorDetailsAadhar: '' });
          return;
        }

        this.setState({
          modalHeader: output[1],
          modalContent: "Details :- ".concat(output[2]),
          modalIconColor: "green",
          modalIconName: "doctor",
          isModalOpen: true,
          insAadhar: "",
          insNumber: "",
          insPassword: "",
        });
        this.setState({ doctorDetailsLoading: false });
        this.setState({ doctorDetailsAadhar: '' });
      }
    }
  }

  getPanesData = () => {
    const panes = [
      {
        menuItem: "Search Patient",
        render: () => (
          <Tab.Pane>
            {this.state.isSearchPatientActive ? (
              <div>
                <Header as="h4" color="grey">
                  Search Patient
                </Header>
                <Form
                  error={!!this.state.errorMessage}
                  onSubmit={this.searchPatient}
                  className='attached fluid segment'
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
                  <Form.Field>
                    <label style={{ color: "#808080" }}>Password</label>
                    <Form.Input
                      type="password"
                      fluid
                      value={this.state.searchPatientPassword}
                      onChange={(event) =>
                        this.setState({
                          searchPatientPassword: event.target.value,
                        })
                      }
                      placeholder="Password"
                      error={this.state.searchPatientPasswordError}
                    />
                  </Form.Field>
                  <Button
                    type="submit"
                    loading={this.state.searchPatientLoading}
                    disabled={this.state.searchPatientLoading}
                    primary
                  >
                    Search
                  </Button>
                </Form>
                <Message attached='bottom' info>
              <Message.Header>Need Help?</Message.Header>
                <p>To search patient</p>
                <Message.List>
                  <Message.Item>Enter aadhar no of <b>registered patient</b> </Message.Item>
                  <Message.Item>Enter the password which was provided for creating this patient's contract</Message.Item>
                  <Message.Item>After searching, you can see medical record and logs but you <b>cannot edit</b> it</Message.Item>
                  <Message.Item>Also you can <b>download</b> the corresponding uploaded files</Message.Item>
                </Message.List>
            </Message>
              </div>
            ) : (
              <ShowMedicalRecord
                data={this.state.patientData}
                type="patient"
                call={this.backFunction}
                address={this.state.medicalRecordAddress}
                password={this.state.passwordCopy}
                once={this.getOnce}
              ></ShowMedicalRecord>
            )}
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Emergency",
        render: () => (
          <Tab.Pane>
            <Header as="h4" color="grey">
              Get Emergency Details
            </Header>
            <Form
              error={!!this.state.errorMessage}
              onSubmit={this.getEmergency}
            >
              <Form.Field>
                <label style={{ color: "#808080" }}>Aadhar</label>
                <Form.Input
                  fluid
                  value={this.state.emergencyAadhar}
                  onChange={(event) =>
                    this.setState({ emergencyAadhar: event.target.value })
                  }
                  placeholder="Aadhar"
                  error={this.state.emergencyAadharError}
                />
              </Form.Field>
              <Message error header="Oops!" content={this.state.errorMessage} />
              <Button
                type="submit"
                loading={this.state.emergencyLoading}
                disabled={this.state.emergencyLoading}
                primary
              >
                Search
              </Button>
            </Form>
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Add Doctor",
        render: () => (
          <Tab.Pane>
            <Header as="h4" color="grey">
              Add Doctor
            </Header>
            <Form error={!!this.state.errorMessage} onSubmit={this.addDoctor} className='attached fluid segment'>
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
                <label style={{ color: "#808080" }}>Doctor Aadhar</label>
                <Form.Input
                  fluid
                  value={this.state.docAadhar}
                  onChange={(event) =>
                    this.setState({ docAadhar: event.target.value })
                  }
                  placeholder="Aadhar"
                  error={this.state.docAadharError}
                />
              </Form.Field>
              <Form.Field>
                <label style={{ color: "#808080" }}>Password</label>
                <Form.Input
                  fluid
                  type="password"
                  value={this.state.password}
                  onChange={(event) =>
                    this.setState({ password: event.target.value })
                  }
                  placeholder="Password"
                  error={this.state.passwordError}
                />
              </Form.Field>
              <Message
                hidden={!this.state.errorMessage.length != 0}
                header="Oops!"
                content={this.state.errorMessage}
              />
              <Button
                type="submit"
                loading={this.state.addDoctorLoading}
                disabled={this.state.addDoctorLoading}
                primary
              >
                Add
              </Button>
            </Form>
            <Message attached='bottom' info>
              <Message.Header>Need Help?</Message.Header>
              <p>To authorise different doctor</p>
                <Message.List>
                  <Message.Item><b>Aadhar:</b> Enter aadhar no of <b>registered patient</b> </Message.Item>
                  <Message.Item><b>Doctor Aadhar:</b> Enter the aadhar no of some different doctor whom you want to authorise</Message.Item>
                  <Message.Item><b>Password:</b> Enter the password which was provided for creating this patient's contract, so that the other doctor can see the record using this password</Message.Item>
                  <Message.Item>After clicking on <b>"Add"</b>, wait till the pop up shows <b>"Doctor added successfully"</b></Message.Item>
                </Message.List>
            </Message>
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Add Insurance",
        render: () => (
          <Tab.Pane>
            <Header as="h4" color="grey">
              Add Insurance
            </Header>
            <Form
              error={!!this.state.errorMessage}
              onSubmit={this.addInsurance}
              className='attached fluid segment'
            >
              <Form.Field>
                <label style={{ color: "#808080" }}>Aadhar</label>
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
                <label style={{ color: "#808080" }}>Insurance Number</label>
                <Form.Input
                  fluid
                  value={this.state.insNumber}
                  onChange={(event) =>
                    this.setState({ insNumber: event.target.value })
                  }
                  placeholder="Insurance Number"
                  error={this.state.insNumberError}
                />
              </Form.Field>
              <Form.Field>
                <label style={{ color: "#808080" }}>Password</label>
                <Form.Input
                  fluid
                  type="password"
                  value={this.state.insPassword}
                  onChange={(event) =>
                    this.setState({ insPassword: event.target.value })
                  }
                  placeholder="Password"
                  error={this.state.insPasswordError}
                />
              </Form.Field>

              <Button
                type="submit"
                loading={this.state.addInsuranceLoading}
                disabled={this.state.addInsuranceLoading}
                primary
              >
                Add
              </Button>
            </Form>
            <Message attached='bottom' info>
              <Message.Header>Need Help?</Message.Header>
              <p>To add new insurance</p>
                <Message.List>
                  <Message.Item><b>Aadhar:</b> Enter aadhar no of <b>registered patient</b> </Message.Item>
                  <Message.Item><b>Insurance Number:</b> Enter the insurance number given by <b>insurance admin</b></Message.Item>
                  <Message.Item><b>Password:</b> Enter the password which was provided for creating this patient's contract</Message.Item>
                  <Message.Item>After clicking on <b>"Add"</b>, wait till the pop up shows <b>"Insurance added successfully"</b></Message.Item>
                </Message.List>
            </Message>
          </Tab.Pane>
        ),
      },
      {
        menuItem: "Doctor Info.",
        render: () => (
          <Tab.Pane>
            <Header as="h4" color="grey">
              Get Doctor Details
            </Header>
            <Form
              onSubmit={this.getDoctorDetails}
              className='attached fluid segment'
            >
              <Form.Field>
                <label style={{ color: "#808080" }}>Aadhar/Doctor Address</label>
                <Form.Input
                  fluid
                  value={this.state.doctorDetailsAadhar}
                  onChange={(event) =>
                    this.setState({ doctorDetailsAadhar: event.target.value })
                  }
                  placeholder="Aadhar"
                  error={this.state.doctorDetailsAadharError}
                />
              </Form.Field>
              <Button
                type="submit"
                loading={this.state.doctorDetailsLoading}
                disabled={this.state.doctorDetailsLoading}
                primary
              >
                Search
              </Button>
            </Form>
            <Message attached='bottom' info>
            <Message.Header>Need Help?</Message.Header>
            <p>To get Doctor info.</p>
              <Message.List>
              <Message.Item>Enter <b>valid 12 digit</b> aadhar no to fetch doctor's details</Message.Item>
              </Message.List>
            </Message>
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
          <Segment style={{ background: "#F0F8FF" , marginTop:'58px'}}>
            <Container>
            <Tab defaultActiveIndex="0" color="red" panes={this.getPanesData()} />
            </Container>
          </Segment>
        </Layout>
      </div>
    );
  }
}

export default PatientHomePage;
