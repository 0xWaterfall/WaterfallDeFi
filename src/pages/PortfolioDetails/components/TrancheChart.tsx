/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import { InitialRenderTransition } from "components/Transitions";
import React, { CSSProperties, memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { TransitionStatus } from "react-transition-group";

const transitionStyles: Partial<{ [key in TransitionStatus]: CSSProperties }> = {
  entering: { height: 0 },
  entered: { height: 200 },
  exiting: { height: 0 },
  exited: { height: 0 }
};

type TProps = WrappedComponentProps;

const TrancheChart = memo<TProps>(({ intl }) => {
  const { white } = useTheme();
  const COLORS: { [key: string]: string } = { Senior: "#FCB500", Mezzanine: "#00A14A", Junior: "#0066FF" };
  const payload = [
    { key: "Senior", name: intl.formatMessage({ defaultMessage: "Senior" }), value: 60 },
    { key: "Mezzanine", name: intl.formatMessage({ defaultMessage: "Mezzanine" }), value: 30 },
    { key: "Junior", name: intl.formatMessage({ defaultMessage: "Junior" }), value: 10 }
  ];

  return (
    <React.Fragment>
      <div>{intl.formatMessage({ defaultMessage: "Tranche" })}</div>

      <InitialRenderTransition>
        {(state) => {
          return (
            <div
              css={{
                width: 200,
                padding: 34,
                paddingTop: 0,
                display: "grid",
                gridTemplateRows: "60% 30% 10%",
                gridRowGap: 3,
                transition: `height ${800}ms ease-in-out`,
                ...transitionStyles[state]
              }}
            >
              {payload.map((p) => (
                <div
                  key={p.key}
                  css={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: COLORS[p.key],
                    fontSize: 12,
                    color: white.normal
                  }}
                >
                  {p.value}%
                </div>
              ))}
            </div>
          );
        }}
      </InitialRenderTransition>
      <div
        css={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          height: 200,
          paddingBottom: 34
        }}
      >
        {payload.map((p) => (
          <div key={p.key} css={{ display: "flex", alignItems: "center" }}>
            <div css={{ width: 8, height: 8, borderRadius: 2, backgroundColor: COLORS[p.key] }} />
            <div css={{ marginLeft: 4 }}>{p.name}</div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
});

export default injectIntl(TrancheChart);
