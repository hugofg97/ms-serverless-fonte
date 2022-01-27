"use strict";
const { IVideoRepository, IVideo } = require("../../interfaces/IVideo");
const MongoVideo = require("../schemas/videos");

module.exports = class extends IVideoRepository {
  constructor() {
    super();
  }
  async create({videoName, sessionId, videoDescription, locked, videoThumb,videoUrl}) {
    const video = await MongoVideo.connectDb.create(
      {
        sessionId,
        videoName,
        videoThumb,
        videoDescription,
        videoUrl,
        locked
      }
    );
    return video;
  }
  async findAll() {
    const mongoVideos = await MongoVideo.connectDb.scan().where({deletedAt: null}).exec();
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
    const video = await MongoVideo.connectDb.get({
      '_id': videoId,
    });
    if(!video) return false;
    return new IVideo({
      _id: video._id,
      sessionId: video.sessionId,
      videoName: video.videoName,
      videoDescription: video.videoDescription,
      videoUrl: video.videoUrl,
      videoThumb: video.videoThumb,
      locked: video.locked,
      thoseWhoLiked: video.thoseWhoLiked,
    });
  }
  async findBySessionId({ sessionId }) {
    const [mongoVideo] = await MongoVideo.connectDb
    .query({sessionId: sessionId})
    .where({deletedAt: null})
    .exec();

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
    const [video] = await MongoVideo.connectDb
    .query('videoName')
    .eq(videoName)
    .where({ deletedAt: null})
    .exec();
    if(!video) return false;
    return new IVideo({
      _id: video._id,
      sessionId: video.sessionId,
      videoName: video.videoName,
      videoDescription: video.videoDescription,
      videoUrl: video.videoUrl,
      videoThumb: video.videoThumb,
      locked: video.locked,
      thoseWhoLiked: video.thoseWhoLiked,
    });
  }
  async liked({ thoseWhoLiked, videoId }) {
    console.log('>>>>>>>>>>>>>>>>>>>',thoseWhoLiked)
  const video =  await MongoVideo.connectDb.update(
      {
        _id: videoId,
      },
      { thoseWhoLiked: thoseWhoLiked }
    );

  console.log(video,'>>>>>>>>>>>>>  ')

    return new IVideo({
      _id: video._id,
      sessionId: video.sessionId,
      videoName: video.videoName,
      videoDescription: video.videoDescription,
      videoUrl: video.videoUrl,
      videoThumb: video.videoThumb,
      locked: video.locked,
      thoseWhoLiked: video.thoseWhoLiked,
    });
  }
  async pagination({ page, sessionId, limit }) {
    page = parseInt(page);
    const skip = page === 1 ? 10 : 10 * (page - 1);
    console.log(skip, "____", page)
    const { count } = await MongoVideo.connectDb
    .query('sessionId')
    .eq(sessionId)
    .where({ deletedAt: null })
    .count()
    .exec();
    console.log("contagem :", count);
    if (page >= 2 && skip >= count) return [];

    let videos = await MongoVideo.connectDb
      .query('sessionId')
      .eq(sessionId)
      .where({deletedAt: null})
      .limit(parseInt(skip))
      .exec();
      if (page > 1) {
        const { lastKey } = videos;
        videos = await MongoVideo.connectDb
          .query('sessionId')
          .eq(sessionId)
          .where({ deletedAt: null })
          .limit(skip).startAt(lastKey).exec();
      }
    return videos.map((mongoVideo) => {
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
