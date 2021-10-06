/** @jsxImportSource @emotion/react */

import React from "react";
import styled from "@emotion/styled";
import { NoData as NoDataIcon } from "assets/images";
import { injectIntl, WrappedComponentProps } from "react-intl";

const Wrapper = styled.div``;

const NoDataWrapper = styled.div`
  padding: 160px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const NoDataText = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal5, theme.white.normal7)};
  margin-top: 12px;
`;

type TProps = Partial<typeof Wrapper> &
  WrappedComponentProps & {
    isNoData?: boolean;
  };

const NoData: React.FC<TProps> = ({ children, isNoData, intl, ...props }) => {
  return (
    <Wrapper {...props}>
      {isNoData && (
        <NoDataWrapper>
          <NoDataIcon />
          <NoDataText>{intl.formatMessage({ defaultMessage: "No Data" })}</NoDataText>
        </NoDataWrapper>
      )}
      {children}
    </Wrapper>
  );
};
export default injectIntl(NoData);
