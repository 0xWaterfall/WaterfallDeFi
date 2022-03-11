/** @jsxImportSource @emotion/react */

import { ClassNames, useTheme } from "@emotion/react";
import { DarkIcon, I18n, LightIcon } from "assets/images";
import Dropdown from "components/Dropdown/Dropdown";
import React, { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useAppDispatch, useAppSelector } from "store";
import { fetchI18nMiddleware } from "store/i18n";
import { languages } from "config";
import styled from "@emotion/styled";
import { setTheme } from "store/selectedKeys";
import { useNetwork } from "hooks/useSelectors";

const Wrapper = styled.div`
  display: grid;
  gap: 24px;
  grid-auto-flow: column;
`;

const I18nWrapper = styled.ul`
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadow.primary};
  background: ${({ theme }) => theme.useColorModeValue(theme.white.normal, theme.dark.header)};
  border-radius: 4px;
  margin-top: 10px;
  padding: 4px 0;
`;

const Locale = styled.li`
  width: 140px;
  height: 32px;
  display: flex;
  align-items: center;
  padding-left: 12px;
  color: ${({ theme }) => theme.useColorModeValue(theme.gray.normal7, theme.white.normal5)};
  :hover {
    background: ${({ theme }) => theme.useColorModeValue(theme.primary.lightBrown, theme.primary.deep04)};
  }
`;

const ThemeIcon = styled.div`
  color: ${({ theme: { useColorModeValue, gray, white } }) => useColorModeValue(gray.normal5, white.normal7)};
  svg {
    cursor: pointer;
  }
  :hover {
    color: ${({ theme: { useColorModeValue, gray, white } }) => useColorModeValue(gray.normal7, white.normal5)};
  }
`;

type TProps = WrappedComponentProps;

const ActionIconGroup = memo<TProps>(({ intl, ...props }) => {
  const { gray, white, useColorModeValue } = useTheme();

  const dispatch = useAppDispatch();
  const { locale } = useAppSelector((state) => state.i18n);

  const { colorMode } = useTheme();

  return (
    <Wrapper {...props}>
      <ThemeIcon>
        {colorMode === "dark" ? (
          <LightIcon
            onClick={() => {
              dispatch(setTheme("light"));
            }}
          />
        ) : (
          <DarkIcon
            onClick={() => {
              dispatch(setTheme("dark"));
            }}
          />
        )}
      </ThemeIcon>
      <ClassNames>
        {({ css }) => (
          <Dropdown
            overlay={
              <I18nWrapper>
                {languages
                  ?.filter((p) => p.code !== locale)
                  ?.map((l) => (
                    <Locale key={l.code} onClick={() => dispatch(fetchI18nMiddleware(l.code))}>
                      {l.name}
                    </Locale>
                  ))}
              </I18nWrapper>
            }
            openClassName={css({
              color: useColorModeValue(gray.normal85, white.normal5)
            })}
          >
            <I18n
              css={{
                color: useColorModeValue(gray.normal5, white.normal7),
                display: "block",
                cursor: "pointer"
              }}
            />
          </Dropdown>
        )}
      </ClassNames>
    </Wrapper>
  );
});

export default injectIntl(ActionIconGroup);
