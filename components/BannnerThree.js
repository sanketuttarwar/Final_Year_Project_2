import React, { Component } from 'react'
import { Grid, Image, Header, Icon } from 'semantic-ui-react'
//  import ParticleAnimation from 'react-particle-animation'
// import { SizeMe } from 'react-sizeme'
import Head from 'next/head';
import Typing from 'react-typing-animation';

class BannerThree extends Component {
    

    render() {
        const purposeOne = {
            backgroundColor:'#381172',
            marginTop: '4em'
        }

        const purposeTwo = {
            backgroundColor:'#381172'
        }

        const imageStyle = {
            marginLeft: '8em',
            // marginBottom: '8em',
            // padding:'8em',
            width: '60%'
        }

        const contentStyle = {
            marginLeft: '15em',
            marginTop:'7em'
        }

        return (
            <div>
            <Head>
                    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" /> 
                    <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet"></link>
                    <link rel="stylesheet"  href="../static/css/homecss.css"/>
                    
                </Head>
            <Grid style={purposeOne}>
                
                <Grid.Row >
                    <Grid.Column  width={7}>
                         <Grid.Column style={contentStyle} padded='vertically' rows={6} relaxed="true">
                        

                        
                    <div class="text-block">
                        <Typing speed={20} hideCursor={true}>
                            <h1 style={{fontSize: '45px !important'}}>HEALTH DATA MANAGEMENT ON BLOCKCHAIN</h1>
                            <h2 style={{fontSize: '30px !important'}}>
                                <div>GLOBAL PLATFORM FOR HEALTH MANAGEMENT BENEFIT</div>
                                INSURANCE AND ADMINISTRATION
                            </h2>
                        </Typing> 
                
                </div> 
                       
                    </Grid.Column>
                    </Grid.Column>
                    <Grid.Column width={9}  style={purposeOne}>
                        <Image src='../static/image/blockchain.png' style={imageStyle}/>
                    </Grid.Column>
                    
                </Grid.Row>
              
            </Grid>
            </div>
        )
    }
    
}
  
  export default BannerThree

