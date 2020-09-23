import React, { Component } from "react";
import { Accordion, Icon, Label, Message } from "semantic-ui-react";
import { parse } from "path";
import _ from "lodash";

export class logs extends Component {
  constructor(props) {
    super(props);
    this.state = { activeIndex: 0,
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
    ], };
  }

  handleClick = (e, titleProps) => {
    const index = titleProps;
    const activeIndex = this.state.activeIndex;
    const newIndex = activeIndex === index ? -1 : index;

    this.setState({ activeIndex: newIndex });
  };

  renderEvents = () => {
    const panels = _.times(this.props.data.length, (i) => ({
      key: `panel-${i}`,
      title: {
        content: (
          <Label
            fluid
            color={this.state.colors[i%12]}
            content={this.props.data[i]["returnValues"]["logHeader"]}
          />
        ),
      },
      content: {
        content: (
          <Message
            info
            color={this.state.colors[i%12]}
            content={this.props.data[i]["returnValues"]["logDetails"]}
          />
        ),
      },
    }));

    return panels;

    // const { Content, Panel, Title } = Accordion;
    // return this.props.data.map((req, ind) => {
    //     return (
    //         <div>
    //                             <Title
    //         active={this.state.activeIndex === parseInt(ind)}
    //         index={ind}
    //         onClick={this.handleClick}
    //         ><Label color='blue' content={this.props.data[ind]['returnValues']['logHeader']} />

    //       </Title>
    //       <Content active={this.state.activeIndex === ind}>
    //       <Message color='blue'>{this.props.data[ind]['returnValues']['logDetails']}</Message>
    //       </Content>
    //         </div>
    //     )
    // });
  };
  render() {
    return (
      <div>
        <Accordion fluid defaultActiveIndex={1} panels={this.renderEvents()} />
      </div>
    );
  }
}

export default logs;
