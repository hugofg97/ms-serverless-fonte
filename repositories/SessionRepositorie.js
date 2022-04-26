"use strict";
const { ISessionRepository, ISession } = require("../gatways/sessions/ISession");
const SessionModel = require("../entitys/sessions");
const uuid = require('uuid');
const bcrypt = require('bcrypt')
module.exports = class ISessionRepository {
 
  async create({ name, description, tag }) {
    console.log("<<<<<<<<<<<<<<<<<<<<")
    console.log('aaa',name, description, tag)
    const salt = bcrypt.genSaltSync(10);
    const crypt = bcrypt.hashSync(name + description + tag, salt).substring(15, 20).replace(/\./g, '-').replace(/\//g, '-');;
    const session = await SessionModel.connectDb.create({
      _id: `${uuid.v1()}-${crypt}`,
      name,
      description,
      tag,
    });
    return new ISession({
      _id: session._id,
      name: session.name,
      description: session.description,
      tag: session.tag,
    });;
  }
  async findAll({ tag, limit }) {
    const sessions = await SessionModel.connectDb
      .query('tag')
      .eq(tag.toUpperCase())
      .where('deletedAt')
      .not()
      .exists()
      .limit(limit)
      .exec();
    return sessions.map((session) => {
      return new ISession({
        _id: session._id,
        name: session.name,
        description: session.description,
        tag: session.tag,
      });
    });
  }
  async findByName({name}) {
    const [session] = await SessionModel.connectDb
      .query('name')
      .eq(name)
      .where('deletedAt')
      .not()
      .exists()
      .exec();
    if (!session) return false;
    return new ISession({
      _id: session._id,
      name: session.name,
      description: session.description,
      tag: session.tag,
    });
  }
  async countSessionPerTag({ tag }) {

    const { count } = await SessionModel.connectDb
      .query('tag')
      .eq(tag.toUpperCase())
      .where('deletedAt')
      .not()
      .exists()
      .count()
      .exec();
    return count

  }
  async pagination({ page, tag }) {
    page = parseInt(page);
    const skip = page === 1 ? 10 : 10 * (page - 1);
    const { count } = await SessionModel.connectDb
      .query('tag')
      .eq(tag.toUpperCase())
      .where('deletedAt')
      .not()
      .exists()
      .count()
      .exec();
    if (page >= 2 && skip >= count) return [];

    let sessions = await SessionModel.connectDb
      .query('tag')
      .eq(tag.toUpperCase())
      .where('deletedAt')
      .not()
      .exists()
      .limit(skip)
      .exec();
    if (page > 1) {
      const { lastKey } = sessions;
      sessions = await SessionModel.connectDb
        .query('tag')
        .eq(tag.toUpperCase())
        .where('deletedAt')
        .not()
        .exists()
        .limit(10).startAt(lastKey).exec();
    }
    return sessions.map((session) => {
      return new ISession({
        _id: session._id,
        name: session.name,
        description: session.description,
        tag: session.tag,
      });
    });
  }
};
