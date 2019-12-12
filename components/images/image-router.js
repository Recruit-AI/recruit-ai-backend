const express = require('express');

const Images = require('./image-model.js');

const {user_restricted, mod_restricted, admin_restricted} = require('../users/restricted-middleware.js')
const {log} = require('../userLogs/log-middleware.js')

const multer = require('../../config/multer')
const multerUploads = multer.multerUploads
const dataUri = multer.dataUri

const cloudinary = require('../../config/cloudinaryConfig')
const uploader = cloudinary.uploader
const cloudinaryConfig = cloudinary.cloudinaryConfig


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


router.post('/', user_restricted, multerUploads, cloudinaryConfig, (req, res) => {
  const imageData = req.body;
  const imageFile = req.file;


  //store the process image as a 'data-uri'
  const file = dataUri(req).content;

  //Uploading the image to cloudinary
  uploader.upload(file)
  .then((result) => {
    imageData.image_url = result.url;
    //Add the image to the database.
    Images.add(imageData)
        .then(image => {
          log(req, {}, image)
          res.status(201).json(image);
        })
        .catch (err => {
          res.status(500).json({ message: 'Failed to create new image' });
        });
  })
  .catch((err) => res.status(400).json({
    messge: 'someting went wrong while processing your request',
    data: { err }
  }))

});



router.put('/:id', user_restricted, multerUploads, cloudinaryConfig, (req, res) => {
  const { id } = req.params;
  const imageData = req.body;

  if(req.file) {
    const imageFile = req.file;
    //store the process image as a 'data-uri'
    const file = dataUri(req).content;
    //Uploading the image to cloudinary


    uploader.upload(file)
    .then((result) => {
      imageData.image_url = result.url;
      //Add the image to the database.
      Images.findById(id)
      .then(image => {
        if (image) {
          log(req, image) //Find a way to log that being a thumbnail again
          //If the incoming image is being set as thumnbnail, remove the current one.
          if(imageData.thumbnail) { Images.removeThumbnail(image) }
          Images.update(imageData, id)
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
    })
    .catch((err) => res.status(400).json({
      messge: 'someting went wrong while processing your request',
      data: { err }
    }))
  } else {
    Images.findById(id)
    .then(image => {
      if (image) {
        log(req, image) //Find a way to log that being a thumbnail again
        //If the incoming image is being set as thumnbnail, remove the current one.
        if(imageData.thumbnail) { Images.removeThumbnail(image) }
        Images.update(imageData, id)
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
  }


});


router.delete('/:id', user_restricted, mod_restricted, async (req, res) => {
  const { id } = req.params;

  log(req, await Images.findById(id) )
      Images.remove(id)
      .then(deleted => {
        res.send("Success.")
      })
      .catch(err => { res.status(500).json({ message: 'Failed to delete image' }) });
});

module.exports = router;
