/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import { ArrowLeft } from "assets/images";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useHistory } from "react-router-dom";
import styled from "@emotion/styled";

const InformationWrapper = styled.div`
  display: flex;
  padding-top: 20px;
  & > div {
    padding: 0px 20px;
  }
  & span {
    font-size: 14px;
    line-height: 19px;
    color: ${({ theme }) => theme.gray.normal7};
  }
  @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    & > div {
      padding: 10px 0;
    }
  }
`;
const Arrow = styled(ArrowLeft)`
  color: ${({ theme }) => theme.gray.normal7};
  & :hover {
    color: ${({ theme }) => theme.primary.deep};
  }
  margin-top: 20px;
  margin-right: 20px;
  cursor: pointer;
`;
const Text1 = styled.div`
  font-size: 24px;
  line-height: 33px;
  height: 30px;
  color: ${({ theme }) => theme.gray.normal85};
`;
const Text2 = styled.div`
  font-size: 20px;
  line-height: 27px;
  height: 30px;
  color: ${({ theme }) => theme.gray.normal85};
`;
const TvlDiv = styled.div`
  font-size: 16px;
  line-height: 22px;
  color: ${({ theme }) => theme.primary.deep};
`;

type TProps = WrappedComponentProps;

const Information = memo<TProps>(() => {
  const { goBack } = useHistory();

  return (
    <InformationWrapper>
      <Arrow onClick={goBack} />
      <div>
        <Text1>BUSD Vault</Text1>
        <span>Listing date: 2021/07/30</span>
      </div>
      <div>
        <Text2>BUSD</Text2>
        <span>Lock-up period: 14 Days</span>
      </div>
      <div>
        <Text2></Text2>
        <TvlDiv>TVL: 1,000,000 USDC</TvlDiv>
      </div>
    </InformationWrapper>
  );
});

export default injectIntl(Information);
