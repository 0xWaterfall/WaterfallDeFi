/** @jsxImportSource @emotion/react */

import React from "react";
import styled from "@emotion/styled";

type TProps = {
  assetName: string;
  size?: number;
};

const CoinWrapper = styled.div`
  background-size: cover;
  background-repeat: no-repeat;
`;

const Coin: React.FC<TProps> = ({ assetName, size = 25 }) => {
  return (
    <CoinWrapper
      style={{
        backgroundImage: `url(/coins/${assetName}.png)`,
        height: size,
        width: size
      }}
    />
  );
};
export default Coin;
