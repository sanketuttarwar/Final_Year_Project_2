import validator from "validator";

import React, { Component } from "react";
import web3 from "../ethereum/web3";
import axios from "axios";
import medRec from "../ethereum/build/MedicalRecord";
import addMap from "../ethereum/build/AddressMapping";
import {
  Segment,
  Form,
  Input,
  Modal,
  Image,
  Progress,
  Header,
  Dimmer,
  Loader,
  List,
  Message,
  Popup,
  Icon,
  Label,
  Button,
  Grid,
  Dropdown,
  Divider,
} from "semantic-ui-react";
import Logs from "./logs";
import ShowInsurance from "./showInsurance";
import ins from "../ethereum/build/Insurance";

export default class ShowMedicalRecord extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      gender: "",
      dob: "",
      mobile: "",
      aadhar: "",
      paddress: "",
      postalcode: "",
      country: "",

      medicalHistory: "",
      diagnosis: "",
      medications: "",
      allergies: "",
      progressNotes: "",
      vitalSigns: "",
      immunizationDates: "",
      emergency: "",

      medicalHistoryOri: "",
      diagnosisOri: "",
      medicationsOri: "",
      allergiesOri: "",
      progressNotesOri: "",
      vitalSignsOri: "",
      immunizationDatesOri: "",
      emergencyOri: "",

      billingData: "",
      radiologyImages: "",
      labResults: "",
      insurances: "",

      billingDataEdit: "",
      radiologyImagesEdit: "",
      labResultsEdit: "",
      insurancesEdit: "",

      applyFileChangesLoading: false,
      applyFileChangesLoading: false,
      applyNonDemChangesErrorMessage: "",
      applyFileChangesErrorMessage: "",

      selectedFile: null,
      billingDataLoad: false,
      billingLoadedPercent: 0,
      radiologyImagesLoad: false,
      radiologyLoadedPercent: 0,
      labResultsLoad: false,
      labresultsLoadedPercent: 0,

      isShowActive: true,
      isEditActive: false,
      isLoaderDimmerActive: false,
      isInsuranceActive: false,

      insuranceData: null,

      isModalOpen: false,
      modalContent: "",
      modalHeader: "",
      modalIconColor: "red",
      modalIconName: "clock",

      insuranceAddress: "",
      ready: false,

      isLogsActive: false,
      getLogsLoading: false,
      logEvents: null,
    };
  }

  toggle = () => {
    this.setState( { 
      medicalHistoryOri: this.state.medicalHistory,
      diagnosisOri: this.state.diagnosis,
      medicationsOri: this.state.medications,
      allergiesOri: this.state.allergies,
      progressNotesOri: this.state.progressNotes,
      vitalSignsOri: this.state.vitalSigns,
      immunizationDatesOri: this.state.immunizationDates,
      emergencyOri: this.state.emergency,
     } )
    this.setState({
      isEditActive: !this.state.isEditActive,
      isShowActive: !this.state.isShowActive,
    });
  };

  toggleInsurance = () => {
    this.setState({
      isInsuranceActive: !this.state.isInsuranceActive,
      isShowActive: !this.state.isShowActive,
    });
  };

  onFileSelect = (event) => {
    var files = event.target.files;
    this.setState({
      selectedFile: files,
    });
  };

  uploadFiles = async (buttonType) => {
    let ready = false;
    let accounts = await web3.eth.getAccounts();
    let isDoctorAllowed, medRecAdd, output;

    try {
      const address = new web3.eth.Contract(
        addMap.abi,
        "0xc821543770F3256f9f78354D6193777dA338f6D1"
      );
      medRecAdd = await address.methods
        .getRecordAddress(this.state.aadhar)
        .call();
    } catch (err) {
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
      return;
    } else {
      try {
        const address1 = new web3.eth.Contract(medRec.abi, medRecAdd);
        isDoctorAllowed = await address1.methods
          .isDoctorAllowed(accounts[0])
          .call();
      } catch (err) {
        return;
      }

      if (isDoctorAllowed == false) {
        this.setState({
          modalHeader: "Error",
          modalContent: "You Are Not Authorized",
          modalIconColor: "red",
          modalIconName: "cancel",
          isModalOpen: true,
        });
        return;
      } else {
        try {
          const address2 = new web3.eth.Contract(medRec.abi, medRecAdd);
          output = await address2.methods.getFilePassword().call({
            from: accounts[0],
          });
        } catch (err) {
          return;
        }
        ready = true;
      }
    }

    if (ready) {
      const data = new FormData();
      for (var x = 0; x < this.state.selectedFile.length; x++) {
        data.append("file", this.state.selectedFile[x]);
      }

      if (buttonType == "billing") {
        this.setState({
          billingLoadedPercent: 0,
        });
      } else if (buttonType == "radiology") {
        this.setState({
          radiologyLoadedPercent: 0,
        });
      } else {
        this.setState({
          labresultsLoadedPercent: 0,
        });
      }

      axios
        .post("/upload", data, {
          onUploadProgress: (ProgressEvent) => {
            if (buttonType == "billing") {
              this.setState({
                billingLoadedPercent:
                  (ProgressEvent.loaded / ProgressEvent.total) * 100,
              });
            } else if (buttonType == "radiology") {
              this.setState({
                radiologyLoadedPercent:
                  (ProgressEvent.loaded / ProgressEvent.total) * 100,
              });
            } else {
              this.setState({
                labresultsLoadedPercent:
                  (ProgressEvent.loaded / ProgressEvent.total) * 100,
              });
            }

            if (
              this.state.billingLoadedPercent == 100 ||
              this.state.radiologyLoadedPercent == 100 ||
              this.state.labresultsLoadedPercent == 100
            ) {
              this.setState({
                selectedFile: null,
              });
            }
          },
          params: {
            password: output,
          },
        })
        .then((res) => {
          // then print response status
          if (buttonType == "billing") {
            this.setState({
              billingDataEdit: res.data,
              billingDataLoad: false,
              selectedFile: null,
            });
          } else if (buttonType == "radiology") {
            this.setState({
              radiologyImagesEdit: res.data,
              radiologyImagesLoad: false,
              selectedFile: null,
            });
          } else {
            this.setState({
              labResultsEdit: res.data,
              labResultsLoad: false,
              selectedFile: null,
            });
          }
          this.setState({ selectedFile: null });
        })
        .catch((err) => {
          // then print response status
        });
    }

    if (!ready) {
      if (buttonType == "billing") {
        this.setState({
          billingDataLoad: false,
          selectedFile: null,
        });
      } else if (buttonType == "radiology") {
        this.setState({
          radiologyImagesLoad: false,
          selectedFile: null,
        });
      } else {
        this.setState({
          labResultsLoad: false,
          selectedFile: null,
        });
      }
    }
  };

  uploadBillingData = () => {
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
      if (
        this.state.radiologyImagesLoad == false &&
        this.state.labResultsLoad == false
      ) {
        console.log("pppppprrrrrrrrrrrrrr rrrrrrrrrrr rrrrrrrrrrr");
        this.setState({ billingDataLoad: true });
        this.uploadFiles("billing");
      }
    }
  };

  uploadRadiologyImages = () => {
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
      if (
        this.state.billingDataLoad == false &&
        this.state.labResultsLoad == false
      ) {
        this.setState({ radiologyImagesLoad: true });
        this.uploadFiles("radiology");
      }
    }
  };

  uploadLabresults = () => {
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
      if (
        this.state.radiologyImagesLoad == false &&
        this.state.billingDataLoad == false
      ) {
        this.setState({ labResultsLoad: true });
        this.uploadFiles("labresults");
      }
    }
  };

  async componentDidMount() {
    // this.setState( { name: 'sanket', gender: 'male', medicalHistory: 'sdfsfdsfsdf', diagnosis: 'asdasdsad', labResults: 'sadsafdsfdsf' } );
    // const accounts = await web3.eth.getAccounts();
    // const mr = new web3.eth.Contract(medRec.abi, '0x7f94d11a648211b6ac67e749e10d78b2ba0afe8a');
    // const demographicsData = await mr.methods
    // .password()
    // .call();

    // this.setState( { name: demographicsData } );
     console.log(this.props.data);
    if(this.props.once() == false) {
      this.setState({
        name: this.props.data[1][0],
        gender: this.props.data[1][1],
        dob: this.props.data[1][2],
        mobile: this.props.data[1][3],
        aadhar: this.props.data[1][4],
        paddress: this.props.data[1][5],
        postalcode: this.props.data[1][6],
        country: this.props.data[1][7],
        medicalHistory: this.props.data[2][0],
        diagnosis: this.props.data[2][1],
        medications: this.props.data[2][2],
        allergies: this.props.data[2][3],
        progressNotes: this.props.data[2][4],
        vitalSigns: this.props.data[2][5],
        immunizationDates: this.props.data[2][6],
        emergency: this.props.data[2][7],
        billingData: this.props.data[3][0],
        radiologyImages: this.props.data[3][1],
        labResults: this.props.data[3][2],
        insurances: this.props.data[3][3],
      });
      this.setState({ ready: true });
    }else {
      this.setState( { ready: false } );
      let accounts = await web3.eth.getAccounts();
      let output;
      if(this.props.type == 'doctor') {
        try {
          const address1 = new web3.eth.Contract(medRec.abi, this.props.address);
          output = await address1.methods
            .getPatientData()
            .call({ from: accounts[0] });
        } catch (err) {
          return;
        }
        console.log(output);
        this.setState({
          name: output[1][0],
          gender: output[1][1],
          dob: output[1][2],
          mobile: output[1][3],
          aadhar: output[1][4],
          paddress: output[1][5],
          postalcode: output[1][6],
          country: output[1][7],
          medicalHistory: output[2][0],
          diagnosis: output[2][1],
          medications: output[2][2],
          allergies: output[2][3],
          progressNotes: output[2][4],
          vitalSigns: output[2][5],
          immunizationDates: output[2][6],
          emergency: output[2][7],
          billingData: output[3][0],
          radiologyImages: output[3][1],
          labResults: output[3][2],
          insurances: output[3][3],
        });
        this.setState( { ready: true } );
      }else {
        try {
          const address2 = new web3.eth.Contract(medRec.abi, this.props.address);
          output = await address2.methods
            .getPatientDataPassword(this.props.password)
            .call({ from: accounts[0] });
        } catch (err) {
          return;
        }
        this.setState({
          name: output[1][0],
          gender: output[1][1],
          dob: output[1][2],
          mobile: output[1][3],
          aadhar: output[1][4],
          paddress: output[1][5],
          postalcode: output[1][6],
          country: output[1][7],
          medicalHistory: output[2][0],
          diagnosis: output[2][1],
          medications: output[2][2],
          allergies: output[2][3],
          progressNotes: output[2][4],
          vitalSigns: output[2][5],
          immunizationDates: output[2][6],
          emergency: output[2][7],
          billingData: output[3][0],
          radiologyImages: output[3][1],
          labResults: output[3][2],
          insurances: output[3][3],
        });
        this.setState( { ready: true } );
      }
    }

    const myContract = new web3.eth.Contract(medRec.abi, this.props.address);

    myContract.events
    .ChangeOccured({}, function (error, event) {
      console.log(event);
    })
    .on("data", async (event) => {
      this.setState( { ready: false } );
      let accounts = await web3.eth.getAccounts();
      let output;
      if(this.props.type == 'doctor') {
        try {
          const address1 = new web3.eth.Contract(medRec.abi, this.props.address);
          output = await address1.methods
            .getPatientData()
            .call({ from: accounts[0] });
        } catch (err) {
          return;
        }
        console.log(output);
        this.setState({
          name: output[1][0],
          gender: output[1][1],
          dob: output[1][2],
          mobile: output[1][3],
          aadhar: output[1][4],
          paddress: output[1][5],
          postalcode: output[1][6],
          country: output[1][7],
          medicalHistory: output[2][0],
          diagnosis: output[2][1],
          medications: output[2][2],
          allergies: output[2][3],
          progressNotes: output[2][4],
          vitalSigns: output[2][5],
          immunizationDates: output[2][6],
          emergency: output[2][7],
          billingData: output[3][0],
          radiologyImages: output[3][1],
          labResults: output[3][2],
          insurances: output[3][3],
        });
        this.setState( { ready: true } );
      }else {
        try {
          const address2 = new web3.eth.Contract(medRec.abi, this.props.address);
          output = await address2.methods
            .getPatientDataPassword(this.props.password)
            .call({ from: accounts[0] });
        } catch (err) {
          return;
        }
        this.setState({
          name: output[1][0],
          gender: output[1][1],
          dob: output[1][2],
          mobile: output[1][3],
          aadhar: output[1][4],
          paddress: output[1][5],
          postalcode: output[1][6],
          country: output[1][7],
          medicalHistory: output[2][0],
          diagnosis: output[2][1],
          medications: output[2][2],
          allergies: output[2][3],
          progressNotes: output[2][4],
          vitalSigns: output[2][5],
          immunizationDates: output[2][6],
          emergency: output[2][7],
          billingData: output[3][0],
          radiologyImages: output[3][1],
          labResults: output[3][2],
          insurances: output[3][3],
        });
        this.setState( { ready: true } );
      }
    })
    .on("changed", function (event) {
      // remove event from local database
    })
    .on("error", console.error);



  }

  applyFileChanges = async (e) => {
    let errorFlag = false;
    if (
      validator.isEmpty(this.state.billingDataEdit) &&
      validator.isEmpty(this.state.radiologyImagesEdit) &&
      validator.isEmpty(this.state.labResultsEdit)
    ) {
      errorFlag = true;
      this.setState({
        modalHeader: "cancel",
        modalContent: "Select Atleast One File",
        modalIconColor: "red",
        modalIconName: "cancel",
        isModalOpen: true,
      });
    }

    if (!errorFlag) {
      e.preventDefault();
      this.setState({
        applyFileChangesLoading: true,
        applyFileChangesErrorMessage: "",
      });
      let accounts = await web3.eth.getAccounts();
      let medRecAdd;

      try {
        const address = new web3.eth.Contract(
          addMap.abi,
          "0xc821543770F3256f9f78354D6193777dA338f6D1"
        );
        medRecAdd = await address.methods
          .getRecordAddress(this.state.aadhar)
          .call();
      } catch (err) {
        this.setState({ applyFileChangesErrorMessage: err.message });
        this.setState({ applyFileChangesLoading: false });
        return;
      }

      try {
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;
        let details = "";
        if(this.state.billingData != "") {
          details = details.concat(this.state.billingData+", ");
        }
        if(this.state.radiologyImages != "") {
          details = details.concat(this.state.radiologyImages+", ");
        }
        if(this.state.labResults != "") {
          details = details.concat(this.state.labResults);
        }
        const address1 = new web3.eth.Contract(medRec.abi, medRecAdd);
        await address1.methods
          .addFiles(
            this.state.billingDataEdit,
            this.state.radiologyImagesEdit,
            this.state.labResultsEdit,
            "Files added at ".concat(dateTime+" ") + "by :-".concat(accounts[0]),
            "Files added are :- ".concat(details)
          )
          .send({ from: accounts[0], gas: 9999999, gasPrice: "40000000000" });
      } catch (err) {
        this.setState({ applyFileChangesErrorMessage: err.message });
        this.setState({ applyFileChangesLoading: false });
        return;
      }
      this.setState({ applyFileChangesLoading: false });
      this.setState({
        modalHeader: "Success",
        modalContent: "Changes Applied Successfully",
        modalIconColor: "green",
        modalIconName: "check circle",
        isModalOpen: true,
        billingDataEdit: "",
        radiologyImagesEdit: "",
        labResultsEdit: "",
      });
    }
  };

  modalTopple = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  applyNonDemChanges = async (e) => {
    e.preventDefault();
    this.setState({
      applyNonDemChangesLoading: true,
      applyNonDemChangesErrorMessage: "",
    });
    let accounts = await web3.eth.getAccounts();
    let medRecAdd;

    try {
      const address = new web3.eth.Contract(
        addMap.abi,
        "0xc821543770F3256f9f78354D6193777dA338f6D1"
      );
      medRecAdd = await address.methods
        .getRecordAddress(this.state.aadhar)
        .call();
      console.log("1");
    } catch (err) {
      this.setState({ applyNonDemChangesErrorMessage: err.message });
      this.setState({ applyNonDemChangesLoading: false });
      return;
    }

    try {
      var today = new Date();
      var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
      var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      var dateTime = date+' '+time;
      const address1 = new web3.eth.Contract(medRec.abi, medRecAdd);
      await address1.methods
        .updateNondemographics(
          this.state.medicalHistory,
          this.state.diagnosis,
          this.state.medications,
          this.state.allergies,
          this.state.progressNotes,
          this.state.vitalSigns,
          this.state.immunizationDates,
          this.state.emergency,
          "Nondemographic Data was modified at ".concat(dateTime+ " ")+"by :- ".concat(accounts[0]),
          "Old Data :- "
          .concat("Medical History :- ".concat(this.state.medicalHistoryOri+ ", ")).concat("Diagnosis :- ".concat(this.state.diagnosisOri+ ", "))
          .concat("Medications :- ".concat(this.state.medicationsOri+ ", ")).concat("Allergies :- ".concat(this.state.allergiesOri+ ", ")).concat("Progress Notes :- ".concat(this.state.progressNotesOri+ ", "))
          .concat("Vital Signs :- ".concat(this.state.vitalSignsOri+ ", ")).concat("Immunization Dates :- ".concat(this.state.immunizationDatesOri+ ", ")).concat("Emergency :- ".concat(this.state.emergencyOri+ ", "))
          .concat("New Data :- ")
          .concat("Medical History :- ".concat(this.state.medicalHistory+ ", ")).concat("Diagnosis :- ".concat(this.state.diagnosis+ ", "))
          .concat("Medications :- ".concat(this.state.medications+ ", ")).concat("Allergies :- ".concat(this.state.allergies+ ", ")).concat("Progress Notes :- ".concat(this.state.progressNotes+ ", "))
          .concat("Vital Signs :- ".concat(this.state.vitalSigns+ ", ")).concat("Immunization Dates :- ".concat(this.state.immunizationDates+ ", ")).concat("Emergency :- ".concat(this.state.emergency+ ", "))
        )
        .send({ from: accounts[0], gas: 9999999, gasPrice: "40000000000" });
    } catch (err) {
      this.setState({ applyNonDemChangesErrorMessage: err.message });
      this.setState({ applyNonDemChangesLoading: false });
      return;
    }
    this.setState({ applyNonDemChangesLoading: false });
    this.setState({
      modalHeader: "Success",
      modalContent: "Changes Applied Successfully",
      modalIconColor: "green",
      modalIconName: "check circle",
      isModalOpen: true,
    });
  };

  renderListHandle = async (e) => {
    let fileHashSend = e.target.innerText;
    let accounts = await web3.eth.getAccounts();
    let medRecAdd, output;
    try {
      const address = new web3.eth.Contract(
        addMap.abi,
        "0xc821543770F3256f9f78354D6193777dA338f6D1"
      );
      medRecAdd = await address.methods
        .getRecordAddress(this.state.aadhar)
        .call();
    } catch (err) {
      return;
    }

    if( this.props.type == 'doctor' ) {
      try {
        const address1 = new web3.eth.Contract(medRec.abi, medRecAdd);
        output = await address1.methods.getFilePassword().call({
          from: accounts[0],
        });
      } catch (err) {
        return;
      }
    } else {
      try {
        const address1 = new web3.eth.Contract(medRec.abi, medRecAdd);
        output = await address1.methods.getFilePasswordPassword(this.props.password).call({
          from: accounts[0],
        });
      } catch (err) {
        return;
      }
    }
    this.setState({isLoaderDimmerActive: true});

    axios
      .get("/download", {
        params: {
          data: fileHashSend,
          password: output,
        },
        responseType: "blob",
      })
      .then((res) => {

        

        if(res["headers"]["flag"] == false){
          this.setState({
            modalHeader:"Error",
            modalContent:"Something went wrong !!!",
            modalIconColor:"red",
            modalIconName:"cancel",
            isModalOpen: true
          });
        } else {
          console.log(res);
          const url = window.URL.createObjectURL(new Blob([res.data]));
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "download.zip");
          document.body.appendChild(link);
          link.click(); // then print response status
        }

        this.setState({isLoaderDimmerActive:false});
      })
      .catch((err) => {
        // then print response status
      });
  };

  renderBilling = () => {
    if (this.state.ready == true) {
      if (this.state.billingData != null) {
        const items = this.state.billingData.map(function (val, index) {
          return {
            content: val,
            as: "a",
          };
        });
        return (
          <Message color="teal">
            <Message.Header>Billing</Message.Header>
            <p>
              <Popup
                content="Download Corresponding Files"
                trigger={
                  <List
                    items={items}
                    onClick={this.renderListHandle}
                    size="large"
                    divided
                    relaxed
                    ordered
                  />
                }
              />
            </p>
          </Message>
        );
      }
    }
  };

  renderRadiology = () => {
    if (this.state.ready == true) {
      const items = this.state.radiologyImages.map(function (val, index) {
        return {
          content: val,
          as: "a",
        };
      });

      return (
        <Message color="teal">
          <Message.Header>Radiology</Message.Header>
          <p>
            <Popup
              content="Download Corresponding Files"
              trigger={
                <List
                  items={items}
                  onClick={this.renderListHandle}
                  size="large"
                  divided
                  relaxed
                  ordered
                />
              }
            />
          </p>
        </Message>
      );
    }
  };

  renderLabresults = () => {
    if (this.state.ready == true) {
      const items = this.state.labResults.map(function (val, index) {
        return {
          content: val,
          as: "a",
        };
      });

      return (
        <Message color="teal">
          <Message.Header>Lab Results</Message.Header>
          <p>
            <Popup
              content="Download Corresponding Files"
              trigger={
                <List
                  items={items}
                  onClick={this.renderListHandle}
                  size="large"
                  divided
                  relaxed
                  ordered
                />
              }
            />
          </p>
        </Message>
      );
    }
  };

  renderInsuranceHandle = async (e) => {
    let getNumber = e.target.innerText;
    this.setState({ isLoaderDimmerActive: true });
    let accounts = await web3.eth.getAccounts();
    let insAdd, output;

    try {
      const address = new web3.eth.Contract(
        addMap.abi,
        "0xc821543770F3256f9f78354D6193777dA338f6D1"
      );

      insAdd = await address.methods.getInsuranceAddress(getNumber).call();
    } catch (err) {
      this.setState({ isLoaderDimmerActive: false });
      return;
    }

    if (insAdd != 0x0000000000000000000000000000000000000000) {
      try {
        let address1 = new web3.eth.Contract(ins.abi, insAdd);
        output = await address1.methods.getData().call();
        console.log("1");
      } catch (err) {
        this.setState({ isLoaderDimmerActive: false });
        return;
      }
    }

    this.setState({ insuranceData: output, insuranceAddress: insAdd });
    this.setState({
      isLoaderDimmerActive: false,
      isShowActive: false,
      isInsuranceActive: true,
    });
  };

  renderInsurance = () => {
    if (this.state.ready == true) {
      const items = this.state.insurances.map(function (val, index) {
        return {
          content: val,
          as: "a",
        };
      });

      return (
        <Message color="teal">
          <Message.Header>Insurances</Message.Header>
          <p>
            <Popup
              content="Open Insurance"
              trigger={
                <List
                  items={items}
                  onClick={this.renderInsuranceHandle}
                  size="large"
                  divided
                  relaxed
                  ordered
                />
              }
            />
          </p>
        </Message>
      );
    }
  };

  backFunction = () => {
    this.setState({ isInsuranceActive: false, isShowActive: true });
  };

  getLogs = async () => {
    // let accounts = await web3.eth.getAccounts();
    // let medRecAdd;

    // this.setState( { getLogsLoading: false } );

    // try {
    //   const address = new web3.eth.Contract(
    //     addMap.abi,
    //     "0x246107b036bfDD31cAAAB68681954369104853D3"
    //   );
    //   medRecAdd = await address.methods
    //     .getRecordAddress(this.state.aadhar)
    //     .call();
    //   console.log("1");
    // } catch (err) {
    //   return;
    // }

    let accounts = await web3.eth.getAccounts();
    let medRecAdd;

    try {
      const address = new web3.eth.Contract(
        addMap.abi,
        "0xc821543770F3256f9f78354D6193777dA338f6D1"
      );
      medRecAdd = await address.methods
        .getRecordAddress(this.state.aadhar)
        .call();
    } catch (err) {
      this.setState({ applyFileChangesErrorMessage: err.message });
      this.setState({ applyFileChangesLoading: false });
      return;
    }

    let that = this;
    const myContract = new web3.eth.Contract(
      medRec.abi,
      medRecAdd
    );
    myContract
      .getPastEvents(
        "LogBook",
        {
          fromBlock: 0,
          toBlock: "latest",
        },
        function (error, events) {
          that.setState({ logEvents: events });
          that.setState({
            isLogsActive: !that.state.isLogsActive,
            isShowActive: !that.state.isShowActive,
          });
        }
      )
      .then(function (events) {
        // same results as the optional callback above
      });
  };

  toggleLog = () => {
    this.setState({
      isLogsActive: !this.state.isLogsActive,
      isShowActive: !this.state.isShowActive,
    });
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
        {this.state.isShowActive ? (
          <div>
            <Grid stackable textAlign="left" verticalAlign="top">
              <Grid.Row>
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
                    Electronic Health Record
                  </Header>
                  <Divider horizontal>
                    <Header as="h4" color="grey">
                      Patient Demographics
                    </Header>
                  </Divider>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={1}>
                <Grid.Column width="16">
                  <Message color="blue">
                    <Message.Header>Name</Message.Header>
                      <p>{this.state.name}</p>
                    </Message>
                  </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={4}>
                <Grid.Column>
                  <Message color="blue">
                    <Message.Header>Gender</Message.Header>
                    <p> {this.state.gender} </p>
                  </Message>
                </Grid.Column>
                <Grid.Column>
                  <Message color="blue">
                    <Message.Header>Dob</Message.Header>
                    <p> {this.state.dob} </p>
                  </Message>
                </Grid.Column>
                <Grid.Column>
                  <Message color="blue">
                    <Message.Header>Mobile</Message.Header>
                    <p> {this.state.mobile} </p>
                  </Message>
                </Grid.Column>
                <Grid.Column>
                  <Message color="blue">
                    <Message.Header>Aadhar</Message.Header>
                    <p> {this.state.aadhar} </p>
                  </Message>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={1}>
                <Grid.Column>
                  <Message color="blue">
                    <Message.Header>Address</Message.Header>
                    <p> {this.state.paddress} </p>
                  </Message>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Message color="blue">
                    <Message.Header>PostalCode</Message.Header>
                    <p> {this.state.postalcode} </p>
                  </Message>
                </Grid.Column>
                <Grid.Column>
                  <Message color="blue">
                    <Message.Header>State</Message.Header>
                    <p> {this.state.country} </p>
                  </Message>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Divider horizontal>
                    <Header color="grey" as="h4">
                      Medical Information
                    </Header>
                  </Divider>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={1}>
                <Grid.Column width="16">
                  <Message color="olive">
                    <Message.Header>Mediacl History</Message.Header>
                    <p> {this.state.medicalHistory} </p>
                  </Message>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={1}>
                <Grid.Column width="16">
                  <Message color="olive">
                    <Message.Header>Diagnosis</Message.Header>
                    <p> {this.state.diagnosis} </p>
                  </Message>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={1}>
                <Grid.Column width="16">
                  <Message color="olive">
                    <Message.Header>Medications</Message.Header>
                    <p> {this.state.medications} </p>
                  </Message>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={1}>
                <Grid.Column width="16">
                  <Message color="olive">
                    <Message.Header>Allergies</Message.Header>
                    <p> {this.state.allergies} </p>
                  </Message>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={1}>
                <Grid.Column width="16">
                  <Message color="olive">
                    <Message.Header>Progress Notes</Message.Header>
                    <p> {this.state.progressNotes} </p>
                  </Message>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={1}>
                <Grid.Column width="16">
                  <Message color="olive">
                    <Message.Header>Vital Signs</Message.Header>
                    <p> {this.state.vitalSigns} </p>
                  </Message>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={1}>
                <Grid.Column width="16">
                  <Message color="olive">
                    <Message.Header>Immunization Dates</Message.Header>
                    <p> {this.state.immunizationDates} </p>
                  </Message>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={1}>
                <Grid.Column width="16">
                  <Message color="olive">
                    <Message.Header>Emergency</Message.Header>
                    <p> {this.state.emergency} </p>
                  </Message>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Divider horizontal>
                    <Header color="grey" as="h4">
                      Files
                    </Header>
                  </Divider>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={1}>
                <Grid.Column width="16">{this.renderBilling()}</Grid.Column>
              </Grid.Row>
              <Grid.Row columns={1}>
                <Grid.Column width="16">{this.renderRadiology()}</Grid.Column>
              </Grid.Row>
              <Grid.Row columns={1}>
                <Grid.Column width="16">{this.renderLabresults()}</Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <Divider horizontal>
                    <Header color="grey" as="h4">
                      Insurances
                    </Header>
                  </Divider>
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns={1}>
                <Grid.Column width="16">{this.renderInsurance()}</Grid.Column>
              </Grid.Row>

              <Grid.Row>
                <Grid.Column>
                  <Button
                    loading={this.state.getLogsLoading}
                    disabled={this.state.getLogsLoading}
                    onClick={this.getLogs}
                    color="teal"
                  >
                    <Icon name="history" />
                    Get Logs
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        ) : null}

        {this.props.type == "doctor" && this.state.isShowActive == true ? (
          <Grid stackable textAlign="left" verticalAlign="top">
            <Grid.Row>
              <Grid.Column>
                <Button onClick={this.toggle} color="green">
                  <Icon name="edit" />
                  Edit
                </Button>
                <Button
                  onClick={this.props.call}
                  style={{ marginTop: "4px" }}
                  color="blue"
                >
                  <Icon name="arrow left" /> Back
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        ) : null}

        {this.props.type == "patient" && this.state.isShowActive == true ? (
          <Grid stackable textAlign="left" verticalAlign="top">
            <Grid.Row>
              <Grid.Column>
                <Button
                  onClick={this.props.call}
                  style={{ marginTop: "4px" }}
                  color="blue"
                >
                  <Icon name="arrow left" /> Back
                </Button>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        ) : null}

        {this.state.isLogsActive ? (
          <div>
            <Logs data={this.state.logEvents} call={this.backFunction}></Logs>
            <Grid stackable textAlign="left" verticalAlign="top">
              <Grid.Row>
                <Grid.Column>
                  <Button
                    onClick={this.toggleLog}
                    style={{ marginTop: "4px" }}
                    color="blue"
                  >
                    <Icon name="arrow left" /> Back
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        ) : null}

        {this.state.isEditActive ? (
          <div>
            <Grid stackable textAlign="left" verticalAlign="top" columns={1}>
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
                  Electronic Health Record
                </Header>
                <Form
                  onSubmit={this.applyNonDemChanges}
                  error={!!this.state.applyNonDemChangesErrorMessage}
                >
                  <Divider horizontal>
                    <Header as="h4" color="grey">
                      Medical Information
                    </Header>
                  </Divider>
                  <label style={{ color: "#808080" }}>Medical History</label>
                  <Form.TextArea
                    value={this.state.medicalHistory}
                    onChange={(event) =>
                      this.setState({ medicalHistory: event.target.value })
                    }
                    placeholder="Medical History..."
                  />
                  <label style={{ color: "#808080" }}>Diagnosis</label>
                  <Form.TextArea
                    value={this.state.diagnosis}
                    onChange={(event) =>
                      this.setState({ diagnosis: event.target.value })
                    }
                    placeholder="Diagnosis..."
                  />
                  <label style={{ color: "#808080" }}>Medications</label>
                  <Form.TextArea
                    value={this.state.medications}
                    onChange={(event) =>
                      this.setState({ medications: event.target.value })
                    }
                    placeholder="Medications..."
                  />
                  <label style={{ color: "#808080" }}>Allergies</label>
                  <Form.TextArea
                    value={this.state.allergies}
                    onChange={(event) =>
                      this.setState({ allergies: event.target.value })
                    }
                    placeholder="Allergies..."
                  />
                  <label style={{ color: "#808080" }}>Progress Notes</label>
                  <Form.TextArea
                    value={this.state.progressNotes}
                    onChange={(event) =>
                      this.setState({ progressNotes: event.target.value })
                    }
                    placeholder="Progress Notes..."
                  />
                  <label style={{ color: "#808080" }}>Vital Signs</label>
                  <Form.TextArea
                    value={this.state.vitalSigns}
                    onChange={(event) =>
                      this.setState({ vitalSigns: event.target.value })
                    }
                    placeholder="VitalSigns..."
                  />
                  <label style={{ color: "#808080" }}>Immunization Dates</label>
                  <Form.TextArea
                    value={this.state.immunizationDates}
                    onChange={(event) =>
                      this.setState({ immunizationDates: event.target.value })
                    }
                    placeholder="Immunization Dates..."
                  />
                  <label style={{ color: "#808080" }}>Emergency</label>
                  <Form.TextArea
                    value={this.state.emergency}
                    onChange={(event) =>
                      this.setState({ emergency: event.target.value })
                    }
                    placeholder="Emergency..."
                  />

                  <Message
                    hidden={
                      !this.state.applyNonDemChangesErrorMessage.length != 0
                    }
                    header="Oops!"
                    content={this.state.applyNonDemChangesErrorMessage}
                  />
                  <Button
                    type="submit"
                    loading={this.state.applyNonDemChangesLoading}
                    disabled={this.state.applyNonDemChangesLoading}
                    primary
                  >
                    <Icon name="gavel" />
                    Apply Changes
                  </Button>
                  <Button onClick={this.toggle} color="red">
                    <Icon name="cancel" />
                    cancel
                  </Button>
                </Form>

                <Form
                  onSubmit={this.applyFileChanges}
                  error={!!this.state.applyFileChangesErrorMessage}
                >
                  <Divider horizontal>
                    <Header color="grey" as="h4">
                      Files
                    </Header>
                  </Divider>
                  <Form.Field>
                    <label style={{ color: "#808080" }}>Billing</label>
                    <Input
                      placeholder="Billing"
                      value={this.state.billingDataEdit}
                      onChange={(event) =>
                        this.setState({ billingDataEdit: event.target.value })
                      }
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
                        disabled={this.state.billingDataLoad}
                        loading={this.state.billingDataLoad}
                        color="green"
                        onClick={this.uploadBillingData}
                      >
                        Upload Files and Generate Hash
                      </Button>
                    </Form.Field>
                  </Form.Group>
                  <Progress
                    progress
                    success
                    percent={this.state.billingLoadedPercent}
                  >
                    success
                  </Progress>
                  <Form.Field>
                    <label style={{ color: "#808080" }}>Radiology</label>
                    <Input
                      placeholder="Radiology"
                      value={this.state.radiologyImagesEdit}
                      onChange={(event) =>
                        this.setState({
                          radiologyImagesEdit: event.target.value,
                        })
                      }
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
                        disabled={this.state.radiologyImagesLoad}
                        loading={this.state.radiologyImagesLoad}
                        color="green"
                        onClick={this.uploadRadiologyImages}
                      >
                        Upload Files and Generate Hash
                      </Button>
                    </Form.Field>
                  </Form.Group>
                  <Progress
                    progress
                    success
                    percent={this.state.radiologyLoadedPercent}
                  >
                    success
                  </Progress>
                  <Form.Field>
                    <label style={{ color: "#808080" }}>Lab Results</label>
                    <Input
                      placeholder="Labresults"
                      value={this.state.labResultsEdit}
                      onChange={(event) =>
                        this.setState({ labResultsEdit: event.target.value })
                      }
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
                        disabled={this.state.labResultsLoad}
                        loading={this.state.labResultsLoad}
                        color="green"
                        onClick={this.uploadLabresults}
                      >
                        Upload Files and Generate Hash
                      </Button>
                    </Form.Field>
                  </Form.Group>
                  <Progress
                    progress
                    success
                    percent={this.state.labresultsLoadedPercent}
                  >
                    success
                  </Progress>
                  <Message
                    hidden={
                      !this.state.applyFileChangesErrorMessage.length != 0
                    }
                    header="Oops!"
                    content={this.state.applyFileChangesErrorMessage}
                  />
                  <Button
                    type="submit"
                    loading={this.state.applyFileChangesLoading}
                    disabled={this.state.applyFileChangesLoading}
                    primary
                  >
                    <Icon name="gavel" />
                    Apply Changes
                  </Button>
                  <Button onClick={this.toggle} color="red">
                    <Icon name="cancel" />
                    cancel
                  </Button>
                </Form>
              </Grid.Column>
            </Grid>
            <Button
              onClick={this.toggle}
              style={{ marginTop: "4px" }}
              color="blue"
            >
              <Icon name="arrow left" /> Back
            </Button>
          </div>
        ) : null}

        {this.state.isInsuranceActive ? (
          <div>
            <ShowInsurance
              data={this.state.insuranceData}
              type={this.props.type}
              call={this.backFunction}
              insAdd={this.state.insuranceAddress}
            ></ShowInsurance>
            <Grid stackable textAlign="left" verticalAlign="top">
              <Grid.Row>
                <Grid.Column>
                  <Button
                    onClick={this.toggleInsurance}
                    style={{ marginTop: "4px" }}
                    color="blue"
                  >
                    <Icon name="arrow left" /> Back
                  </Button>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </div>
        ) : null}
        <style jsx>
          {`
            .inputfile {
              visibility: hidden;
            }
          `}
        </style>
      </div>
    );
  }
}
