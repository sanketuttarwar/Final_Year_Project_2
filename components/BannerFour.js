import React, { Component } from 'react'
import { Grid, Image, Header, Icon } from 'semantic-ui-react'
//  import ParticleAnimation from 'react-particle-animation'
// import { SizeMe } from 'react-sizeme'

class BannerFour extends Component {
    

    render() {
        const purposeOne = {
            backgroundColor:"#FFF",
            marginTop: '4em'
        }

        const purposeTwo = {
            backgroundColor:"#FFF"
        }

        const imageStyle = {
            marginLeft: '8em',
            marginBottom: '8em',
            width: '55%'
        }

        const contentStyle = {
            marginLeft: '15em',
            marginTop:'7em'
        }

        return (
            
            <Grid style={purposeOne}>
                
                <Grid.Row >
                    <Grid.Column  width={7}>
                         <Grid.Column style={contentStyle} padded='vertically' rows={6} relaxed="true">
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
                            content='How the platform works'
                            subheader='Using blockchain technology, we’ve built a comprehensive health data management platform from the ground up.

                            
                            You can build 3 types of networks:'
                            
                        />
                        <Header as='h2' >
                            <Icon name='chart bar outline' />
                            <Header.Content >Benefit Network</Header.Content>
                        </Header>
                        <Header as='h2' >
                            <Icon name='settings' />
                            <Header.Content>Clinical Network</Header.Content>
                        </Header>
                        <Header as='h2' >
                            <Icon name='money bill alternate outline' />
                            <Header.Content>Insurance Network</Header.Content>
                        </Header>
                       
                    </Grid.Column>
                    </Grid.Column>
                    <Grid.Column width={9}  style={purposeOne}>
                        <Image src='../static/image/hp_with_family_light_platforms.png' style={imageStyle}/>
                    </Grid.Column>
                    
                </Grid.Row>
                {/* <ParticleAnimation /> */}
                {/* <ParticleAnimation 
                    numParticles={500}
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%'
                    }} 
                /> */}
            </Grid>
            
        )
    }
    
}
  
  export default BannerFour

