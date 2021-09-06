"use strict";

const { IVideo } = require("../../interfaces/IVideo");
module.exports.CreateVideo = (
  { sessionId, videoName, videoDescription, videoUrl, videoThumb, locked },
  { videoRepository }
) => {
  const video = new IVideo({
    _id: null,
    sessionId,
    videoName,
    videoDescription,
    videoUrl,
    videoThumb,
    locked,
  });
  delete video._id;
  return videoRepository.create(video);
};

module.exports.PaginationVideo = ({ page, sessionId }, { videoRepository }) => {
  return videoRepository.pagination({ page, sessionId });
};
module.exports.FindAllVideos = ({ videoRepository }) => {
  return videoRepository.getAll();
};
module.exports.CreateVideo = (video, { videoRepository }) => {
  return videoRepository.create(video);
};
