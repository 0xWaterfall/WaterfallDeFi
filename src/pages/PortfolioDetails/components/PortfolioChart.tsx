/** @jsxImportSource @emotion/react */

import { useTheme } from "@emotion/react";
import React, { memo, useEffect, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useMemo } from "react";
import * as echarts from "echarts/core";
import { TooltipComponent, LegendComponent } from "echarts/components";
import { PieChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";
import styled from "@emotion/styled";
import { StrategyFarm } from "types";
import { Modal } from "antd";
import HistoricalPerformance from "./HistoricalPerformance";
import { Close } from "assets/images";

echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);

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

type TProps = WrappedComponentProps & {
  strategyFarms: StrategyFarm[];
  APYData: any[];
};

let chart: echarts.ECharts;

const PortfolioChart = memo<TProps>(({ intl, strategyFarms, APYData }) => {
  const { white, gray, dark, colorMode } = useTheme();

  const [showHistoricalModal, setShowHistoricalModal] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState("");
  const [strategyName, setStrategyName] = useState("");

  const strategyTuple = strategyFarms.map((s) => s.apiKey);
  const strategyNameTuple = strategyFarms.map((s) => s.farmName);

  const payload: any[] = [];
  if (strategyFarms && strategyFarms.length > 0) {
    strategyFarms.map((r: any) => {
      payload.push({ name: r?.farmName, value: r?.shares * 100 });
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
            borderColor: colorMode === "dark" ? dark.block : white.normal,
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
              color: colorMode === "dark" ? white.normal : gray.normal
            }
          },
          labelLine: {
            show: false
          },
          data: res
        }
      ]
    };
  }, [payload, colorMode]);
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
      chart.on("click", function (e) {
        setStrategyName(e.name);
        //e has no instance of apiKey because it's an ECharts instance, not the object it was constructed from
        setSelectedStrategy(strategyTuple[strategyNameTuple.indexOf(e.name)]);
        setShowHistoricalModal(true);
      });
    }
  }, [options, colorMode]);

  return (
    <>
      <Modal
        visible={showHistoricalModal}
        onCancel={() => setShowHistoricalModal(false)}
        bodyStyle={
          colorMode === "dark"
            ? {
                backgroundColor: "#13132C",
                color: "rgba(255, 255, 255, .85)"
              }
            : {
                backgroundColor: "#FFFFFF",
                color: "rgba(51, 51, 51, 0.85)"
              }
        }
        footer={null}
        closeIcon={<Close color={colorMode === "dark" ? "#FFFFFF" : "rgba(51, 51, 51, 0.08);"} />}
      >
        <HistoricalPerformance APYData={APYData} strategy={selectedStrategy} strategyName={strategyName} />
      </Modal>
      <Wrapper>
        <WrappetTitle>{intl.formatMessage({ defaultMessage: "Portfolio Breakdown" })}</WrappetTitle>
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
                  ...(index === i ? { backgroundColor: colorMode === "dark" ? white.normal5 : gray.normal04 } : {}),
                  ":hover": { backgroundColor: colorMode === "dark" ? white.normal5 : gray.normal04 }
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
                  {p.name} {p.value}%
                </div>
              </div>
            ))}
          </div>
        </WrappetContainer>
      </Wrapper>
    </>
  );
});

export default injectIntl(PortfolioChart);
