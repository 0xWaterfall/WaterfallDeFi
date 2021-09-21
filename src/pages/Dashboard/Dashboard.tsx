/** @jsxImportSource @emotion/react */

import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useWeb3React } from "@web3-react/core";
import { abi as TrancheMasterAbi } from "config/abi/TrancheMaster.json";
import { TranchesAddress } from "config/address";
import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { Web3Provider } from "@ethersproject/providers";
import Button from "components/Button/Button";
import styled from "@emotion/styled";
import DashboardCard from "./DashboardCard";
import LockedCard from "./LockedCard";
import ContactCard from "./ContactCard";
import TrancheCard from "./TrancheCard";

const Wrapper = styled.div`
  max-width: 1048px;
  padding: 180px 15px 144px;
  margin: 0 auto;
  @media screen and (max-width: 876px) {
    padding-top: 100px;
  }
`;

const InfoWrapper = styled.div`
  display: grid;
  gap: 20px;
  grid-auto-flow: column;
  grid-template-columns: 1fr 1fr;
  position: relative;
  @media screen and (max-width: 768px) {
    grid-auto-flow: row;
    gap: 80px;
    grid-template-columns: auto;
    grid-template-rows: 1fr 1fr;
  }
`;

type TProps = WrappedComponentProps;

const Dashboard = memo<TProps>(() => {
  const { account } = useWeb3React<Web3Provider>();

  const handleConfirmClick = async (account: string) => {
    try {
      const web3 = new Web3(Web3.givenProvider);
      const contractTrancheMaster = new web3.eth.Contract(TrancheMasterAbi as AbiItem[], TranchesAddress);
      const stop = await contractTrancheMaster.methods.stop().send({ from: account });
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <>
      <div style={{ position: "fixed", top: 10, left: "50%", zIndex: 9999 }}>
        {account && (
          <Button type="default" onClick={() => handleConfirmClick(account)}>
            stop cycle
          </Button>
        )}
      </div>
      <Wrapper>
        <DashboardCard />
        <LockedCard />
        <InfoWrapper>
          <ContactCard />
          <TrancheCard />
        </InfoWrapper>
      </Wrapper>
    </>
  );
});

export default injectIntl(Dashboard);
