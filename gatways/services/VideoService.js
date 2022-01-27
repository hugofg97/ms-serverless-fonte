const { IVideoService } = require("../../interfaces/IVideo");

module.exports = class extends IVideoService {
  async create(video, { Create }, serviceLocator) {
    const newVideo = await Create(video, serviceLocator);

    return newVideo;
  }

  async findByName({ videoName }, { FindByName }, serviceLocator) {
    console.log('aaaaaaaaaas',videoName)
    const videoExists = await FindByName(videoName, serviceLocator);

    if (videoExists) throw 409;
  }

  async pagination({ page, sessionId }, { Pagination }, serviceLocator) {
    return await Pagination({ page, sessionId, limit: 10 }, serviceLocator);
  }
  async findBestRanking({ subscriberId }, { RankedVideos }, serviceLocator) {
    let allVideos = await RankedVideos(serviceLocator);
    allVideos = this.isLikedBySubscriber({
      videos: allVideos,
      subscriberId: subscriberId,
    });
    
    return allVideos;
  }
  isLikedBySubscriber({ videos, subscriberId }) {
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
  unlockVideos({ videos }) {
    return videos.map((video) => {
      video.locked = false;
      return video;
    });
  }
  async findById({videoId}, {videoRepository}) {
    const video = await videoRepository.findById({videoId});
    return video;

  }
  async like({ subscriberId, videoId }, { videoRepository }) {
    const video = await videoRepository.findById({ videoId: videoId });
    console.log("nerjnr")
    if (!video.thoseWhoLiked.includes(subscriberId)) {
      video.thoseWhoLiked.push(subscriberId);
      const likedVideo = await videoRepository.liked({
        thoseWhoLiked: video.thoseWhoLiked,
        videoId: videoId,
      });
      likedVideo.liked = true;
      likedVideo.likes = likedVideo.thoseWhoLiked.length;
      delete video.thoseWhoLiked;
      console.log(")_____", likedVideo)
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
  async findLikedsBySubscriber({ subscriberId, page }, { videoRepository }) {
    const videos = await videoRepository.findAll();
    const videosLikeds=  videos.filter((video) => {
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
    if(videosLikeds && videosLikeds.length <= 0) return [];
    const skip = 10 * (page - 1);
    let limit = skip + 10;
    if(limit >= videosLikeds.length) {
      limit = videosLikeds.length
    }
    return videosLikeds.slice(skip, limit)
  }
};
