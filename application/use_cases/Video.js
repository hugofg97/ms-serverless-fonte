"use strict";

const { IVideo } = require("../../interfaces/IVideo");
module.exports.Create = (
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

module.exports.Pagination = ({ page, sessionId }, { videoRepository }) => {
  return videoRepository.pagination({ page, sessionId });
};
module.exports.FindAll = ({ videoRepository }) => {
  return videoRepository.findAll();
};
