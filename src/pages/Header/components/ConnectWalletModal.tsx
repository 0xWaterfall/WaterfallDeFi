/** @jsxImportSource @emotion/react */

import Modal from "components/Modal/Modal";
import React, { memo } from "react";
import { connect } from "react-redux";

type TStateProps = ReturnType<typeof mapStateToProps>;
type TDispatchProps = ReturnType<typeof mapDispatchToProps>;
type TProps = TStateProps & TDispatchProps;

const ConnectWalletModal = memo<TProps>(() => {
  return <Modal visible={true}></Modal>;
});

const mapStateToProps = (state: IState) => ({});
const mapDispatchToProps = (dispatch: Function) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(ConnectWalletModal);
