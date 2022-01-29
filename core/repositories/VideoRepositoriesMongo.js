"use strict";
const { IVideoRepository, IVideo } = require("../../interfaces/IVideo");
const VideoModel = require("../schemas/videos");
const uuid = require('uuid');
const bcrypt = require('bcrypt')

module.exports = class extends IVideoRepository {
  constructor() {
    super();
  }
  async create({ videoName, sessionId, videoDescription, locked, videoThumb, videoUrl }) {
    const salt = bcrypt.genSaltSync(10);
    const crypt =  bcrypt.hashSync(videoName+videoUrl, salt).substring(15,20).replace(/\./g, '-').replace(/\//g, '-');
    const video = await VideoModel.connectDb.create(
      {
        _id: `${uuid.v1()}-${crypt}`,
        sessionId,
        videoName,
        videoThumb,
        videoDescription,
        videoUrl,
        locked
      }
    );
    return new IVideo({
      _id: video._id,
      sessionId: video.sessionId,
      videoName: video.videoName,
      videoDescription: video.videoDescription,
      videoUrl: video.videoUrl,
      videoThumb: video.videoThumb,
      locked: video.locked,
      thoseWhoLiked: video.thoseWhoLiked,
      likes: video.likes
    });;
  }
  async findAll() {
    const videos = await VideoModel.connectDb
      .scan()
      .where('deletedAt')
      .not()
      .exists()
      .exec();
    return videos.map((video) => {
      return new IVideo({
        _id: video._id,
        sessionId: video.sessionId,
        videoName: video.videoName,
        videoDescription: video.videoDescription,
        videoUrl: video.videoUrl,
        videoThumb: video.videoThumb,
        locked: video.locked,
        thoseWhoLiked: video.thoseWhoLiked,
        likes: video.likes
      });
    });
  }
  async rankedVideos() {
    const videos = await VideoModel.connectDb
      .query('orderByLike')
      .eq('order-desc')
      .sort('descending')
      .where('deletedAt')
      .not()
      .exists()
      .limit(10)
      .exec();
    return videos.map((video) => {
      return new IVideo({
        _id: video._id,
        sessionId: video.sessionId,
        videoName: video.videoName,
        videoDescription: video.videoDescription,
        videoUrl: video.videoUrl,
        videoThumb: video.videoThumb,
        locked: video.locked,
        thoseWhoLiked: video.thoseWhoLiked,
        likes: video.likes
      });
    });
  }
  async findById({ videoId }) {
    const video = await VideoModel.connectDb.get({ '_id': videoId });
    if (!video) return false;
    return new IVideo({
      _id: video._id,
      sessionId: video.sessionId,
      videoName: video.videoName,
      videoDescription: video.videoDescription,
      videoUrl: video.videoUrl,
      videoThumb: video.videoThumb,
      locked: video.locked,
      thoseWhoLiked: video.thoseWhoLiked,
      likes: video.likes
    });
  }
  async findBySessionId({ sessionId }) {
    const [video] = await VideoModel.connectDb
      .query('sessionId')
      .eq(sessionId)
      .where('deletedAt')
      .not()
      .exists()
      .exec();

    return new IVideo({
      _id: video._id,
      sessionId: video.sessionId,
      videoName: video.videoName,
      videoDescription: video.videoDescription,
      videoUrl: video.videoUrl,
      videoThumb: video.videoThumb,
      locked: video.locked,
      thoseWhoLiked: video.thoseWhoLiked,
      likes: video.likes
    });
  }
  async findByName({ videoName }) {
    const [video] = await VideoModel.connectDb
      .query('videoName')
      .eq(videoName)
      .where('deletedAt')
      .not()
      .exists()
      .exec();
    if (!video) return false;
    return new IVideo({
      _id: video._id,
      sessionId: video.sessionId,
      videoName: video.videoName,
      videoDescription: video.videoDescription,
      videoUrl: video.videoUrl,
      videoThumb: video.videoThumb,
      locked: video.locked,
      thoseWhoLiked: video.thoseWhoLiked,
      likes: video.likes
    });
  }
  async liked({ thoseWhoLiked, videoId }) {
    const video = await VideoModel.connectDb.update(
      {
        _id: videoId,
        creation: 1643310177111
      },
      { thoseWhoLiked: thoseWhoLiked, likes: thoseWhoLiked.length }
    );


    return new IVideo({
      _id: video._id,
      sessionId: video.sessionId,
      videoName: video.videoName,
      videoDescription: video.videoDescription,
      videoUrl: video.videoUrl,
      videoThumb: video.videoThumb,
      locked: video.locked,
      thoseWhoLiked: video.thoseWhoLiked,
      likes: video.likes
    });
  }
  async pagination({ page, sessionId, limit }) {
    page = parseInt(page);
    const skip = page === 1 ? 10 : 10 * (page - 1);
    const { count } = await VideoModel.connectDb
      .query('sessionId')
      .eq(sessionId)
      .where('deletedAt')
      .not()
      .exists()
      .count()
      .exec();
    if (page >= 2 && skip >= count) return [];

    let videos = await VideoModel.connectDb
      .query('sessionId')
      .eq(sessionId)
      .where('deletedAt')
      .not()
      .exists()
      .limit(parseInt(skip))
      .exec();
    if (page > 1) {
      const { lastKey } = videos;
      videos = await VideoModel.connectDb
        .query('sessionId')
        .eq(sessionId)
        .where('deletedAt')
        .not()
        .exists()
        .limit(skip).startAt(lastKey).exec();
    }
    return videos.map((video) => {
      return new IVideo({
        _id: video._id,
        sessionId: video.sessionId,
        videoName: video.videoName,
        videoDescription: video.videoDescription,
        videoUrl: video.videoUrl,
        videoThumb: video.videoThumb,
        locked: video.locked,
        thoseWhoLiked: video.thoseWhoLiked,
        likes: video.likes
      });
    });
  }
};
