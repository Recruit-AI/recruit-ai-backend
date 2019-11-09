const express = require('express');

const Logs = require('../userLogs/log-model.js');

const {user_restricted, mod_restricted, admin_restricted} = require('../users/restricted-middleware.js')

const router = express.Router();

router.get('/all', user_restricted, admin_restricted, (req, res) => {
  Logs.find()
  .then(logs => {
    res.json(logs);
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get logs' });
  });
});

router.get('/unconfirmed', user_restricted, admin_restricted, (req, res) => {
  Logs.findUnconfirmed()
  .then(logs => {
    res.json(logs);
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get logs' });
  });
});

router.get('/:id', user_restricted, admin_restricted, (req, res) => {
  const { id } = req.params;

  Logs.findById(id)
  .then(log => {
    if (log) {
      res.json(log)
    } else {
      res.status(404).json({ message: 'Could not find log with given id.' })
    }
  })
  .catch(err => {res.status(500).json({ message: 'Failed to get logs' });});
});

router.put('/:id/undo', user_restricted, admin_restricted, async (req, res) => {
  const user_id = req.decodedToken.user.user_id
  const id = req.params.id
  const notes = req.body.notes
  const updatedLog = await Logs.update( {notes, log_confirmed: false, log_confirming_user_id: user_id} , id)

  let classInfo = {}

  //Return the database and the name of the id field
  switch(updatedLog.route) {
    case "/api/symbols":
      classInfo = {Db: require('../symbols/symbol-model'), id: 'symbol_id'}
      break;
    case "/api/symbols/connections":
      classInfo = {Db: require('../symbols/resources/symbolConnections/symbol_connection-model'), id: 'symbol_connection_id'}
      break;
    case "/api/symbols/pantheons":
      classInfo = {Db: require('../symbols/resources/symbolPantheons/symbol_to_pantheon-model'), id: 'symbols_to_pantheon_ids'}
      break;
    case "/api/pantheons":
      classInfo = {Db: require('../pantheons/pantheon-model'), id: 'pantheon_id'}
      break;
    case "/api/pantheons/histories":
      classInfo = {Db: require('../pantheons/resources/pantheonHistories/pantheon_history-model'), id: 'pantheon_history_id'}
      break;
    case "/api/kinds":
      classInfo = {Db: require('../kinds/kind-model'), id: 'kind_id'}
      break;
    case "/api/kinds/pantheons":
      classInfo = {Db: require('../kinds/resources/kindPantheons/kind_to_pantheon-model'), id: 'kind_pantheon_id'}
      break;
    case "/api/categories":
      classInfo = {Db: require('../categories/category-model'), id: 'cateogory_id'}
      break;
    case "/api/categories/pantheons":
      classInfo = {Db: require('../categories/resources/categoryPantheons/category_to_pantheon-model'), id: 'category_to_pantheon_id'}
      break;
    case "/api/categories/symbols":
      classInfo = {Db: require('../categories/resources/categorySymbols/category_to_symbol-model'), id: 'category_to_symbol_id'}
      break;
    case "/api/categories/kinds":
      classInfo = {Db: require('../categories/resources/categoryKinds/category_to_kind-model'), id: 'category_to_kind_id'}
      break;
    case "/api/categories/prerequisites":
      classInfo = {Db: require('../categories/resources/categoryPrerequisites/category_prerequisite-model'), id: 'category_prerequisite_id'}
      break;
    case "/api/sources":
      classInfo = {Db: require('../sources/symbol-model'), id: 'source_id'}
      break;
    case "/api/images":
      classInfo = {Db: require('../images/image-model'), id: 'image_id'}
      break;

  }

  let Db = classInfo.Db
  let idString = classInfo.id
  let ret = {}

  switch(updatedLog.method) {
    case "POST":
      ret = await Db.remove(updatedLog.changes[idString])
      break;
    case "PUT":
      ret = await Db.update(updatedLog.previous, updatedLog.object_id)
      break;
    case "DELETE":
      delete updatedLog.previous[idString]
      ret = await Db.add(updatedLog.previous)
      break;
  }

  res.json(ret)

})

router.put('/:id/confirm', user_restricted, admin_restricted, async (req, res) => {
  const user_id = req.decodedToken.user.user_id
  const id = req.params.id
  const notes = req.body.notes
  res.json(await Logs.update( {notes, log_confirmed: true, log_confirming_user_id: user_id} , id))
})

module.exports = router;
