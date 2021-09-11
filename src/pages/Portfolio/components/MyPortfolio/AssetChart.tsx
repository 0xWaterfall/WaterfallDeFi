/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import React, { memo, useEffect, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useMemo } from "react";
import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { PieChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { COLORS } from "styles/theme";
import { sample } from "lodash";

echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);

type TProps = WrappedComponentProps;

let chart: echarts.ECharts;

const AssetChart = memo<TProps>(({ intl }) => {
  const { white, gray, fonts } = useTheme();

  const payload = [
    { name: "BTC", value: 15 },
    { name: "BNB", value: 30 },
    { name: "Matic", value: 10 },
    { name: "ETH", value: 20 },
    { name: "Link", value: 25 }
  ];
  const options = useMemo(() => {
    const res = payload.map((p, i) => ({ value: p.value, name: p.name, itemStyle: { color: COLORS[i] } }));
    return {
      tooltip: {
        trigger: "item"
      },
      series: [
        {
          name: intl.formatMessage({ defaultMessage: "Asset" }),
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
    const canvas = document.getElementById("asset-chart");
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
    <div css={{ flex: 1 }}>
      <div css={{ color: gray.normal7 }}>{intl.formatMessage({ defaultMessage: "Asset Composition:" })}</div>
      <div id="asset-chart" style={{ height: 200, width: 200, margin: "0 auto" }} />
      <div>
        {payload.map((p, i) => (
          <div
            key={p.name}
            css={{
              display: "inline-flex",
              alignItems: "center",
              padding: "4px 8px",
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
  );
});

export default injectIntl(AssetChart);
