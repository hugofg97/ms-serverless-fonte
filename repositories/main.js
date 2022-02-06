"use strict";
const SessionRepositorie = require("./SessionRepositorie");
const VideoRepositorie = require("./VideoRepositories");
const SubscriberRepositorie = require("./SubscriberRepositorie");
const MeetingRepository = require("./MeetingRepositorie");
const TherapyRepository = require("./TherapyRepositorie");
const PagarmeRepository = require("./PagarmeRepositorie");

module.exports = {
  sessionRepository: new SessionRepositorie(),
  videoRepository: new VideoRepositorie(),
  subscriberRepository: new SubscriberRepositorie(),
  meetingRepository: new MeetingRepository(),
  therapyRepository: new TherapyRepository(),
  signatureRepository: new PagarmeRepository(),
};
