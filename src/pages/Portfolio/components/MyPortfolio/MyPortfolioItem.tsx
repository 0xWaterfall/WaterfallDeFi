/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import React, { memo, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { CaretDown } from "assets/images";
import Tag from "components/Tag/Tag";
import Tooltip from "components/Tooltip/Tooltip";
import { Union } from "assets/images";
import theme from "styles/theme";
import Fold from "./Fold";

type TProps = WrappedComponentProps;

const Container = styled.div`
  background: ${({ theme }) => theme.white.normal};
  border: 1px solid ${({ theme }) => theme.primary.lightBrown};
  box-sizing: border-box;
  box-shadow: 0px 0px 10px ${({ theme }) => theme.shadow.marketItem};
  border-radius: 12px;
  padding: 20px 0px 40px 0px;
  margin-bottom: 20px;
`;
const RowDiv = styled.div`
  padding: 5px 20px;
  font-size: 12px;
  line-height: 16px;
  color: ${({ theme }) => theme.gray.normal7};
  display: flex;
  margin-bottom: 10px;
  justify-content: space-between;
  & > div:nth-of-type(2) {
    font-size: 14px;
    line-height: 19px;
    text-align: right;
    color: ${({ theme }) => theme.gray.normal85};
  }
  & > div > svg {
    // margin-left: 10 px;
    // width: 13px;
    // height: 13px;
  }
`;
const CaretDiv = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 2px solid ${({ theme }) => theme.primary.deep2}
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;
const MyPortfolioItem = memo<TProps>(({ intl }) => {
  const [isFold, setFold] = useState(true);
  return (
    <Container>
      <RowDiv>
        <div>{intl.formatMessage({ defaultMessage: "Portfolio Name" })}</div>
        <div>Cake Vaults 1</div>
      </RowDiv>
      <RowDiv>
        <div>{intl.formatMessage({ defaultMessage: "Asset" })}</div>
        <div>BUSD</div>
      </RowDiv>
      <RowDiv>
        <div>{intl.formatMessage({ defaultMessage: "Cycle" })}</div>
        <div>2021/07/01→2021/07/08</div>
      </RowDiv>
      <RowDiv>
        <div css={{ display: "flex" }}>
          {intl.formatMessage({ defaultMessage: "Deposit APY" })}
          <Tooltip
            css={{ marginLeft: 10, lineHeight: 30 }}
            overlay={
              <React.Fragment>
                <p></p>
              </React.Fragment>
            }
          >
            <Union />
          </Tooltip>
        </div>
        <div>Senior: 3%</div>
      </RowDiv>
      <RowDiv>
        <div>{intl.formatMessage({ defaultMessage: "Principal" })}</div>
        <div css={{ display: "flex", flexDirection: "column" }}>
          <span>1,000,000 BUSD</span>
          <span css={{ color: theme.primary.deep }}>Maturity: 2D 12:56:56</span>
        </div>
      </RowDiv>
      <RowDiv>
        <div>{intl.formatMessage({ defaultMessage: "Status" })}</div>
        <div>
          <Tag color="green" value="Active" />
        </div>
      </RowDiv>
      <RowDiv>
        <div>{intl.formatMessage({ defaultMessage: "Interest" })}</div>
        <div>110 BUSD</div>
      </RowDiv>
      <RowDiv>
        <div>{intl.formatMessage({ defaultMessage: "Moer" })}</div>
        <CaretDiv
          onClick={() => {
            setFold((isFold) => !isFold);
          }}
        >
          <CaretDown
            css={{
              transition: "transform 0.3s",
              transform: "rotate(0)",
              ...(isFold ? { transform: "rotate(180deg)" } : {})
            }}
          />
        </CaretDiv>
      </RowDiv>
      {!isFold && <Fold />}
    </Container>
  );
});

export default injectIntl(MyPortfolioItem);
