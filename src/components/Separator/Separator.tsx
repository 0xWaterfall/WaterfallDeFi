/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";

interface SeparatorProps {
  margin?: number;
}
const Separator = styled.div<SeparatorProps>`
  background: ${({ theme }) => theme.useColorModeValue(theme.primary.lightBrown, theme.white.normal2)};
  height: 2px;
  margin: ${({ margin }) => margin ?? 40}px 0px;
`;

export default Separator;
