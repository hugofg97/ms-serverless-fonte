"use strict";

const { isRequired } = require("../../core/libs/validator");

class IVideo {
  constructor({
    _id,
    sessionId,
    videoName,
    videoDescription,
    videoUrl,
    videoThumb,
    locked,
    thoseWhoLiked = [],
    likes
  }) {
    this._id = _id?? '';
    this.sessionId = isRequired(sessionId, 400);
    this.videoName = isRequired(videoName, 400);
    this.videoDescription = isRequired(videoDescription, 400);
    this.videoUrl = isRequired(videoUrl, 400);
    this.videoThumb = isRequired(videoThumb, 400);
    this.locked = locked === undefined || locked === null? false: true;
    this.thoseWhoLiked = thoseWhoLiked;
    this.likes = likes ?? 0
  }
  async create({videoRepository}){
    return await videoRepository.create({...this}); 
  }
  async update({videoRepository}) {
    return await videoRepository.update({...this});
  }
}

class IVideoFindById {
  constructor({
    videoId
  }) {
    this.videoId = isRequired(videoId,400);
  }
  async find({videoRepository}){
    return await videoRepository.findById({...this}); 
  }
  
}
class IVideoFindByName {
  constructor({
    videoName
  }) {
    this.videoName = isRequired(videoName,400);

  }
  async find({videoRepository}){

    return await videoRepository.findByName({...this}); 
  }
  
}
class IVideoFindAll {
  constructor({
    subscriberId,
    page
  }) {
    this.subscriberId = isRequired(subscriberId, 400);
    this.page = isRequired(page, 400);

  }
  async find({videoRepository}){
    return await videoRepository.findAll(); 
  }
  
}
class IVideoPagination {
  constructor({
    page,
    sessionId,
    subscriberId,
  }) {
    this.sessionId = isRequired(sessionId, 400);
    this.subscriberId = subscriberId??'';
    this.page = parseInt(page) ?? 1;

  }
  async pagination({videoRepository}){
    return await videoRepository.pagination({...this}); 
  }
  
}
class IVideoFindBestRanked {
  constructor({
    subscriberId
  }) {
    this.subscriberId = subscriberId??'';
  
 
  }
  async find({videoRepository}){
    return await videoRepository.rankedVideos({...this}); 
  }
  
}
class IVideoLike {
  constructor({
    videoId,
    thoseWhoLiked
  }) {
      this.videoId = isRequired(videoId, 400);
      this.thoseWhoLiked = thoseWhoLiked;

  }
  async like({videoRepository}){
    return await videoRepository.liked({...this}); 
  }
  
}
class IVideoCountPerSession {
  constructor({sessionId}) {
      this.sessionId = isRequired(sessionId, 400);
  }
  async count({videoRepository}){
    return await videoRepository.countVideosPerSession({...this}); 
  }
  
}



module.exports = {
  IVideoCountPerSession,
  IVideoFindBestRanked,
  IVideoFindAll,
  IVideoLike,
  IVideoFindById,
  IVideoPagination,
  IVideoFindByName,
  IVideo,
};
