/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import { useSize } from "ahooks";
import { Discord, Medium, Telegram, Twitter, Unicorn, Wave } from "assets/images";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";

type TProps = WrappedComponentProps;

const Footer = memo<TProps>(({ intl }) => {
  const { gray } = useTheme();
  const { width } = useSize(document.body);

  const CONTACTS = [
    { Icon: Discord, link: "https://discord.gg/gS9Gda4sez" },
    { Icon: Telegram, link: "https://t.me/joinchat/BYZHfIJv0eRjY2I0" },
    { Icon: Medium, link: "https://medium.com/@WaterfallDefi" },
    { Icon: Twitter, link: "https://twitter.com/waterfalldefi" }
  ];
  return (
    <div
      css={{
        position: "relative",
        height: 0.13 * (width ?? 0),
        "@media screen and (max-width: 1024px)": {
          height: "auto"
        }
      }}
    >
      <div
        css={{
          width: "100%",
          display: "flex",
          height: 0.17 * (width ?? 0),
          backgroundImage: `url(${Wave})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100%",
          backgroundPosition: "center center",
          position: "absolute",
          bottom: 0,
          left: 0,
          alignItems: "flex-end",
          "@media screen and (max-width: 1024px)": {
            background: "none",
            height: "100%"
          }
        }}
      >
        <div
          css={{
            display: "flex",
            flex: 1,
            justifyContent: "space-between",
            padding: "0 24px 21px",
            maxWidth: 1248,
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
            alignItems: "center"
          }}
        >
          <div css={{ color: gray.normal7, fontSize: 16 }}>
            {intl.formatMessage({ defaultMessage: "Copyright 2021 - 2022 - All Rights Reserved" })}
          </div>
          <div css={{ display: "flex" }}>
            {CONTACTS.map(({ Icon, link }) => (
              <a key={link} href={link} css={{ marginRight: 20 }}>
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {Boolean(width && width > 1024) && (
          <Unicorn css={{ position: "fixed", top: "40vh", right: 0, width: 170, height: 220 }} />
        )}
      </div>
    </div>
  );
});

export default injectIntl(Footer);
