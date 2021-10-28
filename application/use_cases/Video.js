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

module.exports.Pagination = (
  { page, sessionId, limit },
  { videoRepository }
) => {
  return videoRepository.pagination({ page, sessionId, limit });
};
module.exports.FindAll = ({ videoRepository }) => {
  return videoRepository.findAll();
};
module.exports.FindByName = (videoName, { videoRepository }) => {
  return videoRepository.findByName(videoName);
};
module.exports.RankedVideos = ({ videoRepository }) => {
  return videoRepository.rankedVideos();
};
