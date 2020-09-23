import React, { Component } from 'react';
import Layout from "../components/layout";
import BannerOne from '../components/BannerOne';
import BannerTwo from '../components/BannerTwo';
import BannerFour from '../components/BannerFour';
import BannerThree from '../components/BannnerThree';
import BannerHome from '../components/BannerHome';
import Head from 'next/head';

export class index extends Component {
    render() {
        return (
            
            <div>
                <Head>
                    <title>Blockchain Health</title>
                    <link rel="shortcut icon" href="/static/favicon.ico" />
                </Head>
                <Layout>
                    <BannerThree />
                    {/* <BannerHome /> */}
                    <BannerFour />
                    {/* <BannerOne /> */}
                    <BannerTwo />
                    
                </Layout>
            </div>
        )
    }
}

export default index