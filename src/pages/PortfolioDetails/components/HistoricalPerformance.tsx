/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import React, { memo, useEffect, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useMemo } from "react";
import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent, GridComponent, DataZoomSliderComponent } from "echarts/components";
import { LineChart, PieChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
// import { useStrategyFarm } from "hooks";
import styled from "@emotion/styled";
import { StrategyFarm } from "types";
import { Button } from "antd";

echarts.use([
  LineChart,
  TooltipComponent,
  LegendComponent,
  PieChart,
  CanvasRenderer,
  GridComponent,
  DataZoomSliderComponent
]);

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
`;

enum Timescale {
  Day = 0,
  Week = 1,
  TwoWeeks = 2
}

type TProps = WrappedComponentProps & {
  APYData: any[];
  strategy: string;
  strategyName: string;
};

let chart: echarts.ECharts;

const HistoricalPerformance = memo<TProps>(({ intl, APYData, strategy, strategyName }) => {
  const { white, gray, dark, colorMode } = useTheme();

  const [timescale, setTimescale] = useState<Timescale>(Timescale.Day);

  const last24Hours = APYData.slice(-24);
  const lastWeek = APYData.slice(-168);

  const xAxis24Hr = last24Hours.map((apy, i) =>
    Number(apy.timeStr.slice(11, 13)) > 12
      ? (Number(apy.timeStr.slice(11, 13)) - 12).toString() + "PM"
      : Number(apy.timeStr.slice(11, 13)).toString() + "AM"
  );
  const xAxis7D = lastWeek.map((apy, i) => apy.timeStr.slice(5, 10));
  const xAxis14D = APYData.map((apy, i) => apy.timeStr.slice(5, 10));

  const xAxes = [xAxis24Hr, xAxis7D, xAxis14D];

  const last24HoursData = last24Hours.map((apy, i) => Number(apy[strategy]) * 100);
  const lastWeekData = lastWeek.map((apy, i) => Number(apy[strategy]) * 100);
  const twoWeekData = APYData.map((apy, i) => Number(apy[strategy]) * 100);
  const allData = [last24HoursData, lastWeekData, twoWeekData]; //tuple, index keyed to enum

  const options = useMemo(() => {
    return {
      tooltip: {
        trigger: "item"
      },
      xAxis: { data: xAxes[timescale] },
      yAxis: { type: "value", name: "% APY" },
      dataZoom: [
        {
          id: "dataZoomY",
          type: "slider",
          yAxisIndex: [0],
          filterMode: "empty"
        }
      ],
      series: [
        {
          name: intl.formatMessage({ defaultMessage: "Historical Performance" }),
          type: "line",
          data: allData[timescale]
        }
      ]
    };
  }, [APYData, colorMode, strategy, timescale]);

  useEffect(() => {
    const canvas = document.getElementById("historical-performance");
    if (canvas) {
      chart = echarts.init(canvas as HTMLCanvasElement);
      chart.setOption(options, true);
    }
  }, [options]);
  return (
    <Wrapper>
      <WrappetTitle>{strategyName}</WrappetTitle>
      <WrappetContainer>
        <div css={{ display: "flex", flexDirection: "column" }}>
          <div css={{ display: "flex", paddingLeft: 38 }}>
            <Button disabled={timescale === Timescale.TwoWeeks} onClick={() => setTimescale(Timescale.TwoWeeks)}>
              14D
            </Button>
            <Button disabled={timescale === Timescale.Week} onClick={() => setTimescale(Timescale.Week)}>
              7D
            </Button>
            <Button disabled={timescale === Timescale.Day} onClick={() => setTimescale(Timescale.Day)}>
              24H
            </Button>
          </div>
          <div id="historical-performance" style={{ height: 300, width: 500 }} />
        </div>
      </WrappetContainer>
    </Wrapper>
  );
});

export default injectIntl(HistoricalPerformance);
