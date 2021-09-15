/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import React, { memo, useEffect, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useMemo } from "react";
import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { PieChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { useStrategyFarm } from "hooks";
import BigNumber from "bignumber.js";
import { BIG_TEN } from "utils/bigNumber";
import styled from "@emotion/styled";

echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const WrappetTitle = styled.title`
  height: 62px;
  padding: 0 32px;
  border-bottom: 1px solid rgba(51, 51, 51, 0.08);
  font-weight: 700;
  display: flex;
  align-items: center;
`;

const WrappetContainer = styled.title`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

type TProps = WrappedComponentProps;

let chart: echarts.ECharts;

const PortfolioChart = memo<TProps>(({ intl }) => {
  const { white, gray } = useTheme();
  const result = useStrategyFarm();

  const payload: any[] = [];
  if (result && result.length > 0) {
    result.map((r: any) => {
      payload.push({ name: r?.farmName, value: r?.shares });
    });
  }

  const COLORS = ["#FFB0E3", "#4A63B9", "#85C872", "#F7C05F"];
  const options = useMemo(() => {
    const res = payload.map((p, i) => ({ value: p.value, name: p.name, itemStyle: { color: COLORS[i] } }));
    return {
      tooltip: {
        trigger: "item"
      },
      series: [
        {
          name: intl.formatMessage({ defaultMessage: "Portfolio" }),
          type: "pie",
          radius: ["40%", "70%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 2,
            borderColor: white.normal,
            borderWidth: 2
          },
          label: {
            show: false,
            position: "center"
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "12"
            }
          },
          labelLine: {
            show: false
          },
          data: res
        }
      ]
    };
  }, [payload]);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    const canvas = document.getElementById("portfolio-Chart");
    if (canvas) {
      chart = echarts.init(canvas as HTMLCanvasElement);
      chart.setOption(options, true);
      chart.on("mouseover", function (e) {
        setIndex(e.dataIndex);
      });
      chart.on("mouseout", function () {
        setIndex(-1);
      });
    }
  }, [options]);
  return (
    <Wrapper>
      <WrappetTitle>{intl.formatMessage({ defaultMessage: "Portfolio" })}</WrappetTitle>
      <WrappetContainer>
        <div id="portfolio-Chart" style={{ height: 200, width: 200 }} />
        <div>
          {payload.map((p, i) => (
            <div
              key={p.name}
              css={{
                display: "flex",
                alignItems: "center",
                padding: "8px 4px",
                borderRadius: 4,
                cursor: "pointer",
                ...(index === i ? { backgroundColor: gray.normal04 } : {}),
                ":hover": { backgroundColor: gray.normal04 }
              }}
              onMouseMove={() => {
                chart.dispatchAction({
                  type: "highlight",
                  name: p.name
                });
                chart.dispatchAction({
                  type: "showTip",
                  seriesIndex: 0,
                  dataIndex: i
                });
              }}
              onMouseOut={() => {
                chart.dispatchAction({
                  type: "downplay",
                  name: p.name
                });
                chart.dispatchAction({
                  type: "hideTip",
                  seriesIndex: 0,
                  dataIndex: i
                });
              }}
            >
              <div css={{ width: 8, height: 8, borderRadius: 2, backgroundColor: COLORS[i] }} />
              <div css={{ marginLeft: 4 }}>
                {p.name} -{p.value}%
              </div>
            </div>
          ))}
        </div>
      </WrappetContainer>
    </Wrapper>
  );
});

export default injectIntl(PortfolioChart);
