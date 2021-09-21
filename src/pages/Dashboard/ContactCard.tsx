/** @jsxImportSource @emotion/react */

import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import styled from "@emotion/styled";
import { TwitterTimelineEmbed } from "react-twitter-embed";

const Wrapper = styled.div`
  border-radius: 24px;
  background: ${({ theme }) => theme.white.normal};
  filter: drop-shadow(0px 4px 20px rgba(0, 108, 253, 0.04));
  padding: 0 24px;
  display: flex;
  flex-direction: column;
  div:last-child {
    height: 100%;
  }
`;

const Title = styled.div`
  height: 75px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.gray.normal08};
  font-size: 24px;
  line-height: 31px;
  color: ${({ theme }) => theme.gray.normal85};
  font-weight: 500;
`;

type TProps = WrappedComponentProps;

const ContactCard = memo<TProps>(({ intl }) => {
  return (
    <Wrapper>
      <Title>{intl.formatMessage({ defaultMessage: "Announcements" })}</Title>
      <TwitterTimelineEmbed
        sourceType="profile"
        screenName="Waterfalldefi"
        theme="light"
        noHeader
        noFooter
        options={{ height: "100%" }}
      />
    </Wrapper>
  );
});

export default injectIntl(ContactCard);
