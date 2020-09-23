import React, { Component } from 'react';
import {Container } from 'semantic-ui-react';
import Head from 'next/head';
import Typing from 'react-typing-animation';

class BannerHome extends Component {
    render() {

        const imgStyle = {
            width:'65%'
        }
        return (
            <div>
                <Head>
                    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" /> 
                    <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet"></link>
                    <link rel="stylesheet"  href="../static/css/homecss.css"/>
                    
                </Head>
                <div class="ui text segment landing">
                    <div class="text-block">
                        <Typing speed={5} hideCursor={true}>
                            <h1 style={{fontSize: '45px !important'}}>HEALTH DATA MANAGEMENT ON BLOCKCHAIN</h1>
                            <h2 style={{fontSize: '30px !important'}}>
                                <div>GLOBAL PLATFORM FOR HEALTH MANAGEMENT BENEFIT</div>
                                INSURANCE AND ADMINISTRATION
                            </h2>
                        </Typing> 
                    </div>
                </div> 
            </div>
        );
    }
};

export default BannerHome;