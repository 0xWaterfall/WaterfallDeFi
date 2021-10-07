import styled from "@emotion/styled";

export const FlexRow = styled.div`
  display: flex;
  align-items: center;
`;

export const LinearGradientSubtract = styled.div`
  width: 1301px;
  height: 382px;
  background: ${({ theme }) =>
    theme.useColorModeValue(
      `linear-gradient(
    90deg,
    rgba(252, 182, 4, 0.1) 14.14%,
    rgba(3, 161, 75, 0.1) 45.76%,
    rgba(12, 108, 254, 0.1) 84.73%
  )`,
      `linear-gradient(90deg, rgba(252, 182, 4, 0.3) 14.14%, rgba(3, 161, 75, 0.3) 45.76%, rgba(12, 108, 254, 0.3) 84.73%)`
    )};
  filter: blur(200px);

  transform: matrix(-1, 0, 0, 1, 0, 0);
`;
