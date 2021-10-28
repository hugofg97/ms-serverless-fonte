"use strict";
const { IVideoRepository, IVideo } = require("../../interfaces/IVideo");
const MongoVideo = require("../schemas/videos");

module.exports = class extends IVideoRepository {
  constructor() {
    super();
  }
  async findAll() {
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
        thoseWhoLiked: mongoVideo.thoseWhoLiked,
      });
    });
  }
  async rankedVideos() {
    const mongoVideos = await MongoVideo.connectDb
      .aggregate([
        {
          $project: {
            likes: { $size: "$thoseWhoLiked" },
            sessionId: "reiki-em-alta",
            videoName: "$videoName",
            videoDescription: "$videoDescription",
            videoUrl: "$videoUrl",
            videoThumb: "$videoThumb",
            locked: "$locked",
            thoseWhoLiked: "$thoseWhoLiked",
          },
        },
      ])
      .sort({ likes: "desc" })
      .limit(5);
    return mongoVideos.map((mongoVideo) => {
      return new IVideo({
        _id: mongoVideo._id,
        sessionId: mongoVideo.sessionId,
        videoName: mongoVideo.videoName,
        videoDescription: mongoVideo.videoDescription,
        videoUrl: mongoVideo.videoUrl,
        videoThumb: mongoVideo.videoThumb,
        locked: mongoVideo.locked,
        thoseWhoLiked: mongoVideo.thoseWhoLiked,
      });
    });
  }
  async findById({ videoId }) {
    const mongoVideo = await MongoVideo.connectDb.findOne({
      _id: videoId,
      deletedAt: null,
    });

    return new IVideo({
      _id: mongoVideo._id,
      sessionId: mongoVideo.sessionId,
      videoName: mongoVideo.videoName,
      videoDescription: mongoVideo.videoDescription,
      videoUrl: mongoVideo.videoUrl,
      videoThumb: mongoVideo.videoThumb,
      locked: mongoVideo.locked,
      thoseWhoLiked: mongoVideo.thoseWhoLiked,
    });
  }
  async findBySessionId({ sessionId }) {
    const mongoVideo = await MongoVideo.connectDb.findOne({
      sessionId: sessionId,
      deletedAt: null,
    });

    return new IVideo({
      _id: mongoVideo._id,
      sessionId: mongoVideo.sessionId,
      videoName: mongoVideo.videoName,
      videoDescription: mongoVideo.videoDescription,
      videoUrl: mongoVideo.videoUrl,
      videoThumb: mongoVideo.videoThumb,
      locked: mongoVideo.locked,
      thoseWhoLiked: mongoVideo.thoseWhoLiked,
    });
  }
  async findByName({ videoName }) {
    const mongoVideo = await MongoVideo.connectDb.findOne({
      videoName: videoName,
      deletedAt: null,
    });

    return new IVideo({
      _id: mongoVideo._id,
      sessionId: mongoVideo.sessionId,
      videoName: mongoVideo.videoName,
      videoDescription: mongoVideo.videoDescription,
      videoUrl: mongoVideo.videoUrl,
      videoThumb: mongoVideo.videoThumb,
      locked: mongoVideo.locked,
      thoseWhoLiked: mongoVideo.thoseWhoLiked,
    });
  }
  async liked({ thoseWhoLiked, videoId }) {
    await MongoVideo.connectDb.updateOne(
      {
        _id: videoId,
        deletedAt: null,
      },
      { thoseWhoLiked: thoseWhoLiked }
    );

    const mongoVideo = await MongoVideo.connectDb.findOne({
      _id: videoId,
      deletedAt: null,
    });

    return new IVideo({
      _id: mongoVideo._id,
      sessionId: mongoVideo.sessionId,
      videoName: mongoVideo.videoName,
      videoDescription: mongoVideo.videoDescription,
      videoUrl: mongoVideo.videoUrl,
      videoThumb: mongoVideo.videoThumb,
      locked: mongoVideo.locked,
      thoseWhoLiked: mongoVideo.thoseWhoLiked,
    });
  }
  async pagination({ page, sessionId, limit }) {
    const skip = 5 * (page - 1);
    const mongoVideos = await MongoVideo.connectDb
      .find({ sessionId: sessionId, deletedAt: null })
      .skip(skip)
      .limit(parseInt(limit));

    return mongoVideos.map((mongoVideo) => {
      return new IVideo({
        _id: mongoVideo._id,
        sessionId: mongoVideo.sessionId,
        videoName: mongoVideo.videoName,
        videoDescription: mongoVideo.videoDescription,
        videoUrl: mongoVideo.videoUrl,
        videoThumb: mongoVideo.videoThumb,
        locked: mongoVideo.locked,
        thoseWhoLiked: mongoVideo.thoseWhoLiked,
      });
    });
  }
};
