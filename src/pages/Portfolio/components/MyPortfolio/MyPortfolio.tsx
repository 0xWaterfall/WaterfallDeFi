import { memo } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import SparePositions from "pages/SparePositions";

type TProps = WrappedComponentProps;

const MyPortfolio = memo<TProps>(({ intl }) => {
  return (
    <div>
      <SparePositions />
    </div>
  );
});

export default injectIntl(MyPortfolio);
