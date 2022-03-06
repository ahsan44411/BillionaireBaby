import React, {useEffect, useState, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {connect} from "./redux/blockchain/blockchainActions";
import {fetchData} from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import './styles/evolution-apez.webflow-v1.css'
import Particles from "react-tsparticles";
// import './styles/cube.css'
import logo from './images/logo.png'

const truncate = (input, len) =>
    input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 6px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 30%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 24px;
  fontStyle: "Ubuntu"
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -webkit-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  -moz-box-shadow: 0px 4px 0px -2px rgba(250, 250, 250, 0.3);
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 1087px) {
    flex-direction: row;
  }
  z-index: 5;
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
  z-index: 5;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px solid var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (max-width: 600px) {
    display: none;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary);
  text-decoration: none;
`;

function App() {
    const dispatch = useDispatch();
    const particleState = 'links' // links || circle || polygon
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    const [claimingNft, setClaimingNft] = useState(false);
    const [feedback, setFeedback] = useState(`Click 'MINT' to adopt your Billionaire Babies!`);
    const [mintAmount, setMintAmount] = useState(1);
    const [CONFIG, SET_CONFIG] = useState({
        CONTRACT_ADDRESS: "",
        SCAN_LINK: "",
        NETWORK: {
            NAME: "",
            SYMBOL: "",
            ID: 0,
        },
        NFT_NAME: "",
        SYMBOL: "",
        MAX_SUPPLY: 1,
        WEI_COST: 0,
        DISPLAY_COST: 0,
        GAS_LIMIT: 0,
        MARKETPLACE: "",
        MARKETPLACE_LINK: "",
        SHOW_BACKGROUND: false,
    });
    const [count, setCount] = useState(1)

    const minus_handle = () => {
        if (count !== 0)
            setCount(count - 1)
    }
    const positive_handle = () => {
        setCount(count + 1)
    }

    const claimNFTs = () => {
        let cost = CONFIG.WEI_COST;
        let gasLimit = CONFIG.GAS_LIMIT;
        let totalCostWei = String(cost * mintAmount);
        let totalGasLimit = String(gasLimit * mintAmount);
        console.log("Cost: ", totalCostWei);
        console.log("Gas limit: ", totalGasLimit);
        setFeedback(`Minting your Billionaire Baby...`);
        setClaimingNft(true);
        blockchain.smartContract.methods
            .mint(blockchain.account, mintAmount)
            .send({
                gasLimit: String(totalGasLimit),
                to: CONFIG.CONTRACT_ADDRESS,
                from: blockchain.account,
                value: totalCostWei,
            })
            .once("error", (err) => {
                console.log(err);
                setFeedback("Sorry, something went wrong please try again later.");
                setClaimingNft(false);
            })
            .then((receipt) => {
                console.log(receipt);
                setFeedback(
                    `Yay! You're now a happy parent! Head over to https://opensea.io/collection/billionairebabyclubnftofficial to view it!`
                );
                setClaimingNft(false);
                dispatch(fetchData(blockchain.account));
            });
    };

    const decrementMintAmount = () => {
        let newMintAmount = mintAmount - 1;
        if (newMintAmount < 1) {
            newMintAmount = 1;
        }
        setMintAmount(newMintAmount);
    };

    const incrementMintAmount = () => {
        let newMintAmount = mintAmount + 1;
        if (newMintAmount > 20) {
            newMintAmount = 20;
        }
        setMintAmount(newMintAmount);
    };

    const getData = () => {
        if (blockchain.account !== "" && blockchain.smartContract !== null) {
            dispatch(fetchData(blockchain.account));
        }
    };

    const getConfig = async () => {
        const configResponse = await fetch("/config/config.json", {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        const config = await configResponse.json();
        SET_CONFIG(config);
    };

    useEffect(() => {
        getConfig();
    }, []);

    useEffect(() => {
        getData();
    }, [blockchain.account]);

    return (
        <div style={{width: '100%', height: '100%'}}>
            <Particles
                style={{zIndex: -1}}
                options={{
                    background: {
                        color: {
                            value: "#010c1f",
                        },
                    },
                    fpsLimit: 30,
                    particles: {
                        size: {
                            value: particleState === 'links' ? 3 : particleState === 'circle' ? 3 : 71,
                        },
                        color: {
                            value: particleState === 'links' ? '#FFFFFF' : particleState === 'circle' ? '#FFFFFF' : "#2C2E43",
                        },
                        collisions: {
                            enable: true,
                        },
                        line_linked: {
                            "enable": particleState === 'links' && true,
                            "distance": 300,
                            "color": "#ffffff",
                            "opacity": 0.4,
                            "width": 2
                        },
                        move: {
                            direction: "none",
                            enable: true,
                            outMode: "bounce",
                            random: false,
                            speed: 1,
                            straight: false,
                        },
                        number: {
                            density: {
                                enable: true,
                                area: 800,
                            },
                            value: particleState === 'links' ? 30 : particleState === 'circle' ? 30 : 3,
                        },
                        opacity: {
                            value: 0.5,
                        },
                        shape: {
                            type: particleState === 'links' ? 'circle' : particleState === 'snow' ? 'circle' : 'polygon',
                        },
                    },
                    detectRetina: true,
                }}
            />
            <div style={{display: 'flex', flexDirection: 'column', padding: 60}}>
                <img src={logo} style={{margin: '20px auto', zIndex: 5, width: 300}}/>
                <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12"
                         style={{padding: 10, backgroundColor: '#010C1F', zIndex: 5}}>
                        <div style={{
                            width: "100%",
                            border: '4px solid white',
                            padding: "70px 20px",
                            textAlign: 'center',
                            borderRadius: 12
                        }}
                        >
                            <p style={{fontSize: 50, fontWeight: 700}}>PRE-SALE</p>
                            <p style={{fontSize: 45, fontWeight: 700, margin: "10px 0"}}><span
                                style={{color: '#61D6C8'}}>{Number(data.totalSupply) == 0 ? ("X" + "/" + CONFIG.MAX_SUPPLY) : ("" + data.totalSupply + "/" + CONFIG.MAX_SUPPLY)}</span> MINTED
                            </p>
                            <a target={'_black'} style={{textDecoration: 'none', color: '#61D6C8', fontSize: 17}}
                               href={CONFIG.SCAN_LINK}>{truncate(CONFIG.CONTRACT_ADDRESS, 15)}</a>

                            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
                                <>
                                    <s.TextTitle
                                        style={{textAlign: "center", color: "var(--accent-text)"}}
                                    >
                                        The sale has ended.
                                    </s.TextTitle>
                                    <s.TextDescription
                                        style={{textAlign: "center", color: "var(--accent-text)"}}
                                    >
                                        You can still find {CONFIG.NFT_NAME} on
                                    </s.TextDescription>
                                    <s.SpacerSmall/>
                                    <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                                        {CONFIG.MARKETPLACE}
                                    </StyledLink>
                                </>
                            ) : (
                                <>
                                    <p style={{margin: '20px 0', fontSize: 20}}>{CONFIG.DISPLAY_COST} <span
                                        style={{color: '#61D6C8'}}>Ξ</span> Spaced Ape</p>
                                    <p>excluding gas fees</p>
                                    <div style={{width: '100%', display: 'flex'}}>
                                        <div style={{display: 'flex', margin: '20px auto'}}>
                                            <div className={'minus-controller'} onClick={decrementMintAmount}><p>-</p></div>
                                            <div className={'coin-num'}><p>{mintAmount}</p></div>
                                            <div className={'plus-controller'} onClick={incrementMintAmount}><p>+</p></div>
                                            <button className={'mint-btn'}>MINT</button>
                                        </div>
                                    </div>
                                    <p style={{fontSize: 17, fontWeight: 700}}>Total
                                        | {CONFIG.DISPLAY_COST * mintAmount} ETH</p>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-xs-12"
                         style={{padding: 10, height: 500}}>
                        <div id="w-node-_7091a729-31c6-d62d-5b76-ecf964dc09cd-eecfd6cf"
                             data-w-id="7091a729-31c6-d62d-5b76-ecf964dc09cd"
                             className="cube-animation-section wf-section">
                            <div className="demo-container">
                                <div className="demo-wrapper">
                                    <div className="_3d-wrapper">
                                        <div data-w-id="7091a729-31c6-d62d-5b76-ecf964dc09d9"
                                             className="cube-wrapper">
                                            <div className="cube-front"></div>
                                            <div className="cube-right"></div>
                                            <div className="cube-left"></div>
                                            <div className="cube-bottom"></div>
                                            <div className="cube-top"></div>
                                            <div className="cube-back"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{display: 'flex'}}>
                <div style={{zIndex: 5, margin: '0 auto', width: '65%'}}>
                    <p style={{zIndex: 5, color: 'white', textAlign: 'center', marginBottom: 20}}>Please make sure you are connected to the right network (
                        {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Please note:
                        Once you make the purchase, you cannot undo this action.</p>
                    <p style={{zIndex: 5, color: 'white', textAlign: 'center'}}>We have set the gas limit to {CONFIG.GAS_LIMIT} for the
                        contract to
                        successfully mint your NFT. We recommend that you don't lower the
                        gas limit.</p>
                </div>
            </div>

        </div>
    );
}

export default App;


{/*                <s.Container jc={"center"} ai={"center"} style={{width: "70%"}}>
                    <s.TextDescription
                        style={{
                            textAlign: "center",
                            color: "var(--primary-text)",
                        }}
                    >
                        Please make sure you are connected to the right network (
                        {CONFIG.NETWORK.NAME} Mainnet) and the correct address. Please note:
                        Once you make the purchase, you cannot undo this action.
                    </s.TextDescription>
                    <s.SpacerSmall/>
                    <s.TextDescription
                        style={{
                            textAlign: "center",
                            color: "var(--primary-text)",
                        }}
                    >
                        We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract to
                        successfully mint your NFT. We recommend that you don't lower the
                        gas limit.
                    </s.TextDescription>
                    <s.SpacerSmall/>
                </s.Container>*/
}