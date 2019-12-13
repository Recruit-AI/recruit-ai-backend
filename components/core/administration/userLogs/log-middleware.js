function log(req, previous, changes = req.body || {}) {
  //'changes' can be passed in. If not, they default to req.body, and if that's empty, to an empty object.
  const route = req.baseUrl
  const method = req.method
  //Will be null on a post, however you can get the id from the changes.
  const object_id = req.params.id
  const log_submitting_user_id = req.decodedToken.user.user_id

  //If they are editing a record, make sure you only save what was actually changed
  if(req.method === "PUT") {
    let original = {}
    let actualChanges = {}
    //Map through the changes. If the change is different from the record, store it in separate objects.
    Object.entries(req.body).map(field => {
      if(previous[field[0]] != changes[field[0]]) {
        original[field[0]] = previous[field[0]]
        actualChanges[field[0]] = changes[field[0]]
      }
    })
    previous = original
    changes = actualChanges
  }

  const LogDb = require('./log-model.js.js')
  LogDb.add({changes, previous, log_submitting_user_id, route, method, object_id})

  return "Logged."
}

module.exports = {log}
