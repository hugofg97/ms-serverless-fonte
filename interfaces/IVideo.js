"use strict";

class IVideo {
  constructor({
    _id = null,
    sessionId,
    videoName,
    videoDescription,
    videoUrl,
    videoThumb,
    locked,
    thoseWhoLiked = [],
    likes
  }) {
    this._id = _id;
    this.sessionId = sessionId;
    this.videoName = videoName;
    this.videoDescription = videoDescription;
    this.videoUrl = videoUrl;
    this.videoThumb = videoThumb;
    this.locked = locked;
    this.thoseWhoLiked = thoseWhoLiked;
    this.likes = likes
  }
}

class IVideoRepository {
  create(IVideo) {
    throw 500;
  }

  update(IVideo) {
    throw 500;
  }

  remove(videoId) {
    throw 500;
  }

  pagination(page) {
    throw 500;
  }
  getAll(page) {
    throw 500;
  }
}

class IVideoService {
  async paginationVideo(
    { page, sessionId },
    { PaginationVideo },
    serviceLocator
  ) {
    throw 500;
  }
  async createVideo(video, { FindOneVideo, CreateVideo }, serviceLocator) {
    throw 500;
  }
}
module.exports = {
  IVideo,
  IVideoRepository,
  IVideoService,
};
