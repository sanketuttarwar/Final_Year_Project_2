import React, { Component } from 'react';
import {Container } from 'semantic-ui-react';
import Head from 'next/head';
import Typing from 'react-typing-animation';


class BannerInsurance extends Component {
    render() {

        const imgStyle = {
            marginTop:'100px'
        }
        return (
            <div>
                <Head>
                    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" /> 
                    <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet"></link>
                    <link rel="stylesheet"  href="../static/css/insurance.css"/>
                </Head>
                <div class="ui text segment landing" >
                    <div class="text-block">
                        <Typing speed={20} hideCursor={true}>
                            <h1 style={{fontSize: '45px !important'}}>EMPOWERING MEMBERS FOR INSURANCE COMPANIES</h1>
                            <h2 style={{fontSize: '30px !important'}}>
                                <div>CREATE NEW INSURANCES</div>
                                <div>CHECK ALL INSURANCES ISSUED</div>
                                <div>CHECK ALL REQUESTS</div>
                                APPROVE/REJECT ANY PENDING REQUESTS
                            </h2>
                        </Typing>
                    </div>
                </div> 
            </div>
        );
    }
};

export default BannerInsurance;