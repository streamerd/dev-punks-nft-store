import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 42px;
  border: none;
  background-color: var(--buttons-primary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 142px;
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
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 24px;
  color: #black;
  width: 42px;
  height: 42px;
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
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const MetamaskConnectButton = styled.button`
  padding: 12px;
  border-radius: 20%;
  border: none;
  background-color: var(--metamask-button-bg);
  font-weight: bold;
  font-size: 24px;
  color: #white;
  width: 180px;
  height: 62px;
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

export const OpenseaButton = styled.button`
  padding: 10px;
  border-radius: 60%;
  border: none;
  background-color: var(--opensea-bagel);
  padding: 10px;
  font-weight: bold;
  font-size: 24px;
  width: 106px;
  height: 106px;
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

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 300px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledBDULogo = styled.img`
  width: 100px;
  @media (min-width: 767px) {
    width: 100px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledGithubLogo = styled.img`
  width: 60px;
  @media (min-width: 767px) {
    width: 60px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledDiscordLogo = styled.img`
  width: 180px;
  @media (min-width: 767px) {
    width: 180px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledMetamaskLogo = styled.img`
  width: 46px;
  @media (min-width: 767px) {
    width: 46px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledHashiLipsLogo = styled.img`
  width: 140px;
  @media (min-width: 767px) {
    width: 140px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledOpenseaLogo = styled.img`
  width: 92px;
  @media (min-width: 767px) {
    width: 92px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px dashed var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
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
  const blockchain = useSelector((state) => state.blockchain);
  const data = useSelector((state) => state.data);
  const [claimingNft, setClaimingNft] = useState(false);
  const [feedback, setFeedback] = useState(`Click buy to mint your NFT.`);
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

  const claimNFTs = () => {
    let cost = CONFIG.WEI_COST;
    let gasLimit = CONFIG.GAS_LIMIT;
    let totalCostWei = String(cost * mintAmount);
    let totalGasLimit = String(gasLimit * mintAmount);
    console.log("Cost: ", totalCostWei);
    console.log("Gas limit: ", totalGasLimit);
    setFeedback(`Minting your ${CONFIG.NFT_NAME}...`);
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
          `WOW, the ${CONFIG.NFT_NAME} is yours! go visit Opensea.io to view it.`
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
    if (newMintAmount > 50) {
      newMintAmount = 50;
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
    <s.Screen>
      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
      >
        <a href={"#"}>
          <StyledLogo
            alt={"logo"}
            src={"/config/images/devpunks-textual.png"}
          />
        </a>
      </s.Container>

      <s.Container
        flex={1}
        ai={"center"}
        style={{ padding: 24, backgroundColor: "var(--primary)" }}
        image={CONFIG.SHOW_BACKGROUND ? "/config/images/bg.png" : null}
      >
        <StyledLogo alt={"logo"} src={"/config/images/logo.gif"} />
        <s.SpacerLarge />

        <s.SpacerSmall />
        <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg alt={"example"} src={"/config/images/example2.gif"} />
          </s.Container>
          <s.SpacerLarge />
          <s.Container
            flex={2}
            jc={"center"}
            ai={"center"}
            style={{
              backgroundColor: "var(--accent)",
              padding: 24,
              borderRadius: 24,
              border: "4px dashed var(--secondary)",
              boxShadow: "0px 5px 11px 2px rgba(0,0,0,0.7)",
            }}
          >
            <s.TextTitle
              style={{
                textAlign: "center",
                fontSize: 50,
                fontWeight: "bold",
                color: "var(--accent-text)",
              }}
            >
              {data.totalSupply} / {CONFIG.MAX_SUPPLY}
            </s.TextTitle>
            <s.TextDescription
              style={{
                fontSize: "42px",
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              <StyledLink target={"_blank"} href={CONFIG.SCAN_LINK}>
                {truncate(CONFIG.CONTRACT_ADDRESS, 15)}
              </StyledLink>
            </s.TextDescription>
            <span
              style={{
                textAlign: "center",
              }}
            >
              <OpenseaButton
                style={{
                  margin: "5px",
                }}
                onClick={(e) => {
                  window.open(CONFIG.MARKETPLACE_LINK, "_blank");
                }}
              >
                <StyledOpenseaLogo
                  alt={"logo"}
                  src={"/config/images/opensea-logo.svg"}
                />
              </OpenseaButton>
            </span>
            <s.SpacerSmall />
            {Number(data.totalSupply) >= CONFIG.MAX_SUPPLY ? (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  The sale has ended.
                </s.TextTitle>
                <s.TextDescription
                  style={{
                    textAlign: "center",
                    color: "var(--accent-text)",
                    fontSize: "42px",
                  }}
                >
                  You can still find {CONFIG.NFT_NAME} on
                </s.TextDescription>
                <s.SpacerSmall />
                <StyledLink target={"_blank"} href={CONFIG.MARKETPLACE_LINK}>
                  {CONFIG.MARKETPLACE}
                </StyledLink>
              </>
            ) : (
              <>
                <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  1 {CONFIG.SYMBOL.toLowerCase()} costs {CONFIG.DISPLAY_COST}{" "}
                  {CONFIG.NETWORK.SYMBOL}.
                </s.TextTitle>
                <s.SpacerXSmall />
                <s.TextDescription
                  style={{
                    textAlign: "center",
                    color: "var(--accent-text)",
                    fontSize: "22px",
                  }}
                >
                  ( excluding gas fees )
                </s.TextDescription>
                <s.SpacerSmall />
                {blockchain.account === "" ||
                blockchain.smartContract === null ? (
                  <s.Container ai={"center"} jc={"center"}>
                    <s.SpacerSmall />
                    <MetamaskConnectButton
                      onClick={(e) => {
                        e.preventDefault();
                        dispatch(connect());
                        getData();
                      }}
                    >
                      connect
                      <StyledMetamaskLogo
                        alt={"metamask connect logo"}
                        src={"/config/images/metamask-custom-fox.svg"}
                      />
                    </MetamaskConnectButton>
                    <s.SpacerLarge />
                    <s.SpacerLarge />

                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        fontSize: "24px",
                        color: "var(--accent-text)",
                      }}
                    >
                      this DApp is currently running @
                      <a
                        style={{ color: "var(--accent-text)" }}
                        href={"https://www.rinkeby.io/#stats"}
                        target={"_blank"}
                      >
                        {CONFIG.NETWORK.NAME}
                      </a>
                    </s.TextDescription>
                    <s.SpacerMedium />

                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        fontSize: "24px",
                        color: "var(--accent-text)",
                      }}
                    >
                      <a
                        style={{ color: "var(--accent-text)" }}
                        href={"https://medium.com/compound-finance/the-beginners-guide-to-using-an-ethereum-test-network-95bbbc85fc1d"}
                        target={"_blank"}
                      >
                        here
                      </a>
                      , a guide on how to connect metamask to testnets
                      <s.SpacerSmall />
                      <a
                        style={{ color: "var(--accent-text)" }}
                        href={"https://www.rinkeby.io/#faucet"}
                        target={"_blank"}
                      >
                        and here
                      </a>
                      , is Rinkeby faucet, where we get ethereum for dev purposes.
                    </s.TextDescription>

                    {blockchain.errorMsg !== "" ? (
                      <>
                        <s.SpacerSmall />

                        <s.TextDescription
                          style={{
                            textAlign: "center",
                            color: "var(--accent-text)",
                          }}
                        >
                          {blockchain.errorMsg}
                        </s.TextDescription>
                      </>
                    ) : null}
                  </s.Container>
                ) : (
                  <>
                    <s.TextDescription
                      style={{
                        textAlign: "center",
                        color: "var(--accent-text)",
                      }}
                    >
                      {feedback}
                    </s.TextDescription>
                    <s.SpacerMedium />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledRoundButton
                        style={{ lineHeight: 0.4 }}
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          decrementMintAmount();
                        }}
                      >
                        -
                      </StyledRoundButton>
                      <s.SpacerMedium />
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {mintAmount}
                      </s.TextDescription>
                      <s.SpacerMedium />
                      <StyledRoundButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          incrementMintAmount();
                        }}
                      >
                        +
                      </StyledRoundButton>
                    </s.Container>
                    <s.SpacerSmall />
                    <s.Container ai={"center"} jc={"center"} fd={"row"}>
                      <StyledButton
                        disabled={claimingNft ? 1 : 0}
                        onClick={(e) => {
                          e.preventDefault();
                          claimNFTs();
                          getData();
                        }}
                      >
                        {claimingNft ? "BUSY" : "MINT & GET"}
                      </StyledButton>
                    </s.Container>
                  </>
                )}
              </>
            )}
            <s.SpacerMedium />
          </s.Container>
          <s.SpacerLarge />
          <s.Container flex={1} jc={"center"} ai={"center"}>
            <StyledImg
              alt={"example"}
              src={"/config/images/example3.gif"}
              style={{ transform: "scaleX(-1)" }}
            />
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerMedium />
        <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
              fontSize: "22px",
            }}
          >
            Once you make the purchase, you cannot undo this action.
          </s.TextDescription>
          <s.SpacerLarge />
          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
              fontSize: "22px",
            }}
          >
            Please make sure you are connected to
          </s.TextDescription>
          <s.SpacerSmall />

          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
              fontSize: "22px",
            }}
          >
            the right network ({CONFIG.NETWORK.NAME}).
          </s.TextDescription>
          <s.SpacerSmall />

          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
              fontSize: "22px",
            }}
          >
            We have set the gas limit to {CONFIG.GAS_LIMIT} for the contract
          </s.TextDescription>

          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
              fontSize: "22px",
            }}
          >
            to successfully mint your NFT. <br></br>
            We recommend that you don't lower the gas limit.
          </s.TextDescription>
          <s.SpacerSmall />

          <s.SpacerLarge />

          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            by collaboration @
          </s.TextDescription>
          <s.SpacerLarge />

          <a href={"https://discord.gg/Q2wWPVcQ6k"}>
            <StyledBDULogo
              alt={"logo"}
              src={"/config/images/bdu-logo.png"}
              target={"_blank"}
            />
          </a>
          <s.SpacerLarge />

          <a href={"https://discord.gg/Q2wWPVcQ6k"}>
            <StyledDiscordLogo
              alt={"logo"}
              src={"/config/images/discord-logo.svg"}
            />
          </a>
          <s.SpacerLarge />

          <a
            href={"https://github.com/BlockDevsUnited/dev-punks"}
            target={"_blank"}
          >
            <StyledGithubLogo
              alt={"logo"}
              src={"/config/images/github-logo.png"}
            />
          </a>

          <s.SpacerSmall />

          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            made with
          </s.TextDescription>
          <a
            href={"https://github.com/HashLips/hashlips_art_engine"}
            target={"_blank"}
            color="white"
          >
            <StyledHashiLipsLogo
              alt={"logo"}
              src={"/config/images/hashLips.png"}
            />
          </a>
          <s.SpacerLarge />

          <s.TextDescription
            style={{
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            hosted on
          </s.TextDescription>
          <a
            href={
              "https://ipfs.fleek.co/ipfs/QmQKEXmXHsXi7RZdte3b3zdV8ejfKJyxUfXqGrtN7P2wZg/"
            }
            target={"_blank"}
          >
            <StyledGithubLogo
              alt={"logo"}
              src={"/config/images/ipfs-logo-vector.svg"}
            />
          </a>
          <s.SpacerMedium />

          <a href={"#"}>
            <StyledLogo
              alt={"logo"}
              src={"/config/images/devpunks-textual.png"}
            />
          </a>

          <s.SpacerSmall />
          <s.TextDescription
            style={{
              fontSize: "26px",
              textAlign: "center",
              color: "var(--primary-text)",
            }}
          >
            
            2021 {">>"} ??????
          </s.TextDescription>
        </s.Container>
      </s.Container>
    </s.Screen>
  );
}

export default App;
