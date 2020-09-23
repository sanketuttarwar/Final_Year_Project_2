import React, { Component } from "react";
import {
  Segment,
  Statistic,
  Tab,
  Form,
  Table,
  Card,
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
  Confirm,
} from "semantic-ui-react";
import own from "../ethereum/build/Owner";
import web3 from "../ethereum/web3";
import axios from "axios";

export class RequestRequests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      modalHeader: "",
      modalContent: "",
      modalIconColor: "red",
      modalIconName: "cancel",
      approveRequestLoading: false,
      rejectRequestLoading: false,
      docDownloadLoading: false,
      billsDownloadLoading: false,
      approveConfirm: false,
      rejectConfirm: false,
      colors: [
        "red",
        "orange",
        "yellow",
        "olive",
        "green",
        "teal",
        "blue",
        "violet",
        "purple",
        "pink",
        "brown",
        "grey",
      ],
    };
  }

  approveConfirm = () => {
    this.setState({ approveConfirm: false });
    this.approveRequest();
  };

  approveConfirmClose = () => {
    this.setState({ approveConfirm: false });
  };

  approveConfirmOpen = () => {
    if (this.state.rejectRequestLoading == false) {
      this.setState({ approveConfirm: true });
    }
  };

  rejectConfirm = () => {
    this.setState({ rejectConfirm: false });
    this.rejectRequest();
  };

  rejectConfirmClose = () => {
    this.setState({ rejectConfirm: false });
  };

  rejectConfirmOpen = () => {
    if (this.state.approveRequestLoading == false) {
      this.setState({ rejectConfirm: true });
    }
  };

  modalTopple = () => {
    this.setState({ isModalOpen: !this.state.isModalOpen });
  };

  getBills = async () => {
    let fileHash = this.props.request[6],
      pass = this.props.request[9];
    this.setState({ billsDownloadLoading: true ,
      isLoaderDimmerActive: true
    });
    
    axios
      .get("/download", {
        params: {
          data: fileHash,
          password: pass,
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

        this.setState({ billsDownloadLoading: false });
      }
      this.setState({isLoaderDimmerActive:false});
    })
      .catch((err) => {
        // then print response status
      });
  };

  getDocuments = async () => {
    let fileHash = this.props.request[10],
      pass = this.props.request[9];
    this.setState({ docDownloadLoading: true ,
      isLoaderDimmerActive: true});
    
    axios
      .get("/download", {
        params: {
          data: fileHash,
          password: pass,
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
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "download.zip");
        document.body.appendChild(link);
        link.click(); // then print response status
        this.setState({ docDownloadLoading: false });
      }
      this.setState({isLoaderDimmerActive:false});
    })
      .catch((err) => {
        // then print response status
      });
  };

  approveRequest = async () => {
    this.setState({ approveRequestLoading: true });
    const accounts = await web3.eth.getAccounts();

    try {
      const address = new web3.eth.Contract(own.abi, this.props.request[0]);
      await address.methods
        .approveCancelRequest(this.props.request[8], true)
        .send({ from: accounts[0], gas: 9999999, gasPrice: "40000000000" });
    } catch (err) {
      this.setState({ approveRequestLoading: false });
      return;
    }
    this.setState({ approveRequestLoading: false });
    this.setState({
      modalHeader: "Success",
      modalContent: "Request Approved Successfully",
      modalIconColor: "green",
      modalIconName: "check circle",
      isModalOpen: true,
    });
  };

  rejectRequest = async () => {
    this.setState({ rejectRequestLoading: true });
    const accounts = await web3.eth.getAccounts();

    try {
      const address = new web3.eth.Contract(own.abi, this.props.request[0]);
      await address.methods
        .approveCancelRequest(this.props.request[8], false)
        .send({ from: accounts[0], gas: 9999999, gasPrice: "40000000000" });
    } catch (err) {
      this.setState({ rejectRequestLoading: false });
      return;
    }
    this.setState({ rejectRequestLoading: false });
    this.setState({
      modalHeader: "Success",
      modalContent: "Request Rejected Successfully",
      modalIconColor: "green",
      modalIconName: "check circle",
      isModalOpen: true,
    });
  };

  render() {
    const { Content, Header, Meta, Description } = Card;
    const { key, request, type } = this.props;
    return (
      <div>
        <Confirm
          open={this.state.approveConfirm}
          onCancel={this.approveConfirmClose}
          onConfirm={this.approveConfirm}
        />
        <Confirm
          open={this.state.rejectConfirm}
          onCancel={this.rejectConfirmClose}
          onConfirm={this.rejectConfirm}
        />
        <Modal open={this.state.isModalOpen} inverted>
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
            <Button color="blue" onClick={this.modalTopple} inverted>
              <Icon name="checkmark" /> Ok
            </Button>
          </Modal.Actions>
        </Modal>
        <Card
          color={this.state.colors[Math.floor(Math.random() * 11)]}
          style={{ margin: "4px" }}
        >
          <Card.Content header={request[2]} />
          <Card.Content description={request[3]} />
          <Content extra>
            <div className="ui two buttons">
              <Button
                onClick={this.getDocuments}
                loading={this.state.docDownloadLoading}
                disabled={this.state.docDownloadLoading}
                style={{ marginBottom: "4px" }}
                color="blue"
              >
                Get Documents
              </Button>
            </div>
            <div className="ui two buttons">
              <Button
                onClick={this.getBills}
                loading={this.state.billsDownloadLoading}
                disabled={this.state.billsDownloadLoading}
                style={{ marginBottom: "4px" }}
                color="blue"
              >
                Get Bills
              </Button>
            </div>
            {type == "pending" ? (
              <div className="ui two buttons">
                <Button.Group style={{ width: "100%", marginBottom: "4px" }}>
                  <Button
                    onClick={this.approveConfirmOpen}
                    loading={this.state.approveRequestLoading}
                    disabled={this.state.approveRequestLoading}
                    color="green"
                    size="large"
                  >
                    Approve
                  </Button>
                  <Button.Or />
                  <Button
                    onClick={this.rejectConfirmOpen}
                    loading={this.state.rejectRequestLoading}
                    disabled={this.state.rejectRequestLoading}
                    color="red"
                    size="large"
                  >
                    Reject
                  </Button>
                </Button.Group>
              </div>
            ) : null}
            <Label icon="hourglass end" as="a" color="orange" tag>
              <Icon disabled name="check circle" color="white" />
              Doctor
            </Label>

            {type == "pending" ? (
              <Label icon="hourglass end" as="a" color="teal" tag>
                <Icon disabled name="hourglass end" color="white" />
                Owner
              </Label>
            ) : null}

            {type == "approved" ? (
              <Label as="a" color="purple" tag>
                <Icon disabled name="check circle" color="white" />
                Owner
              </Label>
            ) : null}

            {type == "rejected" ? (
              <Label as="a" color="violet" tag>
                <Icon disabled name="cancel" color="white" />
                Owner
              </Label>
            ) : null}
          </Content>
        </Card>
      </div>
    );
  }
}

export default RequestRequests;
