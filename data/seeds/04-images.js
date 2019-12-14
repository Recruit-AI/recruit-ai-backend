
exports.seed = function(knex) {

    let objects = []
    let baseImage = {
      image_url: "https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwjFxtL81bPmAhVXXc0KHbPQCEEQjRx6BAgBEAQ&url=http%3A%2F%2Fsaveabandonedbabies.org%2Ftestimonal%2Fsubmitted-by-one-of-our-dedicated-volunteers%2Fdefault%2F&psig=AOvVaw3UCRJNLXmE7fdhr_6sF-o7&ust=1576362455293938",
      image_kind: 'thumbnail',
      image_title: 'Thumbnail Image',
      image_description: 'An image uploaded by this user',
      image_source: "Original Upload"
    }

    for(var i=1;i<10;i++) {
      objects.push({...baseImage, foreign_class: "User", foreign_id: i})
    }
    for(var j=1;j<8;j++) {
      objects.push({...baseImage, foreign_class: "SiteBlog", foreign_id: i})
    }

    return knex('images').insert(objects);
  };
  