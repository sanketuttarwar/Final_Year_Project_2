import React, { Component } from "react";
import axios from "axios";
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
} from "semantic-ui-react";
import Owner from "../ethereum/build/Owner";
import web3 from "../ethereum/web3";

export class RequestInsRequests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      request: null,
      downloadLoading: false,
      aadhar: "",
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

  componentWillMount() {
    this.setState({
      request: this.props.requestData,
      aadhar: this.props.aadhar,
    });
  }

  getBills = async () => {
    this.setState({ downloadLoading: true ,
      isLoaderDimmerActive: true});
    axios
      .get("/download", {
        params: {
          data: this.state.request[6],
          password: this.state.aadhar,
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
        this.setState({ downloadLoading: false });
       } 
       this.setState({isLoaderDimmerActive:false});
      })
    
      .catch((err) => {
        // then print response status
      });
  };

  render() {
    const { Content, Header, Meta, Description } = Card;
    return (
      <Card color={this.state.colors[Math.floor(Math.random() * 11)]}>
        <Content>
          <Header>{this.state.request[2]}</Header>
          <Description>{this.state.request[3]}</Description>
        </Content>
        <Content extra>
          <div className="ui two buttons">
            <Button
              loading={this.state.downloadLoading}
              disabled={this.state.downloadLoading}
              onClick={this.getBills}
              style={{ marginBottom: "4px" }}
              color="blue"
            >
              Get Bills
            </Button>
          </div>

          <Label as="a" color="orange" tag>
            <Icon disabled name="check circle" color="white" />
            Doctor
          </Label>

          {/* {((this.state.request[8])==false)?
                    <Label as='a' color='teal' tag>
                        <Icon disabled name='hourglass end' color='white' />Pending
                    </Label>: null}

                    {(((this.state.request[8])==true) && ((this.state.request[5])==true))?
                    <Label as='a' color='teal' tag>
                        <Icon disabled name='check circle' color='white' />Owner
                    </Label>: null}

                    {(((this.state.request[8])==true) && ((this.state.request[5])==false))?
                    <Label as='a' color='teal' tag>
                        <Icon disabled name='cancel' color='white' />Owner
                    </Label>: null} */}

          {this.props.type == "pending" ? (
            <Label as="a" color="teal" tag>
              <Icon disabled name="hourglass end" color="white" />
              Pending
            </Label>
          ) : null}

          {this.props.type == "approved" ? (
            <Label as="a" color="purple" tag>
              <Icon disabled name="check circle" color="white" />
              Owner
            </Label>
          ) : null}

          {this.props.type == "rejected" ? (
            <Label as="a" color="violet" tag>
              <Icon disabled name="cancel" color="white" />
              Owner
            </Label>
          ) : null}
        </Content>
      </Card>
    );
  }
}

export default RequestInsRequests;
