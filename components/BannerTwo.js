import React, { Component } from 'react'
import { Grid, Image, Header, Icon } from 'semantic-ui-react'


class BannerTwo extends Component {
    render() {
        const purposeOne = {
            backgroundColor:"#5B3197"
        }

        const purposeTwo = {
            backgroundColor:"#8255BC"
        }

        const imageStyle = {
            marginLeft: '8em',
            marginTop: '12em',
            marginBottom: '8em',
            width: '65%'
        }

        const contentStyle = {
            marginLeft: '15em',
            marginTop:'10em'
        }

        return (
            <Grid >
                <Grid.Row >
                    <Grid.Column  width={7} style={purposeOne} >
                         <Grid.Column style={contentStyle} padded='vertically' rows={6} >
                        {/*    <Grid.Row fluid><Header size='huge' inverted>Purpose of the platform</Header></Grid.Row>
                            <Grid.Row fluid><Header as='h4' inverted>Redefine the way healthcare is accessed, delivered, managed, and paid for.</Header></Grid.Row>
                            <Grid.Row fluid>
                                <Grid.Column></Grid.Column>
                                <Grid.Column><Header as='h3' inverted>Improve access to care</Header></Grid.Column>
                            </Grid.Row>
                            <Grid.Row fluid>
                                <Grid.Column></Grid.Column>
                                <Grid.Column><Header as='h3' inverted>Administer healthcare more efficiently</Header></Grid.Column>
                            </Grid.Row>
                            <Grid.Row fluid>
                                <Grid.Column></Grid.Column>
                                <Grid.Column><Header as='h3' inverted>Pay providers for results accurately and on time</Header></Grid.Column>
                            </Grid.Row>
                            <Grid.Row fluid>
                                <Grid.Column></Grid.Column>
                                <Grid.Column><Header as='h3'inverted>Improve outcomes and reduce overall costs</Header></Grid.Column>
                            </Grid.Row>
                        </Grid.Column> */}

                        <Header
                            as='h1'
                            content='Purpose of the platform'
                            subheader='Redefine the way health management is accessed, delivered, managed, and paid for.'
                            inverted
                        />
                        <Header as='h2' inverted>
                            <Icon name='chart bar outline' />
                            <Header.Content >Improve access to care</Header.Content>
                        </Header>
                        <Header as='h2' inverted>
                            <Icon name='settings' />
                            <Header.Content>Administer health management more efficiently</Header.Content>
                        </Header>
                        <Header as='h2' inverted>
                            <Icon name='money bill alternate outline' />
                            <Header.Content>Access Insurance easily and on time</Header.Content>
                        </Header>
                        <Header as='h2' inverted>
                            <Icon name='time' />
                            <Header.Content>Improve outcomes and reduce overall costs</Header.Content>
                        </Header>

                    </Grid.Column>
                    </Grid.Column>
                    <Grid.Column width={9}  style={purposeTwo}>
                        <Image src='../static/image/purpose.svg' style={imageStyle}/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    
}
  
  export default BannerTwo

