import React, { Component } from 'react';
import {Container } from 'semantic-ui-react';
import Head from 'next/head';
import Typing from 'react-typing-animation';

class BannerDoctor extends Component {
    render() {

        const imgStyle = {
            width:'65%'
        }
        return (
            <div>
                <Head>
                    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" /> 
                    <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet"></link>
                    <link rel="stylesheet"  href="../static/css/doctor.css"/>
                </Head>
                <div class="ui text segment landing ">
                    <div class="text-block">
                        <Typing speed={20} hideCursor={true}>
                            <h1 style={{fontSize: '45px !important'}}>COORDINATING TOTAL MANAGEMENT FOR DOCTORS</h1>
                            <h2 style={{fontSize: '30px !important'}}>
                                <div>REGISTER AS A DOCTOR</div>
                                <div>SEARCH PATIENT RECORDS</div>
                                CREATE A NEW RECORD FOR PATIENTS
                            </h2>
                        </Typing>
                    </div>
                </div> 
            </div>
        );
    }
};

export default BannerDoctor;