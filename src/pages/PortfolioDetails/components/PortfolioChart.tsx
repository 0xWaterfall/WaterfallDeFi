/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import { useSize } from "ahooks";
import React, { memo, useEffect, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useMemo } from "react";
import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { PieChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);

type TProps = WrappedComponentProps;

let chart: echarts.ECharts;

const PortfolioChart = memo<TProps>(({ intl }) => {
  const { white, gray, fonts } = useTheme();

  const payload = [
    { name: "BTC/USDC-LP", value: 15 },
    { name: "BTC/USDT-LP", value: 30 },
    { name: "BTC/BUSD-LP", value: 40 }
  ];
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
              fontSize: "12",
              fontFamily: fonts.CarterOne
            }
          },
          labelLine: {
            show: false
          },
          tooltip: {
            textStyle: { fontFamily: fonts.CarterOne }
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
    <React.Fragment>
      <div css={{ paddingTop: 8 }}>{intl.formatMessage({ defaultMessage: "Portfolio" })}</div>
      <div
        css={{
          display: "flex",
          "@media screen and (max-width: 475px)": {
            flexDirection: "column-reverse",
            alignItems: "center"
          }
        }}
      >
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
              <div css={{ marginLeft: 4 }}>{p.name} -15%</div>
            </div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
});

export default injectIntl(PortfolioChart);
