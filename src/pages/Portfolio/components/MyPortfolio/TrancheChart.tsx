/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import React, { memo, useEffect, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useMemo } from "react";
import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { PieChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import { sample } from "lodash";
import { COLORS } from "styles/theme";

echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);

type TProps = WrappedComponentProps;

let chart: echarts.ECharts;

const TrancheChart = memo<TProps>(({ intl }) => {
  const { white, gray, fonts } = useTheme();

  const payload = [
    { name: "Senior", value: 25 },
    { name: "Mezzanine", value: 45 },
    { name: "Junior", value: 30 }
  ];
  const options = useMemo(() => {
    const res = payload.map((p, i) => ({ value: p.value, name: p.name, itemStyle: { color: COLORS[i] } }));
    return {
      tooltip: {
        trigger: "item"
      },
      series: [
        {
          name: intl.formatMessage({ defaultMessage: "Tranche" }),
          type: "pie",
          avoidLabelOverlap: false,
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
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          },
          data: res
        }
      ]
    };
  }, [payload]);
  const [index, setIndex] = useState(-1);

  useEffect(() => {
    const canvas = document.getElementById("tranche-chart");
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
      <div css={{ color: gray.normal7 }}>{intl.formatMessage({ defaultMessage: "Tranche Composition:" })}</div>
      <div id="tranche-chart" style={{ height: 200, width: 200, margin: "auto" }} />
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

export default injectIntl(TrancheChart);
