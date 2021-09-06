"use strict";
const { IVideoRepository, IVideo } = require("../../interfaces/IVideo");
const MongoVideo = require("../schemas/videos");

module.exports = class extends IVideoRepository {
  constructor() {
    super();
  }
  async getAll() {
    const mongoVideos = await MongoVideo.connectDb.find({ deletedAt: null });
    return mongoVideos.map((mongoVideo) => {
      return new IVideo({
        _id: mongoVideo._id,
        sessionId: mongoVideo.sessionId,
        videoName: mongoVideo.videoName,
        videoDescription: mongoVideo.videoDescription,
        videoUrl: mongoVideo.videoUrl,
        videoThumb: mongoVideo.videoThumb,
        locked: mongoVideo.locked,
      });
    });
  }
  async pagination({ page, sessionId }) {
    const skip = 5 * (page - 1);
    const mongoVideos = await MongoVideo.connectDb
      .find({ sessionId: sessionId, deletedAt: null })
      .skip(skip)
      .limit(parseInt(5));

    return mongoVideos.map((mongoVideo) => {
      return new IVideo({
        _id: mongoVideo._id,
        sessionId: mongoVideo.sessionId,
        videoName: mongoVideo.videoName,
        videoDescription: mongoVideo.videoDescription,
        videoUrl: mongoVideo.videoUrl,
        videoThumb: mongoVideo.videoThumb,
        locked: mongoVideo.locked,
      });
    });
  }
};
