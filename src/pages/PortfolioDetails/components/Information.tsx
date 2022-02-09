/** @jsxImportSource @emotion/react */

import { ArrowLeft } from "assets/images";
import { memo, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useHistory } from "react-router-dom";
import styled from "@emotion/styled";
import { Market } from "types";
import { getLockupPeriod } from "utils/formatNumbers";
import Coin from "components/Coin";
import Modal from "components/Modal/Modal";
import Input from "components/Input/Input";
import { BIG_TEN } from "utils/bigNumber";
import BigNumber from "bignumber.js";
import { Checkbox } from "antd";

const Wrapper = styled.div`
  display: flex;
  padding-top: 37px;
  /* & > div {
    padding: 0px 20px;
  } */
  /* & span {
    font-size: 14px;
    line-height: 19px;
    color: ${({ theme }) => theme.gray.normal7};
  } */
  /* @media screen and (max-width: 768px) {
    display: flex;
    flex-direction: column;
    & > div {
      padding: 10px 0;
    }
  } */
`;
const Arrow = styled(ArrowLeft)`
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal85)};
  & :hover {
    color: ${({ theme }) => theme.useColorModeValue(theme.primary.deep, theme.white.normal5)};
  }
  margin-top: 4px;
  margin-right: 20px;
  cursor: pointer;
`;

const InformationWrapper = styled.div`
  display: grid;
  gap: 40px;
  grid-auto-flow: column;
  @media screen and (max-width: 768px) {
    grid-auto-flow: row;
  }
`;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  font-size: 14px;
  span:last-child {
    color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal7)};
  }
  :last-child {
    span:last-child {
      font-size: 16px;
      color: ${({ theme }) => theme.primary.deep};
    }
  }
`;

const PortfolioName = styled.span`
  font-size: 24px;
  height: 30px;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
`;

const Assets = styled.span`
  display: flex;
  font-size: 20px;
  height: 30px;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal85, theme.white.normal85)};
`;

type TProps = WrappedComponentProps & {
  data: Market;
  selectedDepositAsset: string;
  setSelectedDepositAsset: React.Dispatch<React.SetStateAction<string>>;
  depositMultipleSimultaneous: boolean;
  setDepositMultipleSimultaneous: React.Dispatch<React.SetStateAction<boolean>>;
};

const Information = memo<TProps>(
  ({
    data,
    selectedDepositAsset,
    setSelectedDepositAsset,
    depositMultipleSimultaneous,
    setDepositMultipleSimultaneous
  }) => {
    const { push } = useHistory();
    const [selectDepositAssetModalVisible, setSelectDepositAssetModalVisible] = useState<boolean>(false);
    const [depositableAssets, setDepositableAssets] = useState<string[]>(data.assets);

    const tokens: { addr: string; strategy: string; percent: any }[] | undefined = data.tokens;

    const trancheInvest: { type: "BigNumber"; hex: string }[][] | undefined = data.trancheInvests;

    return (
      <Wrapper>
        <Modal
          visible={selectDepositAssetModalVisible}
          width={428}
          style={{ top: "25%" }}
          bodyStyle={{ padding: 20 }}
          onCancel={() => {
            setSelectDepositAssetModalVisible(false);
          }}
        >
          <h1 css={{ width: "100%", textAlign: "center", fontWeight: 500, fontSize: 20 }}>Select a Token</h1>
          <Input
            placeholder="Search Token Name"
            style={{ backgroundColor: "rgba(39, 29, 23, 0.04)", borderRadius: 8, marginTop: 20 }}
            onChange={(e) => {
              setDepositableAssets(data.assets.filter((a) => a.includes(e.target.value.toString())));
            }}
          />
          <div css={{ display: "flex", justifyContent: "space-between", padding: "20px 0 20px 0" }}>
            <span>Token Name</span>
            <span>Remaining</span>
          </div>
          {depositableAssets.map((a, i) => (
            <div
              key={a}
              css={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 12,
                borderRadius: 5,
                padding: 5,
                cursor: "pointer",
                ":hover": { backgroundColor: "rgb(51,51,51,0.1)" }
              }}
              onClick={() => {
                setSelectedDepositAsset(a);
              }}
            >
              <div css={{ display: "flex" }}>
                <Coin assetName={a} size={32} />
                <div css={{ padding: "5px 0 0 6px" }}>{a}</div>
              </div>
              {trancheInvest && tokens && tokens.length > 0 && trancheInvest.length > 0 ? (
                <div css={{ paddingTop: 5 }}>
                  {new BigNumber(
                    trancheInvest.reduce((acc, next) => acc.plus(new BigNumber(next[i].hex)), new BigNumber(0))
                  )
                    .dividedBy(BIG_TEN.pow(18))
                    .toString()}
                  {"/"}
                  {new BigNumber(data.totalTranchesTarget)
                    .multipliedBy(new BigNumber(tokens[i].percent.hex).dividedBy(BIG_TEN.pow(5)))
                    .toString()}
                </div>
              ) : null}
              {/* TODO: ^ use trancheInvest contract calls to get how much of a certain coin has already been invested in fall */}
            </div>
          ))}
          <div css={{ display: "flex", justifyContent: "flex-end" }}>
            <div css={{ marginRight: 10 }}>Deposit / withdraw multiple tokens at once</div>
            <Checkbox
              checked={depositMultipleSimultaneous}
              onChange={() => {
                setDepositMultipleSimultaneous(!depositMultipleSimultaneous);
              }}
            />
          </div>
        </Modal>
        <Arrow onClick={() => push({ pathname: "/portfolio/markets" })} />
        <InformationWrapper>
          <Block>
            <PortfolioName>{data?.portfolio}</PortfolioName>
            <span>Listing date: {data?.listingDate}</span>
          </Block>
          <Block>
            <Assets
              css={{
                cursor: data.isMulticurrency ? "pointer" : "auto",
                padding: 3,
                borderRadius: 5,
                transform: "translateY(-3px)",
                ":hover": data.isMulticurrency ? { backgroundColor: "rgb(51,51,51,0.1)" } : {}
              }}
              onClick={() => {
                if (data.isMulticurrency) {
                  setSelectDepositAssetModalVisible(true);
                }
              }}
            >
              {!depositMultipleSimultaneous ? (
                <>
                  <Coin assetName={selectedDepositAsset} size={24} />
                  <div css={{ padding: "1px 0 0 5px" }}>{selectedDepositAsset}</div>
                </>
              ) : (
                <>
                  {data.assets.map((a, i) => (
                    <Coin key={i} assetName={a} size={24} />
                  ))}
                  <div css={{ padding: "1px 0 0 5px" }}>
                    {data.assets.map((a, i) => (
                      <span key={i}>
                        {a} {i !== data.assets.length - 1 ? " / " : ""}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </Assets>
            <span>Lock-up period: {data?.duration ? getLockupPeriod(data?.duration) : "-"}</span>
          </Block>
          <Block css={{ paddingTop: 26 }}>
            <span>TVL: ${data?.tvl}</span>
          </Block>
        </InformationWrapper>
      </Wrapper>
    );
  }
);

export default injectIntl(Information);
