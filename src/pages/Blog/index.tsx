/** @jsxImportSource @emotion/react */

import styled from "@emotion/styled";
import moment from "moment";
import { memo, useEffect, useState } from "react";
import { injectIntl, WrappedComponentProps } from "react-intl";
import { useHistory } from "react-router";
import { getMediumFeed } from "services/http";
import "./blog.css";
import "./blog_mobile.css";

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

const Blog = memo<TProps>(({ intl }) => {
  const { push } = useHistory();
  const [mediumData, setMediumData] = useState<MediumItem[]>([]);
  useEffect(() => {
    const fetch = async () => {
      const result = await getMediumFeed();
      console.log(result);
      if (result?.status === "ok") {
        setMediumData(result?.items);
      }
    };
    fetch();
  }, []);
  const navDetailPage = (i: number) => {
    console.log(mediumData[i]?.title);
    let t = mediumData[i]?.title || "";
    t = t.replaceAll(" ", "-");
    push("/blog/" + t, { data: mediumData[i] });
  };
  return (
    <div style={{ paddingTop: 70, maxWidth: 1024, margin: "0 auto" }}>
      <div className="blogArea">
        {mediumData.map((d, i) => {
          if (i === 0) {
            return (
              <div className="featureBlogContainer" key={i} onClick={() => navDetailPage(i)}>
                <div className="blogThumbnail" style={{ backgroundImage: `url(${d.thumbnail})` }}></div>
                <div>
                  <div className="blogTitle">{d.title}</div>
                  <div className="blogDesc" dangerouslySetInnerHTML={{ __html: d.description }}></div>
                  <div className="blogPubDate">
                    <div className="blogByAuthor">By</div> {d.author} <span></span>{" "}
                    {moment(d.pubDate).format("MMMM D YYYY")}
                  </div>
                </div>
              </div>
            );
          }
          return (
            <div className="blogContainer" key={i} onClick={() => navDetailPage(i)}>
              <div className="blogThumbnail" style={{ backgroundImage: `url(${d.thumbnail})` }}></div>
              <div className="blogTitle">{d.title}</div>
              <div className="blogDesc" dangerouslySetInnerHTML={{ __html: d.description }}></div>
              <div className="blogPubDate">
                <div className="blogByAuthor">By</div> {" " + d.author} <span></span>{" "}
                {moment(d.pubDate).format("MMMM D YYYY")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default injectIntl(Blog);
