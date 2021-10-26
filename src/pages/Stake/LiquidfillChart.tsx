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
import styled from "@emotion/styled";
import "echarts-liquidfill";

// echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  transform: translate(-200px, -150px);
`;

type TProps = WrappedComponentProps;

let chart: echarts.ECharts;

const LiquidfillChart = memo<TProps>(({ intl }) => {
  const { white, gray, dark, colorMode } = useTheme();

  const options = useMemo(() => {
    return {
      series: [
        {
          type: "liquidFill",
          data: [0.3],
          outline: {
            show: false
          },
          backgroundStyle: {
            borderColor: [
              [
                1,
                new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  {
                    offset: 0.06,
                    color: "#C5DAFA"
                  },
                  {
                    offset: 0.97,
                    color: "#005FED"
                  }
                ])
              ]
            ],
            borderWidth: 1
          },
          axisLine: {
            lineStyle: {
              width: 4,
              color: [
                [
                  1,
                  new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                    {
                      offset: 0.06,
                      color: "#C5DAFA"
                    },
                    {
                      offset: 0.97,
                      color: "#005FED"
                    }
                  ])
                ]
              ]
            }
          }
        }
      ]
    };
  }, []);

  useEffect(() => {
    const canvas = document.getElementById("liquidfill-Chart");
    if (canvas) {
      chart = echarts.init(canvas as HTMLCanvasElement);
      chart.setOption(options, true);
    }
  }, [options]);
  return (
    <Wrapper>
      <div id="liquidfill-Chart" style={{ height: 800, width: 800 }} />
    </Wrapper>
  );
});

export default injectIntl(LiquidfillChart);
