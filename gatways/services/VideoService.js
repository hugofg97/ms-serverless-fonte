const { IVideoService } = require("../../interfaces/IVideo");

module.exports = class extends IVideoService {
  async create(session, { CreateSession }, serviceLocator) {
    const newSession = await CreateSession(session, serviceLocator);

    return newSession;
  }

  async checkSessionExists({ name }, { FindOneSession }, serviceLocator) {
    const sessionExists = await FindOneSession(name, serviceLocator);

    if (sessionExists) throw 409;
  }

  async pagination({ page, sessionId }, { Pagination }, serviceLocator) {
    const allVideos = await Pagination({ page, sessionId }, serviceLocator);

    return allVideos;
  }
  videosLikedsByUser({ videos, subscriberId }) {
    return videos.map((video) => {
      if (subscriberId)
        video.liked =
          video.thoseWhoLiked.length &&
          video.thoseWhoLiked.includes(subscriberId)
            ? true
            : false;
      else video.liked = false;
      if (video.thoseWhoLiked) video.likes = video.thoseWhoLiked.length;
      delete video.thoseWhoLiked;
      return video;
    });
  }
  async like({ subscriberId, videoId }, { videoRepository }) {
    const video = await videoRepository.findById({ videoId: videoId });
    if (!video.thoseWhoLiked.includes(subscriberId)) {
      video.thoseWhoLiked.push(subscriberId);
      const likedVideo = await videoRepository.liked({
        thoseWhoLiked: video.thoseWhoLiked,
        videoId: videoId,
      });
      likedVideo.liked = true;
      likedVideo.likes = likedVideo.thoseWhoLiked.length;
      delete video.thoseWhoLiked;
      return likedVideo;
    }
    video.liked = true;
    video.likes = video.thoseWhoLiked.length;
    delete video.thoseWhoLiked;
    return video;
  }
  async unlike({ subscriberId, videoId }, { videoRepository }) {
    const video = await videoRepository.findById({ videoId: videoId });
    if (video.thoseWhoLiked.includes(subscriberId)) {
      const thoseWhoLiked = video.thoseWhoLiked.filter((_id) => {
        return _id != subscriberId;
      });
      const likedVideo = await videoRepository.liked({
        thoseWhoLiked: thoseWhoLiked,
        videoId: videoId,
      });
      likedVideo.liked = false;
      likedVideo.likes = likedVideo.thoseWhoLiked.length;
      delete video.thoseWhoLiked;
      return likedVideo;
    }
    video.liked = false;
    video.likes = video.thoseWhoLiked.length;
    delete video.thoseWhoLiked;
    return video;
  }
  async findLikedsBySubscriber({ subscriberId }, { videoRepository }) {
    const videos = await videoRepository.findAll();
    return videos.filter((video) => {
      if (
        video.thoseWhoLiked.length &&
        video.thoseWhoLiked.includes(subscriberId)
      ) {
        video.liked = true;
        video.likes = video.thoseWhoLiked.length;
        delete video.thoseWhoLiked;
        return video;
      }
    });
  }
};
