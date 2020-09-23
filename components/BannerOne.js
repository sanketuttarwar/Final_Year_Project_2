import React, { Component } from 'react';
import {Container } from 'semantic-ui-react';
import Head from 'next/head';
                
class BannerOne extends Component {
    render() {
        return (
            <div>
                <Head>
                    <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" /> 
                    <link rel="stylesheet"  href="../static/css/bannerone.css"/>
                </Head>
                <div class="ui three column grid container laying">
                    <div class="row">
                        <div class="column">
                             <div class="ui two column grid">
                                <div class="column">
                                    <img src="../static/image/GridOne.png" class="ui sizing centered image"></img>
                                </div>
                                <div class="column">
                                    <div class="content">
                                        <div class="ui vertical centered">Molly</div>
                                        <div class="ui vertical centered">Molly</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="column">
                            <div class="ui two column grid">
                                <div class="column">
                                    <img src="../static/image/GridTwo.png" class="ui sizing centered image"></img>
                                </div>
                                <div class="column">
                                    <div class="content">
                                        <div class="ui vertical centered">Molly</div>
                                        <div class="ui vertical centered">Molly</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="column">
                            <div class="ui two column grid">
                                <div class="column">
                                    <img src="../static/image/GridThree.png" class="ui sizing centered image"></img>
                                </div>
                                <div class="column">
                                    <div class="content">
                                        <div class="ui vertical centered">Molly</div>
                                        <div class="ui vertical centered">Molly</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="column">
                            <div class="ui two column grid">
                                <div class="column">
                                    <img src="../static/image/GridFour.png" class="ui sizing centered image"></img>
                                </div>
                                <div class="column">
                                    <div class="content">
                                        <div class="ui vertical centered">Molly</div>
                                        <div class="ui vertical centered">Molly</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="column">
                            <div class="ui two column grid">
                                <div class="column">
                                    <img src="../static/image/GridFive.png" class="ui sizing centered image"></img>
                                </div>
                                <div class="column">
                                    <div class="content">
                                        <div class="ui vertical centered">Molly</div>
                                        <div class="ui vertical centered">Molly</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="column">
                            <div class="ui two column grid">
                                <div class="column">
                                    <img src="../static/image/GridSix.png" class="ui sizing centered image"></img>
                                </div>
                                <div class="column">
                                    <div class="content">
                                        <div class="ui vertical centered">Molly</div>
                                        <div class="ui vertical centered">Molly</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default BannerOne;