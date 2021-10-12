/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import React, { FC, useCallback } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import Button from "components/Button/Button";
import { useAppDispatch } from "store";
import { setCookieModal } from "store/selectedKeys";

const Wrapper = styled.div`
  width: 100%;
  padding: 20px;
  position: fixed;
  bottom: 0;
  z-index: 1000;
  background: ${({ theme }) => theme.useColorModeValue(theme.white.normal, theme.dark.header)};
  filter: drop-shadow(0px 4px 20px rgba(0, 108, 253, 0.04));
`;

const Body = styled.div`
  max-width: 1048px;
  padding: 24px 12px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`;

const Text = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
`;

const Btns = styled.div`
  width: fit-content;
  display: grid;
  gap: 20px;
  grid-auto-flow: column;
  margin-top: 50px;
  align-self: end;
  button {
    font-size: 14px;
    height: 36px;
    padding: 0 18px;
  }
`;

const Cookie: FC<WrappedComponentProps> = ({ intl }) => {
  const dispatch = useAppDispatch();
  const handle = useCallback(() => {
    dispatch(setCookieModal(false));
  }, []);
  return (
    <Wrapper>
      <Body>
        <Text>
          {intl.formatMessage({
            defaultMessage:
              "Waterfall uses cookies to improve your experience. To find out more about the cookies we use, see our Privacy Policy."
          })}
        </Text>

        <Btns>
          <Button type="primary" onClick={handle}>
            {intl.formatMessage({ defaultMessage: "Accept" })}
          </Button>
          <Button type="default" onClick={handle}>
            {intl.formatMessage({ defaultMessage: "Decline" })}
          </Button>
        </Btns>
      </Body>
    </Wrapper>
  );
};

export default injectIntl(Cookie);
