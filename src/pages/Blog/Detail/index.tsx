/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import moment from "moment";
import { memo, useEffect, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useLocation } from "react-router-dom";
import "./blog_detail.css";
// import "./blog_detail_mobile.css";e

type TProps = WrappedComponentProps;
type MediumItem = {
  title: string;
  pubDate: string;
  link: string;
  guid: string;
  author: string;
  thumbnail: string;
  description: string;
  content: string;
  categories: string[];
};
const BlogDetail = memo<TProps>(({ intl }) => {
  const { state, pathname } = useLocation<{ data: MediumItem }>();
  const [data, setData] = useState<MediumItem>();

  useEffect(() => {
    if (!state.data) window.location.href = "/blog";
    setData(state.data);
  }, [location]);
  return (
    <>
      <div style={{ paddingTop: 70 }}>
        {data && (
          <div className="blogDetailContainer">
            <div className="blogDetailHead">
              <div className="blogDetailTitle">{data?.title}</div>
              <div style={{ position: "relative" }}>
                <div className="blogDetailDate">
                  <div className="blogDetailByAuthor">By</div> {data?.author} <span></span>
                  {moment(data?.pubDate).format("MMMM D YYYY")}
                </div>
              </div>
            </div>
            <div>
              <div className="blogDetailDesc" dangerouslySetInnerHTML={{ __html: data?.description }}></div>
            </div>
          </div>
        )}
      </div>
    </>
  );
});

export default injectIntl(BlogDetail);
