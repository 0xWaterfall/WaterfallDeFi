/** @jsxImportSource @emotion/react */

import { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
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
  // display: flex;
  // width: 100%;
  display: grid;
  gap: 20px;
  grid-auto-flow: column;
  grid-template-columns: 1fr 1fr;
  position: relative;
  // justify-content: space-between;
  // & > div {
  //   width: 49%;
  // }
  @media screen and (max-width: 768px) {
    // flex-direction: column;
    grid-auto-flow: row;
    gap: 80px;
    grid-template-columns: auto;
    grid-template-rows: 1fr 1fr;
  }
`;

type TProps = WrappedComponentProps;

const Dashboard = memo<TProps>(() => {
  return (
    <>
      {/* <div style={{ position: "fixed", top: 10, left: "50%", zIndex: 9999 }}>
        {account && (
          <Button type="default" onClick={() => handleConfirmClick(account)}>
            stop cycle
          </Button>
        )}
      </div> */}

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
