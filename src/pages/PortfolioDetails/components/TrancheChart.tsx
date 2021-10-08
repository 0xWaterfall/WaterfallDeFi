/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { InitialRenderTransition } from "components/Transitions";
import React, { CSSProperties, memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { TransitionStatus } from "react-transition-group";
import { Tranche } from "types";
import { getPercentage } from "utils/formatNumbers";

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const WrappetTitle = styled.title`
  height: 62px;
  padding: 0 32px;
  border-bottom: 1px solid ${({ theme }) => theme.useColorModeValue("rgba(51, 51, 51, 0.08)", theme.white.normal08)};
  font-weight: 700;
  display: flex;
  align-items: center;
`;

const WrappetContainer = styled.title`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

const transitionStyles: Partial<{ [key in TransitionStatus]: CSSProperties }> = {
  entering: { height: 0 },
  entered: { height: 150 },
  exiting: { height: 0 },
  exited: { height: 0 }
};

type TProps = WrappedComponentProps & {
  tranches: Tranche[];
  totalTranchesTarget: string;
};

const TrancheChart = memo<TProps>(({ intl, tranches, totalTranchesTarget }) => {
  const { white } = useTheme();
  const COLORS: { [key: string]: string } = { Senior: "#FCB500", Mezzanine: "#00A14A", Junior: "#0066FF" };
  const payload = [
    {
      key: "Senior",
      name: intl.formatMessage({ defaultMessage: "Senior" }),
      value: getPercentage(tranches[0]?.target, totalTranchesTarget)
    },
    {
      key: "Mezzanine",
      name: intl.formatMessage({ defaultMessage: "Mezzanine" }),
      value: getPercentage(tranches[1]?.target, totalTranchesTarget)
    },
    {
      key: "Junior",
      name: intl.formatMessage({ defaultMessage: "Junior" }),
      value: getPercentage(tranches[2]?.target, totalTranchesTarget)
    }
  ];

  return (
    <Wrapper>
      <WrappetTitle>{intl.formatMessage({ defaultMessage: "Tranche Structure" })}</WrappetTitle>

      <WrappetContainer>
        <InitialRenderTransition>
          {(state) => {
            return (
              <div
                css={{
                  width: 150,
                  paddingRight: 34,
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
                      color: white.normal,
                      height: `${p.value}%`,
                      marginBottom: 3
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
            height: 150
          }}
        >
          {payload.map((p) => (
            <div key={p.key} css={{ display: "flex", alignItems: "center" }}>
              <div css={{ width: 8, height: 8, borderRadius: 2, backgroundColor: COLORS[p.key] }} />
              <div css={{ marginLeft: 4 }}>{p.name}</div>
            </div>
          ))}
        </div>
      </WrappetContainer>
    </Wrapper>
  );
});

export default injectIntl(TrancheChart);
