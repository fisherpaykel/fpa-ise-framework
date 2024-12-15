"use client";
import { useNavbarConfig } from "../utils/useNavbarConfig";
import { useEffect } from "react";
import { useFooterConfig } from "../utils/useFooterConfig";

const VideoList = (data: any) => {
  const { updateConfig } = useNavbarConfig();
  useEffect(() => {
    updateConfig({ title: data.title, hideTitle: false, hideHeader: false });
  }, []);

  const { updateFooterConfig } = useFooterConfig();

  useEffect(() => {
    updateFooterConfig({ isMainMenu: false, menuLinks: data.menuLinks.data });
  }, []);

  const videoUrl = 'https://storage.googleapis.com/fpt-public-data/test-60fps.webm';

  return (
    <>
      <div className="product-list">
        <ul>
            <li key={data.id} className="product-item">
              <div className="video-container">
                <video className="responsive-video" controls>
                <source src={videoUrl} type="video/webm" />
                  Your browser does not support the video tag.
                </video>
              </div>
            </li>
        </ul>
      </div>
    </>
  );
};

export default VideoList;
