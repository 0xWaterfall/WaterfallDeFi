import React, { FC } from "react";
import { IntlProvider } from "react-intl";
import { useAppSelector } from "store";

const ConnectedIntlProvider: FC = ({ children }) => {
  const { locale, messages } = useAppSelector((state) => state.i18n);
  return (
    <IntlProvider key={locale} locale={locale} messages={messages}>
      {children}
    </IntlProvider>
  );
};

export default ConnectedIntlProvider;
