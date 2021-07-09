import React, { FC } from "react";
import { connect } from "react-redux";
import { IntlProvider } from "react-intl";

type TStateProps = ReturnType<typeof mapStateToProps>;
type TProps = TStateProps;

const ConnectedIntlProvider: FC<TProps> = ({ children, i18n }) => {
  return (
    <IntlProvider key={i18n?.locale ?? "en"} locale={i18n?.locale ?? "en"} messages={i18n?.messages ?? {}}>
      {children}
    </IntlProvider>
  );
};

const mapStateToProps = (state: IState) => {
  return {
    i18n: state.i18n
  };
};

export default connect(mapStateToProps)(ConnectedIntlProvider);
