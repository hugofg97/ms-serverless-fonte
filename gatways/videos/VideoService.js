const {  IVideoFindByName, IVideo, IVideoPagination, IVideoFindById, IVideoLike, IVideoFindAll, IVideoFindBestRanked } = require("./IVideo");
const serviceLocator = require("../../core/config/serviceLocator");

module.exports = class IVideoService {
  async create({video}) {
    const newVideo = new IVideo(video);
    if(await new IVideoFindByName(video).find(serviceLocator)) throw {error: 409, field: `Video : ${video?.videoName}`};;
    
    return newVideo.create(serviceLocator);
  }

  async pagination({ paginationSettings }) {
    let videos = await new  IVideoPagination(paginationSettings).pagination(serviceLocator);
    if(paginationSettings?.subscriberId) {
      videos = this.isLikedBySubscriber({videos,...paginationSettings});
    } 
    if(paginationSettings?.unlock) {
      videos = this.unlockVideos({videos});
    }
    return videos;
  }
  async findBestRanking({ _id = "", unlock }) {
    let allVideos = await new IVideoFindBestRanked({subscriberId:_id}).find(serviceLocator);
    allVideos = this.isLikedBySubscriber({
      videos: allVideos,
      subscriberId: _id,
    });
    if(unlock) {
      allVideos = this.unlockVideos({videos: allVideos});
    }
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
  async findById({videoId}) {
    const  video = await new IVideoFindById({videoId}).find(serviceLocator);
    return video;

  }
  async like({ _id, videoId }) {
    const video = await new IVideoFindById({ videoId }).find(serviceLocator);
    if(!video) throw 404;
    if (!video.thoseWhoLiked.includes(_id)) {
      video.thoseWhoLiked.push(_id);
      const likedVideo = await new IVideoLike({videoId, thoseWhoLiked: video.thoseWhoLiked}).like(serviceLocator);
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
  async unlike({ _id, videoId }) {
    const video = await new IVideoFindById({videoId}).find(serviceLocator);
    if(!video) throw 404;
    if (video.thoseWhoLiked.includes(_id)) {
      const thoseWhoLiked = video.thoseWhoLiked.filter((subscriberId) => {
        return subscriberId != _id;
      });
      const likedVideo = await new IVideoLike({videoId, thoseWhoLiked: thoseWhoLiked}).like(serviceLocator);
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
  async findLikedsBySubscriber({ _id, page = 1, unlock = false }) {
    const videos = await  new IVideoFindAll({subscriberId:_id, page}).find(serviceLocator)
    let videosLikeds = videos.filter((video) => {
      if (
        video.thoseWhoLiked.length &&
        video.thoseWhoLiked.includes(_id)
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
    if(unlock) {
      videosLikeds = this.unlockVideos({videos: videosLikeds});
    }
    return {count: videosLikeds.length, videos:videosLikeds.slice(skip, limit)}
  }
};
