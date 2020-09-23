import React, { Component } from "react";
import Layout from "./layout";
import axios from "axios";
import web3 from "../ethereum/web3";
import validator from "validator";
import doctor from "../ethereum/build/Doctor";
import medRec from "../ethereum/build/MedicalRecord";
import addMap from "../ethereum/build/AddressMapping";
import aadharValidator from "aadhaar-validator";

import {
  Form,
  Input,
  Image,
  Modal,
  Progress,
  Header,
  Message,
  Icon,
  Label,
  Button,
  Grid,
  Dropdown,
  Divider,
  Segment,
} from "semantic-ui-react";

export default class MedicalRecordForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      nameError: false,
      gender: "",
      genderError: false,
      dob: "",
      dobError: false,
      mobile: "",
      mobileError: false,
      aadhar: "",
      aadharError: false,
      paddress: "",
      paddressError: false,
      postalcode: "",
      postalcodeError: false,
      country: "",
      countryError: false,
      password: "",
      passwordError: false,
      filePassword: "",
      filePasswordError: false,
      medicalHistory: "",
      medicalHistoryError: false,
      diagnosis: "",
      diagnosisError: false,
      medications: "",
      medicationsError: false,
      allergies: "",
      allergiesError: false,
      progressNotes: "",
      progressNotesError: false,
      vitalSigns: "",
      vitalSignsError: false,
      immunizationDates: "",
      immunizationDatesError: false,
      emergency: "",
      emergencyError: false,
      billingData: "",
      radiologyImages: "",
      labResults: "",
      createNewMedicalRecordErrorMessage: "",
      updateNonDemographicDataErrorMessage: "",
      uploadFilesErrorMessage: "",
      selectedFile: null,
      billingDataLoad: false,
      radiologyImagesLoad: false,
      labResultsLoad: false,
      createNewMedicalRecordLoading: false,
      updateFilesLoading: false,
      updateNonDemographicDataLoading: false,
      isModalOpen: false,
      modalContent: "",
      modalHeader: "",
      modalIconColor: "red",
      modalIconName: "clock",
      medInfAadhar: "",
      fileAadhar: "",
      medInfAadharError: false,
      fileAadharError: false,
    };
    this.genderOptions = [
      { key: "male", text: "Male", value: "Male" },
      { key: "female", text: "Female", value: "Female" },
    ];

    this.countryOptions = [
      { key: "andhraPradesh", text: "Andhra Pradesh", value: "Andhra Pradesh" },
      {
        key: "arunachalPradesh",
        text: "ArunachalPradesh",
        value: "ArunachalPradesh",
      },
      { key: "assam", text: "Assam", value: "Assam" },
      { key: "bihar", text: "Bihar", value: "Bihar" },
      { key: "chhattisgarh", text: "Chhattisgarh", value: "Chhattisgarh" },
      { key: "goa", text: "Goa", value: "Goa" },
      { key: "gujarat", text: "Gujarat", value: "Gujarat" },
      { key: "haryana", text: "Haryana", value: "Haryana" },
      {
        key: "himachalPradesh",
        text: "Himachal Pradesh",
        value: "Himachal Pradesh",
      },
      {
        key: "jammuandKashmir",
        text: "Jammu and Kashmir",
        value: "Jammu and Kashmir",
      },
      { key: "jharkhand", text: "Jharkhand", value: "Jharkhand" },
      { key: "karnataka", text: "Karnataka", value: "Karnataka" },
      { key: "kerala", text: "Kerala", value: "Kerala" },
      { key: "madhyaPradesh", text: "Madhya Pradesh", value: "Madhya Pradesh" },
      { key: "maharashtra", text: "Maharashtra", value: "Maharashtra" },
      { key: "manipur", text: "Manipur", value: "Manipur" },
      { key: "meghalaya", text: "Meghalaya", value: "Meghalaya" },
      { key: "mizoram", text: "Mizoram", value: "Mizoram" },
      { key: "nagaland", text: "Nagaland", value: "Nagaland" },
      { key: "odisha", text: "Odisha", value: "Odisha" },
      { key: "punjab", text: "Punjab", value: "Punjab" },
      { key: "rajasthan", text: "Rajasthan", value: "Rajasthan" },
      { key: "sikkim", text: "Sikkim", value: "Sikkim" },
      { key: "tamilNadu", text: "Tamil Nadu", value: "Tamil Nadu" },
      { key: "telangana", text: "Telangana", value: "Telangana" },
      { key: "tripura", text: "Tripura", value: "Tripura" },
      { key: "uttarPradesh", text: "Uttar Pradesh", value: "Uttar Pradesh" },
      { key: "uttarakhand", text: "Uttarakhand", value: "Uttarakhand" },
      { key: "westBengal", text: "West Bengal", value: "West Bengal" },
    ];
  }

  onFileSelect = (event) => {
    var files = event.target.files;
    this.setState({
      selectedFile: files,
    });
  };

  uploadFiles = async (buttonType) => {
    let errorFlag = false,
      ready = false;

    if (
      !aadharValidator.isValidNumber(String(this.state.fileAadhar)) ||
      validator.isEmpty(this.state.fileAadhar)
    ) {
      this.setState({ fileAadharError: "Enter Correct Aadhar Number" });
      errorFlag = true;
    } else {
      this.setState({ fileAadharError: false });
    }

    let output;
    if (!errorFlag) {
      let accounts = await web3.eth.getAccounts();
      let isDoctorAllowed, medRecAdd;

      try {
        const address = new web3.eth.Contract(
          addMap.abi,
          "0xc821543770F3256f9f78354D6193777dA338f6D1"
        );
        medRecAdd = await address.methods
          .getRecordAddress(this.state.fileAadhar)
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
          if (buttonType == "billing") {
            this.setState({
              billingData: res.data,
              billingDataLoad: false,
              selectedFile: null,
            });
          } else if (buttonType == "radiology") {
            this.setState({
              radiologyImages: res.data,
              radiologyImagesLoad: false,
              selectedFile: null,
            });
          } else {
            this.setState({
              labResults: res.data,
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
    if (
      !aadharValidator.isValidNumber(String(this.state.fileAadhar)) ||
      validator.isEmpty(this.state.fileAadhar)
    ) {
      this.setState({ fileAadharError: "Enter Correct Aadhar Number" });
      errorFlag = true;
    } else {
      this.setState({ fileAadharError: false });
    }

    if (this.state.selectedFile == null) {
      this.setState({
        modalHeader: "Error",
        modalContent: "Select Atleast One File",
        modalIconColor: "red",
        modalIconName: "cancel",
        isModalOpen: true,
      });
      errorFlag = false;
    }

    if (!errorFlag) {
      if (
        this.state.radiologyImagesLoad == false &&
        this.state.labResultsLoad == false
      ) {
        this.setState({ billingDataLoad: true });
        this.uploadFiles("billing");
      }
    }
  };

  uploadRadiologyImages = () => {
    let errorFlag = false;
    if (
      !aadharValidator.isValidNumber(String(this.state.fileAadhar)) ||
      validator.isEmpty(this.state.fileAadhar)
    ) {
      this.setState({ fileAadharError: "Enter Correct Aadhar Number" });
      errorFlag = true;
    } else {
      this.setState({ fileAadharError: false });
    }

    if (this.state.selectedFile == null) {
      this.setState({
        modalHeader: "Error",
        modalContent: "Select Atleast One File",
        modalIconColor: "red",
        modalIconName: "cancel",
        isModalOpen: true,
      });
      errorFlag = false;
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
    if (
      !aadharValidator.isValidNumber(String(this.state.fileAadhar)) ||
      validator.isEmpty(this.state.fileAadhar)
    ) {
      this.setState({ fileAadharError: "Enter Correct Aadhar Number" });
      errorFlag = true;
    } else {
      this.setState({ fileAadharError: false });
    }

    if (this.state.selectedFile == null) {
      this.setState({
        modalHeader: "Error",
        modalContent: "Select Atleast One File",
        modalIconColor: "red",
        modalIconName: "cancel",
        isModalOpen: true,
      });
      errorFlag = false;
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

  updateFiles = async (event) => {
    event.preventDefault();
    let errorFlag = false;

    if (
      !aadharValidator.isValidNumber(String(this.state.fileAadhar)) ||
      validator.isEmpty(this.state.fileAadhar)
    ) {
      this.setState({ fileAadharError: "Enter Correct Aadhar Number" });
      errorFlag = true;
    } else {
      this.setState({ fileAadharError: false });
    }

    if (
      validator.isEmpty(this.state.billingData) &&
      validator.isEmpty(this.state.radiologyImages) &&
      validator.isEmpty(this.state.labResults)
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
      this.setState({
        updateFilesLoading: true,
        uploadFilesErrorMessage: "",
      });
      let accounts = await web3.eth.getAccounts();
      let isDoctorAllowed, medRecAdd;

      try {
        const address = new web3.eth.Contract(
          addMap.abi,
          "0xc821543770F3256f9f78354D6193777dA338f6D1"
        );
        medRecAdd = await address.methods
          .getRecordAddress(this.state.fileAadhar)
          .call();
      } catch (err) {
        this.setState({ uploadFilesErrorMessage: err.message });
        this.setState({ updateFilesLoading: false });
        return;
      }

      if (medRecAdd == 0x0000000000000000000000000000000000000000) {
        this.setState({
          modalHeader: "Error",
          modalContent: "No Record Exist",
          modalIconColor: "red",
          modalIconName: "cancel",
          isModalOpen: true,
        });
        this.setState({ updateFilesLoading: false });
        return;
      } else {
        try {
          const address1 = new web3.eth.Contract(medRec.abi, medRecAdd);
          isDoctorAllowed = await address1.methods
            .isDoctorAllowed(accounts[0])
            .call();
        } catch (err) {
          this.setState({ uploadFilesErrorMessage: err.message });
          this.setState({ updateFilesLoading: false });
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
          this.setState({ updateFilesLoading: false });
          return;
        } else {
          let details = "";
          if(this.state.billingData != "") {
            alert(this.state.billingData);
            details = details.concat(this.state.billingData+", ");
            alert(details);
          }
          if(this.state.radiologyImages != "") {
            details = details.concat(this.state.radiologyImages+", ");
          }
          if(this.state.labResults != "") {
            details = details.concat(this.state.labResults);
          }
          try {
            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date+' '+time;
            const address2 = new web3.eth.Contract(medRec.abi, medRecAdd);
            await address2.methods
              .addFiles(
                this.state.billingData,
                this.state.radiologyImages,
                this.state.labResults,
                "Files added at ".concat(dateTime + " ") + " by :- ".concat(accounts[0]),
                "Files added are :- ".concat(details)
              )
              .send({
                from: accounts[0], gas: 9999999, gasPrice: "40000000000"
              });
          } catch (err) {
            this.setState({
              uploadFilesErrorMessage: err.message,
            });
            this.setState({ updateFilesLoading: false });
            return;
          }
          this.setState({ updateFilesLoading: false });
          this.setState({
            modalHeader: "Success",
            modalContent: "Changes Applied Successfully",
            modalIconColor: "green",
            modalIconName: "check circle",
            isModalOpen: true,
            billingData: "",
            radiologyImages: "",
            labResults: "",
            fileAadhar: "",
          });
        }
      }
    }
  };

  createNewMedicalRecord = async (event) => {
    event.preventDefault();

    let errorFlag = false;

    if (
      !this.state.name.match(/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/) ||
      validator.isEmpty(this.state.name)
    ) {
      this.setState({ nameError: "Incorrect Name" });
      errorFlag = true;
    } else {
      this.setState({ nameError: false });
    }

    if (this.state.gender == "") {
      this.setState({ genderError: "Select Gender" });
      errorFlag = true;
    } else {
      this.setState({ genderError: false });
    }

    var Today = new Date();
    var dd = Today.getDate();
    var mm = Today.getMonth() + 1; //January is 0!
    var yyyy = Today.getFullYear();
    if (dd < 10) {
      dd = "0" + dd;
    }
    if (mm < 10) {
      mm = "0" + mm;
    }
    var Today = dd + "/" + mm + "/" + yyyy;
    var dateFirst = this.state.dob.split("/");
    var dateSecond = Today.split("/");

    var value = new Date(dateFirst[2], dateFirst[1], dateFirst[0]);
    var current = new Date(dateSecond[2], dateSecond[1], dateSecond[0]);

    if (
      !this.state.dob.match(
        /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
      ) ||
      validator.isEmpty(this.state.dob) ||
      value > current
    ) {
      this.setState({ dobError: "Enter in dd/mm/yyyy or dd-mm-yyyy Format" });
      errorFlag = true;
    } else {
      this.setState({ dobError: false });
    }

    if (
      !this.state.mobile.match(
        /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/
      )
    ) {
      this.setState({
        mobileError: "Enter Correct Mobile Number With Country Code",
      });
      errorFlag = true;
    } else {
      this.setState({ mobileError: false });
    }

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
      !this.state.paddress.match(/^[a-zA-Z0-9\s,.'-]{3,}$/) ||
      validator.isEmpty(this.state.paddress)
    ) {
      this.setState({ paddressError: "Enter Correct Address" });
      errorFlag = true;
    } else {
      this.setState({ paddressError: false });
    }

    if (
      !this.state.postalcode.match(/^\d{3}\s?\d{3}$/) ||
      validator.isEmpty(this.state.postalcode)
    ) {
      this.setState({ postalcodeError: "Enter Correct PostalCode" });
      errorFlag = true;
    } else {
      this.setState({ postalcodeError: false });
    }

    if (this.state.country == "") {
      this.setState({ countryError: "Select Country" });
      errorFlag = true;
    } else {
      this.setState({ countryError: false });
    }

    if (
      !this.state.password.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
      ) ||
      validator.isEmpty(this.state.password)
    ) {
      this.setState({
        passwordError:
          "Password must contain 1 lowercase, 1 uppercase, 1 numeric, 1 special char and length greater than 7",
      });
      errorFlag = true;
    } else {
      this.setState({ passwordError: false });
    }

    if (
      !this.state.filePassword.match(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
      ) ||
      validator.isEmpty(this.state.filePassword)
    ) {
      this.setState({
        filePasswordError:
          "Password must contain 1 lowercase, 1 uppercase, 1 numeric, 1 special char and length greater than 7",
      });
      errorFlag = true;
    } else {
      this.setState({ filePasswordError: false });
    }

    if (!errorFlag) {
      this.setState({
        createNewMedicalRecordLoading: true,
        createNewMedicalRecordErrorMessage: "",
      });
      let accounts = await web3.eth.getAccounts();
      let isDoctor, medRecAdd, output;

      try {
        const address = new web3.eth.Contract(
          addMap.abi,
          "0xc821543770F3256f9f78354D6193777dA338f6D1"
        );
        medRecAdd = await address.methods
          .getRecordAddress(this.state.aadhar)
          .call();
      } catch (err) {
        this.setState({ createNewMedicalRecordErrorMessage: err.message });
        this.setState({ createNewMedicalRecordLoading: false });
        return;
      }

      if (medRecAdd != 0x0000000000000000000000000000000000000000) {
        this.setState({
          modalHeader: "Error",
          modalContent: "Record Already Exists",
          modalIconColor: "red",
          modalIconName: "cancel",
          isModalOpen: true,
        });
        this.setState({ createNewMedicalRecordLoading: false });
        return;
      } else {
        try {
          const address1 = new web3.eth.Contract(
            doctor.abi,
            "0x30E5039deCB6C107Ffd3e6625b0695265B03fAAA"
          );
          isDoctor = await address1.methods.isDoctor(accounts[0]).call();
        } catch (err) {
          this.setState({ createNewMedicalRecordErrorMessage: err.message });
          this.setState({ createNewMedicalRecordLoading: false });
          return;
        }
      }
      let oop;
      if (!isDoctor) {
        this.setState({
          modalHeader: "Error",
          modalContent: "You Are Not Authorized",
          modalIconColor: "red",
          modalIconName: "cancel",
          isModalOpen: true,
        });
        this.setState({ createNewMedicalRecordLoading: false });
        return;
      } else {
        try {
          const accounts = await web3.eth.getAccounts();
          const address2 = new web3.eth.Contract(
            doctor.abi,
            "0x30E5039deCB6C107Ffd3e6625b0695265B03fAAA"
          );
          oop = await address2.methods
            .createMedicalRecord(
              this.state.name,
              this.state.gender,
              this.state.dob,
              this.state.mobile,
              this.state.aadhar,
              this.state.paddress,
              this.state.postalcode,
              this.state.country,
              this.state.password,
              this.state.filePassword
            )
            .send({
              from: accounts[0], gas: 9999999, gasPrice: "40000000000"
            });
        } catch (err) {
          this.setState({ createNewMedicalRecordErrorMessage: err.message });
          this.setState({ createNewMedicalRecordLoading: false });
          return;
        }
      }
      this.setState({
        modalHeader: "Success",
        modalContent: "Medical Record Created Successfully",
        modalIconColor: "green",
        modalIconName: "check circle",
        isModalOpen: true,
        name: "",
        gender: "",
        dob: "",
        mobile: "",
        aadhar: "",
        paddress: "",
        postalcode: "",
        country: "",
        password: "",
        filePassword: "",
      });

      this.setState({ createNewMedicalRecordLoading: false });
    }
  };

  updateNonDemographicData = async (event) => {
    event.preventDefault();

    let errorFlag = false;

    if (
      !aadharValidator.isValidNumber(String(this.state.medInfAadhar)) ||
      validator.isEmpty(this.state.medInfAadhar)
    ) {
      this.setState({ medInfAadharError: "Enter Correct Aadhar Number" });
      errorFlag = true;
    } else {
      this.setState({ medInfAadharError: false });
    }

    if (
      validator.isEmpty(this.state.medicalHistory) &&
      validator.isEmpty(this.state.diagnosis) &&
      validator.isEmpty(this.state.medications) &&
      validator.isEmpty(this.state.allergies) &&
      validator.isEmpty(this.state.progressNotes) &&
      validator.isEmpty(this.state.vitalSigns) &&
      validator.isEmpty(this.state.immunizationDates) &&
      validator.isEmpty(this.state.emergency)
    ) {
      errorFlag = true;
      this.setState({
        modalHeader: "cancel",
        modalContent: "Select Atleast One Field",
        modalIconColor: "red",
        modalIconName: "cancel",
        isModalOpen: true,
      });
    } else {
      this.setState({ medicalHistoryError: false });
    }

    if (!errorFlag) {
      this.setState({
        updateNonDemographicDataLoading: true,
        updateNonDemographicDataErrorMessage: "",
      });
      let accounts = await web3.eth.getAccounts();
      let isDoctorAllowed, medRecAdd, output;

      try {
        const address = new web3.eth.Contract(
          addMap.abi,
          "0xc821543770F3256f9f78354D6193777dA338f6D1"
        );
        medRecAdd = await address.methods
          .getRecordAddress(this.state.medInfAadhar)
          .call();
      } catch (err) {
        this.setState({ updateNonDemographicDataErrorMessage: err.message });
        this.setState({ updateNonDemographicDataLoading: false });
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
        this.setState({ updateNonDemographicDataLoading: false });
        return;
      } else {
        try {
          const address1 = new web3.eth.Contract(medRec.abi, medRecAdd);
          isDoctorAllowed = await address1.methods
            .isDoctorAllowed(accounts[0])
            .call();
        } catch (err) {
          this.setState({ updateNonDemographicDataErrorMessage: err.message });
          this.setState({ updateNonDemographicDataLoading: false });
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
          this.setState({ updateNonDemographicDataLoading: false });
          return;
        } else {
          try {
            var today = new Date();
            var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
            var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
            var dateTime = date+' '+time;
            const address2 = new web3.eth.Contract(medRec.abi, medRecAdd);
            output = await address2.methods
              .updateNondemographics(
                this.state.medicalHistory,
                this.state.diagnosis,
                this.state.medications,
                this.state.allergies,
                this.state.progressNotes,
                this.state.vitalSigns,
                this.state.immunizationDates,
                this.state.emergency,
                "Nondemographic Data was added at ".concat(dateTime+ " ")+"by :- ".concat(accounts[0]),
                "Nondemographic Data :- ".concat("Medical History :- ".concat(this.state.medicalHistory+ ", ")).concat("Diagnosis :- ".concat(this.state.diagnosis+ ", "))
                .concat("Medications :- ".concat(this.state.medications+ ", ")).concat("Allergies :- ".concat(this.state.allergies+ ", ")).concat("Progress Notes :- ".concat(this.state.progressNotes+ ", "))
                .concat("Vital Signs :- ".concat(this.state.vitalSigns+ ", ")).concat("Immunization Dates :- ".concat(this.state.immunizationDates+ ", ")).concat("Emergency :- ".concat(this.state.emergency+ " "))
              )
              .send({
                from: accounts[0], gas: 9999999, gasPrice: "40000000000"
              });
          } catch (err) {
            this.setState({
              updateNonDemographicDataErrorMessage: err.message,
            });
            this.setState({ updateNonDemographicDataLoading: false });
            return;
          }
        }
      }
      this.setState({ updateNonDemographicDataLoading: false });
      this.setState({
        modalHeader: "Success",
        modalContent: "Changes Applied Successfully",
        modalIconColor: "green",
        modalIconName: "check circle",
        isModalOpen: true,
        medicalHistory: "",
        diagnosis: "",
        medications: "",
        allergies: "",
        progressNotes: "",
        vitalSigns: "",
        immunizationDates: "",
        emergency: "",
        medInfAadhar: "",
      });
    }
  };

  genderOnChange = (e, data) => {
    this.setState({ gender: data.value });
  };

  countryOnChange = (e, data) => {
    this.setState({ country: data.value });
  };

  modalTopple = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  render() {
    return (
      <div>
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
        <Grid
          stackable
          textAlign="left"
          style={{ marginLeft: "2px" }}
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
              Electronic Health Record
            </Header>
            <Divider horizontal  >
              <Header as="h4" color="grey">
                Patient Demographics
              </Header>
            </Divider>
            <Form
              onSubmit={this.createNewMedicalRecord}
              error={!!this.state.errorMessage}
              className='attached fluid segment'
            >
              <label style={{ color: "#808080" }}>Patient Name</label>
              <Form.Input
                fluid
                value={this.state.name}
                onChange={(event) =>
                  this.setState({ name: event.target.value })
                }
                placeholder="Name"
                error={this.state.nameError}
              />
              <Form.Group widths="equal">
                <Form.Field>
                  <label style={{ color: "#808080" }}>Gender</label>
                  <Dropdown
                    error={this.state.genderError}
                    placeholder="Gender"
                    fluid
                    selection
                    options={this.genderOptions}
                    onChange={this.genderOnChange}
                  />
                </Form.Field>
                <Form.Field>
                  <label style={{ color: "#808080" }}>Date Of Birth</label>
                  <Form.Input
                    fluid
                    value={this.state.dob}
                    onChange={(event) =>
                      this.setState({ dob: event.target.value })
                    }
                    placeholder="dd/mm/yyyy"
                    error={this.state.dobError}
                  />
                </Form.Field>
                <Form.Field>
                  <label style={{ color: "#808080" }}>Mobile</label>
                  <Form.Input
                    fluid
                    value={this.state.mobile}
                    onChange={(event) =>
                      this.setState({ mobile: event.target.value })
                    }
                    placeholder="Mobile"
                    error={this.state.mobileError}
                  />
                </Form.Field>
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
              </Form.Group>
              <label style={{ color: "#808080" }}>Address</label>
              <Form.TextArea
                error={this.state.paddressError}
                value={this.state.paddress}
                onChange={(event) =>
                  this.setState({ paddress: event.target.value })
                }
                placeholder="Address..."
              />
              <Form.Group widths="equal">
                <Form.Field>
                  <label style={{ color: "#808080" }}>Postal Code</label>
                  <Form.Input
                    fluid
                    value={this.state.postalcode}
                    onChange={(event) =>
                      this.setState({ postalcode: event.target.value })
                    }
                    placeholder="Postal Code"
                    error={this.state.postalcodeError}
                  />
                </Form.Field>
                <Form.Field>
                  <label style={{ color: "#808080" }}>State</label>
                  <Dropdown
                    error={this.state.countryError}
                    placeholder="State"
                    fluid
                    selection
                    options={this.countryOptions}
                    onChange={this.countryOnChange}
                  />
                </Form.Field>
              </Form.Group>
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
              <Form.Field>
                <label style={{ color: "#808080" }}>File Password</label>
                <Form.Input
                  fluid
                  type="password"
                  value={this.state.filePassword}
                  onChange={(event) =>
                    this.setState({ filePassword: event.target.value })
                  }
                  placeholder="Password"
                  error={this.state.filePasswordError}
                />
              </Form.Field>
              <Message
                hidden={
                  !this.state.createNewMedicalRecordErrorMessage.length != 0
                }
                header="Oops!"
                content={this.state.createNewMedicalRecordErrorMessage}
              />
              <Button
                type="submit"
                disabled={this.state.createNewMedicalRecordLoading}
                loading={this.state.createNewMedicalRecordLoading}
                content="Create Contract"
                primary
              />
            </Form>
            <Message attached='bottom' info>
              <Message.Header>Need Help?</Message.Header>
              <p>For adding new patient</p>
                <Message.List>
                  <Message.Item>All details are <b>compulsory</b></Message.Item>
                  <Message.Item><b>Aadhar:</b> Enter <b>patient's aadhar</b> no.</Message.Item>
                  <Message.Item>Enter your valid <b>12 digit</b> Aadhar no. ( and not just any random no )!</Message.Item>
                  <Message.Item><b>Password:</b> This helps to view record or to authorize different doctor to view same record </Message.Item>
                  <Message.Item><b>File Password:</b> Required for uploading files for given patient</Message.Item>
                  {/* <Message.Item>For adding new patient <b>0.4 gas fee</b> will be deducted from your metamask account, after that wait till the pop up says <b>"Medical Record Created Successfully"</b></Message.Item> */}
                </Message.List>
            </Message>
            <Divider horizontal>
              <Header as="h4" color="grey">
                Medical Information
              </Header>
            </Divider>
            <Form
              onSubmit={this.updateNonDemographicData}
              error={!!this.state.errorMessage}
              className='attached fluid segment'
            >
              <Form.Field>
                <label style={{ color: "#808080" }}>Aadhar</label>
                <Form.Input
                  fluid
                  value={this.state.medInfAadhar}
                  onChange={(event) =>
                    this.setState({ medInfAadhar: event.target.value })
                  }
                  placeholder="Aadhar"
                  error={this.state.medInfAadharError}
                />
              </Form.Field>
              <label style={{ color: "#808080" }}>Medical History</label>
              <Form.TextArea
                error={this.state.medicalHistoryError}
                value={this.state.medicalHistory}
                onChange={(event) =>
                  this.setState({ medicalHistory: event.target.value })
                }
                placeholder="Medical History..."
              />
              <label style={{ color: "#808080" }}>Diagnosis</label>
              <Form.TextArea
                error={this.state.diagnosisError}
                value={this.state.diagnosis}
                onChange={(event) =>
                  this.setState({ diagnosis: event.target.value })
                }
                placeholder="Diagnosis..."
              />
              <label style={{ color: "#808080" }}>Medications</label>
              <Form.TextArea
                error={this.state.medicationsError}
                value={this.state.medications}
                onChange={(event) =>
                  this.setState({ medications: event.target.value })
                }
                placeholder="Medications..."
              />
              <label style={{ color: "#808080" }}>Allergies</label>
              <Form.TextArea
                error={this.state.allergiesError}
                value={this.state.allergies}
                onChange={(event) =>
                  this.setState({ allergies: event.target.value })
                }
                placeholder="Allergies..."
              />
              <label style={{ color: "#808080" }}>Progress Notes</label>
              <Form.TextArea
                error={this.state.progressNotesError}
                value={this.state.progressNotes}
                onChange={(event) =>
                  this.setState({ progressNotes: event.target.value })
                }
                placeholder="Progress Notes..."
              />
              <label style={{ color: "#808080" }}>Vital Signs</label>
              <Form.TextArea
                error={this.state.vitalSignsError}
                value={this.state.vitalSigns}
                onChange={(event) =>
                  this.setState({ vitalSigns: event.target.value })
                }
                placeholder="VitalSigns..."
              />
              <label style={{ color: "#808080" }}>Immunization Dates</label>
              <Form.TextArea
                error={this.state.immunizationDatesError}
                value={this.state.immunizationDates}
                onChange={(event) =>
                  this.setState({ immunizationDates: event.target.value })
                }
                placeholder="Immunization Dates..."
              />
              <label style={{ color: "#808080" }}>Emergency</label>
              <Form.TextArea
                error={this.state.emergencyError}
                value={this.state.emergency}
                onChange={(event) =>
                  this.setState({ emergency: event.target.value })
                }
                placeholder="Emergency..."
              />
              <Message
                hidden={
                  !this.state.updateNonDemographicDataErrorMessage.length != 0
                }
                header="Oops!"
                content={this.state.updateNonDemographicDataErrorMessage}
              />
              <Button
                type="submit"
                disabled={this.state.updateNonDemographicDataLoading}
                loading={this.state.updateNonDemographicDataLoading}
                content="Upload NonDemographics Data"
                primary
              />
            </Form>
            <Message attached='bottom' info>
              <Message.Header>Need Help?</Message.Header>
              <p>For adding non-demographics data</p>
                <Message.List>
                  <Message.Item>All details are <b> not compulsory</b>, you can just add the required details</Message.Item>
                  <Message.Item>Only <b>authorised doctor</b> can upload non-demographic data for their respective patients</Message.Item>
                  <Message.Item><b>Aadhar:</b> Enter <b>registered patient's aadhar</b> no.</Message.Item>
                  {/* <Message.Item>For uploading non demographics data, <b>0.4 gas fee</b> will be deducted from your metamask account, after that wait till the pop up says <b>"Changes Applied Successfully"</b></Message.Item> */}
                </Message.List>
            </Message>
            <Divider horizontal>
              <Header color="grey" as="h4">
                Files
              </Header>
            </Divider>
            <Form
              onSubmit={this.updateFiles}
              error={!!this.state.uploadFilesErrorMessage}
              className='attached fluid segment'
            >
              <Form.Field>
                <label style={{ color: "#808080" }}>Aadhar</label>
                <Form.Input
                  fluid
                  value={this.state.fileAadhar}
                  onChange={(event) =>
                    this.setState({ fileAadhar: event.target.value })
                  }
                  placeholder="Aadhar"
                  error={this.state.fileAadharError}
                />
              </Form.Field>
              <Form.Field>
                <label style={{ color: "#808080" }}>Billing</label>
                <Input
                  placeholder="Billing"
                  value={this.state.billingData}
                  onChange={(event) =>
                    this.setState({ billingData: event.target.value })
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
                  value={this.state.radiologyImages}
                  onChange={(event) =>
                    this.setState({ radiologyImages: event.target.value })
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
                  value={this.state.labResults}
                  onChange={(event) =>
                    this.setState({ labResults: event.target.value })
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
                hidden={!this.state.uploadFilesErrorMessage.length != 0}
                header="Oops!"
                content={this.state.uploadFilesErrorMessage}
              />
              <Button
                type="submit"
                loading={this.state.updateFilesLoading}
                disabled={this.state.updateFilesLoading}
                content="Upload Files"
                primary
              />
            </Form>
            <Message attached='bottom' info>
              <Message.Header>Need Help?</Message.Header>
              <p>For uploading files</p>
                <Message.List>
                  <Message.Item>All details are <b> not compulsory</b>, you can just add the required details</Message.Item>
                  <Message.Item>Only <b>authorised doctor</b> can upload files for their respective patients</Message.Item>
                  <Message.Item><b>Aadhar:</b> Enter <b>registered patient's aadhar</b> no.</Message.Item>
                  <Message.Item>You can add <b>multiple files</b> simultaneously in <b>"Select files for upload"</b></Message.Item>
                  <Message.Item>After uploading files, wait till it <b>generates hash</b> and reflects it in the form</Message.Item>
                  {/* <Message.Item>For uploading files, <b>0.4 gas fee</b> will be deducted from your metamask account, after that wait till the pop up says <b>"Changes Applied Successfully"</b></Message.Item> */}
                  {/* <Message.Item>Also after uploading files successfully, a new <b>"rinkeby.etherscan.io"</b> tab will be opened where you can see transaction hash </Message.Item> */}
                </Message.List>
            </Message>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
