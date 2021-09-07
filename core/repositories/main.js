"use strict";
const SessionRepositorieMongo = require("./SessionRepositorieMongo");
const VideoRepositorieMongo = require("./VideoRepositoriesMongo");
const SubscriberRepositorieMongo = require("./SubscriberRepositorieMongo");
const MeetingRepositoryMongo = require("./MeetingRepositorieMongo");
const TherapyRepositoryMongo = require("./TherapyRepositorieMongo");

module.exports = {
  sessionRepository: new SessionRepositorieMongo(),
  videoRepository: new VideoRepositorieMongo(),
  subscriberRepository: new SubscriberRepositorieMongo(),
  meetingRepository: new MeetingRepositoryMongo(),
  therapyRepository: new TherapyRepositoryMongo(),
};
