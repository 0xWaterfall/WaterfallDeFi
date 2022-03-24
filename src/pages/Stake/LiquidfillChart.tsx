/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import { memo, useEffect } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useMemo } from "react";
import * as echarts from "echarts/core";
import styled from "@emotion/styled";
import "echarts-liquidfill";
import { Union } from "assets/images";
import Tooltip from "components/Tooltip/Tooltip";

const Wrapper = styled.div`
  width: 100%;
  // height: 400px;
  // width: 800px;
  height: 500px;

  display: flex;
  flex-direction: column;
  // transform: translate(-200px, -150px);
  position: relative !important;
  @media screen and (max-width: 900px) {
    // transform: translate(0);
    width: 100%;
    height: 400px;
  }

  // @media screen and (max-width: 500px) {
  //   transform: translate(-40vw, -40vw);
  //   width: 160vw;
  //   height: 160vw;
  // }
`;

const Block = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  & > p {
    font-weight: 500;
    font-size: 36px;
    line-height: 47px;
    color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
  }
  & > div {
    font-size: 14px;
    line-height: 18px;
    color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
    display: flex;
    align-items: center;
  }
`;

type TProps = WrappedComponentProps & {
  share: string;
  pendingBUSDReward: string;
};

let chart: echarts.ECharts;

const LiquidfillChart = memo<TProps>(({ intl, share, pendingBUSDReward }) => {
  const { colorMode } = useTheme();

  const options = useMemo(() => {
    return {
      series: [
        {
          type: "liquidFill",
          data: [0.3],
          center: ["50%", "50%"],
          color: ["#88F8FF"],
          radius: "80%",
          itemStyle: {
            shadowBlur: 0
          },
          opacity: 1,
          backgroundStyle: {
            color: colorMode === "light" ? "#fff" : "#13132C"
          },
          outline: {
            borderDistance: 0,
            itemStyle: {
              color: colorMode === "light" ? "#fff" : "#13132C",
              borderWidth: 0,
              shadowBlur: 20,
              shadowColor: "rgba(0, 108, 253, 0.1)"
            }
          },
          label: {
            show: false
          },
          emphasis: {
            itemStyle: {
              opacity: 1
            }
          }
        }
      ]
    };
  }, [colorMode]);

  useEffect(() => {
    const canvas = document.getElementById("liquidfill-Chart");
    if (canvas) {
      chart = echarts.init(canvas as HTMLCanvasElement);
      chart.setOption(options, true);
    }
  }, [options]);
  return (
    <Wrapper>
      <div id="liquidfill-Chart" style={{ height: "100%", width: "100%" }} />
      <Block>
        <p css={{ marginBottom: 5 }}>{pendingBUSDReward ? pendingBUSDReward : "-"}</p>

        <div css={{ marginBottom: 20 }}>
          Est. Reward Pool（BUSD）
          <Tooltip
            overlay={intl.formatMessage({
              defaultMessage:
                "This will be an estimated value, and the actual reward pool will be based on the actual income after expiration."
            })}
          >
            <Union />
          </Tooltip>
        </div>
        {/* <p css={{ marginBottom: 5 }}>{share}%</p> */}
        {/* <div>{intl.formatMessage({ defaultMessage: "Your Share" })}</div> */}
      </Block>
    </Wrapper>
  );
});

export default injectIntl(LiquidfillChart);
