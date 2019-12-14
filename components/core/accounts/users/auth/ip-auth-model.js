const db = require('../../../../../data/dbConfig.js');

module.exports = {
  processIp
};


async function processIp(ip){
  const banned = await checkBanned(ip)
  if(!banned) {
    const requests = await checkRequests(ip)
    if(requests.length < 15) {
      const log = await logIp(ip)
      return true
    } else {
      const ban = await banIp(ip)
      return false
    }
  } else {
    return false
  }
}

function logIp(ip){
  return db('ip_logs')
  .insert({ip_address: ip})
}

function banIp(ip){
  return db('ip_bans')
  .insert({ip_address: ip})
}

function checkRequests(ip){
  return db('ip_logs')
  .where('ip_address', ip)
  .where('created_at', '>', oneHourAgo().toISOString())
}

function checkBanned (ip){
  return db('ip_bans')
  .where('ip_address', ip)
  .first()
  .then(res => res ? true : false)
}

const oneHourAgo = () => {
  const HOUR = 1000 * 60 * 60;
  return new Date(Date.now() - HOUR);
}