
exports.seed = function(knex) {
  const string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin nulla eget risus vestibulum"
  const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin nulla eget risus vestibulum, a molestie diam facilisis. Curabitur auctor tortor in porta pretium. Suspendisse sed massa non ex venenatis ornare. Nullam faucibus cursus nisl, eget accumsan eros aliquam at. Praesent ornare tincidunt neque, vel pharetra metus maximus imperdiet. Integer justo velit, malesuada a orci quis, viverra imperdiet dui. Fusce id sapien tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque et erat vel felis posuere condimentum ut sit amet turpis. Vestibulum gravida ultricies nunc quis viverra. Fusce quis tempus urna, et ornare lacus. Integer nec nunc consectetur, viverra purus in, euismod massa. Nullam at egestas nulla, quis posuere risus. Nullam consequat, mi sed porttitor ultricies, turpis turpis posuere ipsum, interdum finibus turpis justo a enim. Ut ac dictum lectus. Vestibulum nisi purus, porta in posuere at, scelerisque vitae mi. Mauris vitae arcu tortor. Aliquam ut risus vel magna hendrerit fringilla et vitae turpis. Curabitur ut nisi dapibus, tempus mauris in, tristique elit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean id risus fermentum, commodo nibh nec, posuere diam. Proin nunc dui, auctor non sodales a, fermentum quis enim. Curabitur sit amet lectus eleifend, elementum dolor et, consectetur libero. Nunc et semper massa, sed mattis dui. Aliquam quam magna, ultricies vel dui at, posuere semper felis. Mauris suscipit turpis in aliquet iaculis. Ut posuere augue vitae elit condimentum, id tempor odio iaculis. Fusce scelerisque consequat nulla sed ultrices. Suspendisse vehicula ligula nec felis bibendum ornare. Pellentesque vel dictum libero. Donec vehicula tellus risus, et suscipit arcu venenatis a. Sed id nunc nisi. Sed ligula arcu, semper ac metus a, fringilla lacinia tortor. Proin condimentum nunc ac nulla pretium lobortis. Proin finibus diam quis condimentum imperdiet. Suspendisse ante tellus, finibus quis eleifend eget, lobortis eget nibh. Suspendisse pulvinar dapibus odio nec ornare. Phasellus mollis diam at dignissim accumsan."


  return knex('kinds').insert([
    //1
    {
    kind_name: "Tarot Cards",
    creator_pantheon_id: 10,
    kind_description: string,
    kind_application_theory_text: text,
    kind_background_history_text: text,
    specific_order: 1,
    total_number: 78,
    default_extra_info: JSON.stringify({"suit": ""})
    },
    //2
    {
    kind_name: "Hebrew Letters",
    creator_pantheon_id: 2,
    kind_description: string,
    kind_application_theory_text: text,
    kind_background_history_text: text,
    specific_order: 1,
    total_number: 22,
    default_extra_info: JSON.stringify({"sound": "", "value": "", "meaning": ""})
    },
    //3
    {
    kind_name: "Astrological Signs",
    creator_pantheon_id: 10,
    kind_description: string,
    kind_application_theory_text: text,
    kind_background_history_text: text,
    specific_order: 1,
    total_number: 78,
    default_extra_info: JSON.stringify({"mutability": "", "element": "", "symbol": "", "dates": ""})
    },
    //4
    {
    kind_name: "Chakras",
    creator_pantheon_id: 10,
    kind_description: string,
    kind_application_theory_text: text,
    kind_background_history_text: text,
    specific_order: 1,
    total_number: 7,
    default_extra_info: JSON.stringify({"location": ""})
    },
    //5
    {
    kind_name: "Dieties",
    creator_pantheon_id: 10,
    kind_description: string,
    kind_application_theory_text: text,
    kind_background_history_text: text,
    specific_order: 0,
    total_number: 0,
    default_extra_info: JSON.stringify({})
    },
    //6
    {
    kind_name: "Runes",
    creator_pantheon_id: 1,
    kind_description: string,
    kind_application_theory_text: text,
    kind_background_history_text: text,
    specific_order: 1,
    total_number: 24,
    default_extra_info: JSON.stringify({shape:"", sound:"", meaning:""})
    },
    //7
    {
    kind_name: "Trees",
    creator_pantheon_id: 1,
    kind_description: string,
    kind_application_theory_text: text,
    kind_background_history_text: text,
    specific_order: 0,
    total_number: 0,
    default_extra_info: JSON.stringify({})
    },
    //8
    {
    kind_name: "Herbs",
    creator_pantheon_id: 1,
    kind_description: string,
    kind_application_theory_text: text,
    kind_background_history_text: text,
    specific_order: 0,
    total_number: 0,
    default_extra_info: JSON.stringify({})
    },
    //9
    {
    kind_name: "Crystals",
    creator_pantheon_id: 1,
    kind_description: string,
    kind_application_theory_text: text,
    kind_background_history_text: text,
    specific_order: 0,
    total_number: 0,
    default_extra_info: JSON.stringify({})
    },
    //10
    {
    kind_name: "Metals",
    creator_pantheon_id: 1,
    kind_description: string,
    kind_application_theory_text: text,
    kind_background_history_text: text,
    specific_order: 0,
    total_number: 0,
    default_extra_info: JSON.stringify({})
    },
    //11
    {
    kind_name: "Elements",
    creator_pantheon_id: 1,
    kind_description: string,
    kind_application_theory_text: text,
    kind_background_history_text: text,
    specific_order: 0,
    total_number: 0,
    default_extra_info: JSON.stringify({})
    },
    //12
    {
    kind_name: "Planets",
    creator_pantheon_id: 1,
    kind_description: string,
    kind_application_theory_text: text,
    kind_background_history_text: text,
    specific_order: 1,
    total_number: 10,
    default_extra_info: JSON.stringify({})
    },
    //13
    {
    kind_name: "Values",
    creator_pantheon_id: 1,
    kind_description: string,
    kind_application_theory_text: text,
    kind_background_history_text: text,
    specific_order: 0,
    total_number: 0,
    default_extra_info: JSON.stringify({})
    },
    //14
    {
    kind_name: "Properties",
    creator_pantheon_id: 1,
    kind_description: string,
    kind_application_theory_text: text,
    kind_background_history_text: text,
    specific_order: 0,
    total_number: 0,
    default_extra_info: JSON.stringify({})
    },
    //15
    {
    kind_name: "Phenoms",
    creator_pantheon_id: 1,
    kind_description: string,
    kind_application_theory_text: text,
    kind_background_history_text: text,
    specific_order: 0,
    total_number: 0,
    default_extra_info: JSON.stringify({})
    },
    //16
    {
    kind_name: "Sepiroth",
    creator_pantheon_id: 1,
    kind_description: string,
    kind_application_theory_text: text,
    kind_background_history_text: text,
    specific_order: 0,
    total_number: 0,
    default_extra_info: JSON.stringify({})
    },
    //17
    {
    kind_name: "Days of The Week",
    creator_pantheon_id: 1,
    kind_description: string,
    kind_application_theory_text: text,
    kind_background_history_text: text,
    specific_order: 0,
    total_number: 0,
    default_extra_info: JSON.stringify({})
    },
    //18
    {
    kind_name: "Seasons",
    creator_pantheon_id: 1,
    kind_description: string,
    kind_application_theory_text: text,
    kind_background_history_text: text,
    specific_order: 0,
    total_number: 0,
    default_extra_info: JSON.stringify({})
    },
    //19
    {
    kind_name: "Directions",
    creator_pantheon_id: 1,
    kind_description: string,
    kind_application_theory_text: text,
    kind_background_history_text: text,
    specific_order: 0,
    total_number: 0,
    default_extra_info: JSON.stringify({})
    },
    //20
    {
    kind_name: "Divine Names",
    creator_pantheon_id: 1,
    kind_description: string,
    kind_application_theory_text: text,
    kind_background_history_text: text,
    specific_order: 0,
    total_number: 0,
    default_extra_info: JSON.stringify({})
    },
    //21
    {
    kind_name: "Teachings",
    creator_pantheon_id: 1,
    kind_description: string,
    kind_application_theory_text: text,
    kind_background_history_text: text,
    specific_order: 0,
    total_number: 0,
    default_extra_info: JSON.stringify({})
    },
    //22
    {
    kind_name: "Stories",
    creator_pantheon_id: 1,
    kind_description: string,
    kind_application_theory_text: text,
    kind_background_history_text: text,
    specific_order: 0,
    total_number: 0,
    default_extra_info: JSON.stringify({})
    },
    //23
    {
    kind_name: "Animals",
    creator_pantheon_id: 1,
    kind_description: string,
    kind_application_theory_text: text,
    kind_background_history_text: text,
    specific_order: 0,
    total_number: 0,
    default_extra_info: JSON.stringify({})
    },
    //24
    {
    kind_name: "Sources",
    creator_pantheon_id: 1,
    kind_description: string,
    kind_application_theory_text: text,
    kind_background_history_text: text,
    specific_order: 0,
    total_number: 0,
    default_extra_info: JSON.stringify({author:"",media:""})
    },
    //25
    {
    kind_name: "People",
    creator_pantheon_id: 1,
    kind_description: string,
    kind_application_theory_text: text,
    kind_background_history_text: text,
    specific_order: 0,
    total_number: 0,
    default_extra_info: JSON.stringify({birthday:"",deathday:"",othernames:""})
    }



  ]);
};
