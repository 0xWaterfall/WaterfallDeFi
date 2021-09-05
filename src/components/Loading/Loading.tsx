/** @jsxImportSource @emotion/react */

import React from "react";
import { default as animationData } from "assets/lottie/animationData.json";
import Lottie from "react-lottie";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  position: relative;
  background: transparent;
`;

const Mask = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 98;
`;

type TProps = {
  isLoading?: boolean;
};

const Loading: React.FC<TProps> = ({ isLoading, children }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };
  return (
    <Wrapper>
      {isLoading && (
        <>
          <Lottie
            options={defaultOptions}
            isClickToPauseDisabled={true}
            isStopped={false}
            style={{
              width: 160,
              height: 160,
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              zIndex: 99
            }}
          />
          <Mask />
        </>
      )}

      {children}
    </Wrapper>
  );
};
export default Loading;
