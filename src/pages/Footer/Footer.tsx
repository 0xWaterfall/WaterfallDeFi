/** @jsxImportSource @emotion/react */

import { Discord, Medium, Telegram, Twitter, LogoFooter, FooterLine } from "assets/images";
import { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import styled from "@emotion/styled";
import { useTheme } from "@emotion/react";

type TProps = WrappedComponentProps;
const FooterWrapper = styled.footer`
  background-color: ${({ theme }) => theme.footer.background};
  height: 500px;
`;

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin: auto;
  height: 100%;
  padding: 82px 24px 75px;
  max-width: 1248px;
  position: relative;
`;

const ConnectDiv = styled.div`
  font-size: 14px;
  line-height: 19px;
  color: ${({ theme }) => theme.white.normal};
  display: grid;
  grid-template-columns: 240px 240px;
  grid-column-gap: 32px;
  opacity: 0.8;
  @media screen and (max-width: 678px) {
    grid-template-columns: 240px;
  }
`;

const ConnectDivSub = styled.div`
  padding-top: 32px;
  border-top: 2px solid ${({ theme }) => theme.white.normal1};
  opacity: 0.8;
`;

const CopyrightDiv = styled.div`
  font-size: 16px;
  line-height: 25px;
  color: ${({ theme }) => theme.white.normal};
  display: flex;
`;

const Footer = memo<TProps>(({ intl }) => {
  const CONTACTS = [
    { Icon: Discord, link: "https://discord.gg/gS9Gda4sez" },
    { Icon: Telegram, link: "https://t.me/joinchat/BYZHfIJv0eRjY2I0" },
    { Icon: Medium, link: "https://medium.com/@WaterfallDefi" },
    { Icon: Twitter, link: "https://twitter.com/waterfalldefi" }
  ];
  const { white } = useTheme();
  return (
    <FooterWrapper>
      <ContentWrapper>
        <LogoFooter />
        <ConnectDiv>
          <ConnectDivSub>{intl.formatMessage({ defaultMessage: "Connect" })}</ConnectDivSub>
          <ConnectDivSub css={{ "@media screen and (max-width: 678px)": { borderTop: 0 } }}>
            {CONTACTS.map(({ Icon, link }) => (
              <a key={link} href={link} css={{ marginRight: 20, color: white.normal }}>
                <Icon />
              </a>
            ))}
          </ConnectDivSub>
        </ConnectDiv>
        <CopyrightDiv>
          {intl.formatMessage(
            { defaultMessage: "Copyright {currentYear} - {nextYear} - All Rights Reserved" },
            {
              currentYear: new Date().getFullYear(),
              nextYear: new Date().getFullYear() + 1
            }
          )}
        </CopyrightDiv>
        <FooterLine
          css={{
            position: "absolute",
            right: 24,
            bottom: 100,
            "@media screen and (max-width: 1024px)": { display: "none" }
          }}
        />
      </ContentWrapper>
    </FooterWrapper>
  );
});

export default injectIntl(Footer);
