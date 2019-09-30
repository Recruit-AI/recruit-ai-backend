
exports.seed = function(knex) {
  const big_array = [];

  ["Pantheon", "Kind", "Category", "Symbol"].map(it => {
    const array = []
    for(var i = 1; i < 14; i++){
      big_array.push( {
          foreign_id: i,
          foreign_class: it,
          image_url: "http://res.cloudinary.com/scaredsleepless/image/upload/v1569787956/al5xdygzxgfnvd4yzs0m.jpg",
          thumbnail: true,
          image_title: "The Thumbnail of this object",
          image_description: "this is where a description will go for the thing when it is the time to put it there."
      } )
      big_array.push( {
          foreign_id: i,
          foreign_class: it,
          image_url: "http://res.cloudinary.com/scaredsleepless/image/upload/v1569787956/al5xdygzxgfnvd4yzs0m.jpg",
          thumbnail: false,
          image_title: "The Thumbnail of this object",
          image_description: "this is where a description will go for the thing when it is the time to put it there."
      } )
      big_array.push( {
          foreign_id: i,
          foreign_class: it,
          image_url: "http://res.cloudinary.com/scaredsleepless/image/upload/v1569787956/al5xdygzxgfnvd4yzs0m.jpg",
          thumbnail: false,
          image_title: "The Thumbnail of this object",
          image_description: "this is where a description will go for the thing when it is the time to put it there."
      } )
    }
  })

  return knex('images').insert(big_array);

};
