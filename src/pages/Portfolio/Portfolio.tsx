/** @jsxImportSource @emotion/react */

import { Intersect } from "assets/images";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { connect } from "react-redux";

type TStateProps = ReturnType<typeof mapStateToProps>;
type TDispatchProps = ReturnType<typeof mapDispatchToProps>;
type TProps = TStateProps & TDispatchProps & WrappedComponentProps;

const Portfolio = memo<TProps>(() => {
  return (
    <main css={{ position: "relative" }}>
      <Intersect css={{ position: "absolute", top: 0, left: 0, zIndex: -1 }} />
    </main>
  );
});

const mapStateToProps = (state: IState) => ({});
const mapDispatchToProps = (dispatch: Function) => ({});
export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(Portfolio));
