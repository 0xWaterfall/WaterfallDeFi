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
import { useMulticurrencyDepositableTokens, useMulticurrencyTrancheInvest } from "hooks";

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
};

const Information = memo<TProps>(({ data, selectedDepositAsset, setSelectedDepositAsset }) => {
  const { push } = useHistory();
  const [selectDepositAssetModalVisible, setSelectDepositAssetModalVisible] = useState<boolean>(false);
  const [depositableAssets, setDepositableAssets] = useState<string[]>(data.assets);

  //TODO: make the code more robust by using this hook higher up the tree, and dynamically handle multicurrency instead of relying on markets.ts config object
  const tokens: { addr: string; strategy: string; percent: any }[] = useMulticurrencyDepositableTokens(
    data.address,
    data.assets.length
  );

  const trancheInvest = useMulticurrencyTrancheInvest(
    data.address,
    data.cycle,
    data.depositAssetAddresses,
    data.tranches.length
  );

  // mock value test
  // const trancheInvest: any[] = [
  //   [1, 0.5],
  //   [1, 0.5],
  //   [1, 0.5]
  // ];

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
        <div css={{ display: "flex", justifyContent: "space-between", padding: "20px 0 20px 0" }}>
          <span>Token Name</span>
          <span>Remaining</span>
        </div>
        <Input
          placeholder="Search Token Name"
          style={{ backgroundColor: "rgba(39, 29, 23, 0.04)", borderRadius: 8, marginBottom: 20 }}
          onChange={(e) => {
            setDepositableAssets(data.assets.filter((a) => a.includes(e.target.value.toString())));
          }}
        />
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
            {tokens.length > 0 && trancheInvest.length > 0 ? (
              <div css={{ paddingTop: 5 }}>
                {trancheInvest.reduce((acc, next) => acc + Number(next[i]), 0)}
                {"/"}
                {Number(data.totalTranchesTarget) * Number(tokens[i].percent)}
              </div>
            ) : null}
            {/* TODO: ^ use trancheInvest contract calls to get how much of a certain coin has already been invested in fall */}
          </div>
        ))}
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
            <Coin assetName={selectedDepositAsset} size={24} />
            <div css={{ padding: "1px 0 0 5px" }}>{selectedDepositAsset}</div>
          </Assets>
          <span>Lock-up period: {data?.duration ? getLockupPeriod(data?.duration) : "-"}</span>
        </Block>
        <Block css={{ paddingTop: 26 }}>
          <span>TVL: {data?.tvl}$</span>
        </Block>
      </InformationWrapper>
    </Wrapper>
  );
});

export default injectIntl(Information);
