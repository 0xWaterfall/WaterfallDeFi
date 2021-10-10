import React, { memo, useEffect } from "react";
import * as echarts from "echarts";
let myChart: echarts.ECharts;

const setEchartsData = (data: string) => ({
  series: [
    {
      type: "gauge",
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
      },
      pointer: {
        show: true,
        width: "2",
        itemStyle: {
          color: "auto"
        }
      },
      radius: "100%",
      min: 0,
      max: 100,
      endAngle: 0,
      startAngle: 180,
      axisLabel: {
        show: false
      },
      progress: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      detail: { show: false, formatter: "{value}%" },
      data: [
        {
          value: data.replace("%", "")
        }
      ]
    }
  ]
});

const Chart = memo(() => {
  useEffect(() => {
    myChart = echarts.init(document.getElementById("MarginCharts") as HTMLDivElement);
  }, []);
  useEffect(() => {
    myChart?.setOption(setEchartsData("10.00%") as echarts.EChartsResponsiveOption, true);
  }, []);
  return <div id="MarginCharts" style={{ width: 85, height: 44 }}></div>;
});

export default Chart;
