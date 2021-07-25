/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import { useSize } from "ahooks";
import { Discord, Medium, Telegram, Twitter, Unicorn, Wave } from "assets/images";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";

type TProps = WrappedComponentProps;

const Footer = memo<TProps>(({ intl }) => {
  const { primary, gray } = useTheme();
  const { width } = useSize(document.body);

  const CONTACTS = [
    { Icon: Discord, link: "discord" },
    { Icon: Telegram, link: "Telegram" },
    { Icon: Medium, link: "Medium" },
    { Icon: Twitter, link: "Twitter" }
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
              <a key={link} css={{ marginRight: 20 }}>
                <Icon />
              </a>
            ))}
          </div>
        </div>

        {Boolean(width && width > 1024) && <Unicorn css={{ position: "absolute", bottom: 0, right: 0 }} />}
      </div>
    </div>
  );
});

export default injectIntl(Footer);
