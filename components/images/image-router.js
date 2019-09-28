const express = require('express');

const Images = require('./image-model.js');

const {user_restricted, mod_restricted, admin_restricted} = require('../middleware.js')

const multer = require('multer')

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './uploads/')
  },
  filename: function(req, file, cb){
    const new_name = new Date().getTime() + file.originalname
    cb(null, new_name)
  }
})

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

const upload = multer({storage: storage, limits: {
  fileSize: 1024 * 1024 * 5,
}, fileFilter: fileFilter})

const router = express.Router();


router.get('/', (req, res) => {
  Images.find()
  .then(images => {
    res.json(images);
  })
  .catch(err => {
    res.status(500).json({ message: 'Failed to get images' });
  });
});


router.get('/:id', (req, res) => {
  const { id } = req.params;

  Images.findById(id)
  .then(image => {
    if (image) {
      res.json(image)
    } else {
      res.status(404).json({ message: 'Could not find image with given id.' })
    }
  })
  .catch(err => {res.status(500).json({ message: 'Failed to get images' });});
});


router.post('/', user_restricted, upload.single('image_raw'), (req, res) => {
  const imageData = req.body;
  const imageFile = req.file;

  imageData.thumbnail = !!imageData.thumbnail

  if (imageFile) {
    imageData.image_url = imageFile.path.replace('uploads\\', "").replace('uploads/', "")

    Images.add(imageData)
    .then(image => {
      res.status(201).json(image);
    })
    .catch (err => {
      res.status(500).json({ message: 'Failed to create new image' });
    });
  } else {
    res.status(400).json({message: "Unsupported file type."})
  }
});


router.put('/:id', user_restricted, upload.single('image_raw'), (req, res) => {
  const { id } = req.params;
  const changes = req.body;
  const imageFile = req.file;

  if (imageFile) {
    changes.image_url = imageFile.path.replace('uploads\\', "").replace('uploads/', "")
  }

  Images.findById(id)
  .then(image => {
    if (image) {
      Images.update(changes, id)
      .then(updatedImage => {
        res.json(updatedImage);
      });
    } else {
      res.status(404).json({ message: 'Could not find image with given id' });
    }
  })
  .catch (err => {
    res.status(500).json({ message: 'Failed to update image' });
  });
});


router.delete('/:id', mod_restricted, (req, res) => {
  const { id } = req.params;
      Images.remove(id)
      .then(deleted => {
        res.send("Success.")
      })
      .catch(err => { res.status(500).json({ message: 'Failed to delete image' }) });
});

module.exports = router;
