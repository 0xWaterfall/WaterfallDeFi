/** @jsxImportSource @emotion/react */

import React, { useLayoutEffect, useState } from "react";
import { Transition } from "react-transition-group";
import { TransitionProps } from "react-transition-group/Transition";

const InitialRenderTransition: React.FC<Partial<TransitionProps>> = ({ children, ...props }) => {
  const [inStatus, setInStatus] = useState(false);
  useLayoutEffect(() => setInStatus(true), []);
  return (
    <Transition in={inStatus} timeout={0} {...props}>
      {children}
    </Transition>
  );
};
export default InitialRenderTransition;
