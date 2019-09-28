
exports.seed = function(knex) {
  const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin nulla eget risus vestibulum, a molestie diam facilisis. Curabitur auctor tortor in porta pretium. Suspendisse sed massa non ex venenatis ornare. Nullam faucibus cursus nisl, eget accumsan eros aliquam at. Praesent ornare tincidunt neque, vel pharetra metus maximus imperdiet. Integer justo velit, malesuada a orci quis, viverra imperdiet dui. Fusce id sapien tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque et erat vel felis posuere condimentum ut sit amet turpis. Vestibulum gravida ultricies nunc quis viverra. Fusce quis tempus urna, et ornare lacus. Integer nec nunc consectetur, viverra purus in, euismod massa. Nullam at egestas nulla, quis posuere risus. Nullam consequat, mi sed porttitor ultricies, turpis turpis posuere ipsum, interdum finibus turpis justo a enim. Ut ac dictum lectus. Vestibulum nisi purus, porta in posuere at, scelerisque vitae mi. Mauris vitae arcu tortor. Aliquam ut risus vel magna hendrerit fringilla et vitae turpis. Curabitur ut nisi dapibus, tempus mauris in, tristique elit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean id risus fermentum, commodo nibh nec, posuere diam. Proin nunc dui, auctor non sodales a, fermentum quis enim. Curabitur sit amet lectus eleifend, elementum dolor et, consectetur libero. Nunc et semper massa, sed mattis dui. Aliquam quam magna, ultricies vel dui at, posuere semper felis. Mauris suscipit turpis in aliquet iaculis. Ut posuere augue vitae elit condimentum, id tempor odio iaculis. Fusce scelerisque consequat nulla sed ultrices. Suspendisse vehicula ligula nec felis bibendum ornare. Pellentesque vel dictum libero. Donec vehicula tellus risus, et suscipit arcu venenatis a. Sed id nunc nisi. Sed ligula arcu, semper ac metus a, fringilla lacinia tortor. Proin condimentum nunc ac nulla pretium lobortis. Proin finibus diam quis condimentum imperdiet. Suspendisse ante tellus, finibus quis eleifend eget, lobortis eget nibh. Suspendisse pulvinar dapibus odio nec ornare. Phasellus mollis diam at dignissim accumsan."

  return knex('pantheons').insert([
    //1
    {
      pantheon_name: "Egyptian",
      pantheon_description: "The culture of Egypt has thousands of years of recorded history. Ancient Egypt was among the earliest civilizations in Middle East and Africa. For millennia, Egypt maintained a strikingly unique, complex and stable culture that influenced later cultures of Europe.",
      pantheon_overview_text: text,
      pantheon_history_text: text,
      pantheon_culture_text: text,
      start_year: -3150,
      end_year: 2100
    },
    //2
    {pantheon_name: "Judiasm",
    pantheon_description: "An ancient, monotheistic, Abrahamic religion with the Torah as its foundational text. It encompasses the religion, philosophy, and culture of the Jewish people.",
    pantheon_overview_text: text,
    pantheon_history_text: text,
    pantheon_culture_text: text,
    start_year: -1800,
    end_year: 2100},
    //3
    {pantheon_name: "Christianity",
    pantheon_description: "An Abrahamic monotheistic religion based on the life and teachings of Jesus of Nazareth.",
    pantheon_overview_text: text,
    pantheon_history_text: text,
    pantheon_culture_text: text,
    start_year: 100,
    end_year: 2100},
    //4
    {pantheon_name: "Occult",
    pantheon_description: `The occult is "knowledge of the hidden" or "knowledge of the paranormal", as opposed to facts and "knowledge of the measurable", usually referred to as science.`,
    pantheon_overview_text: text,
    pantheon_history_text: text,
    pantheon_culture_text: text,
    start_year: 1600,
    end_year: 2100},
    //5
    {pantheon_name: "Wicca",
    pantheon_description: "a form of modern paganism, especially a tradition founded in England in the mid 20th century and claiming its origins in pre-Christian religions.",
    pantheon_overview_text: text,
    pantheon_history_text: text,
    pantheon_culture_text: text,
    start_year: 1910,
    end_year: 2100},
    //6
    {pantheon_name: "Greek",
    pantheon_description: "Ancient Greece was a civilization belonging to a period of Greek history that lasted from the Archaic period of the 8th to 6th centuries BC to the end of antiquity.",
    pantheon_overview_text: text,
    pantheon_history_text: text,
    pantheon_culture_text: text,
    start_year: -300,
    end_year: 400},
    //7
    {pantheon_name: "Roman",
    pantheon_description: "Ancient Rome was a thriving civilization that began growing on the Italian Peninsula as early as the 8th century BC.",
    pantheon_overview_text: text,
    pantheon_history_text: text,
    pantheon_culture_text: text,
    start_year: -800,
    end_year: 800},
    //8
    {pantheon_name: "Hindiusm",
    pantheon_description: "A major religious and cultural tradition of South Asia, which developed from Vedic religion.",
    pantheon_overview_text: text,
    pantheon_history_text: text,
    pantheon_culture_text: text,
    start_year: -3500,
    end_year: 2100},
    //9
    {pantheon_name: "Buddhism",
    pantheon_description: "A widespread Asian religion or philosophy, founded by Siddartha Gautama in northeastern India in the 5th century BC.",
    pantheon_overview_text: text,
    pantheon_history_text: text,
    pantheon_culture_text: text,
    start_year: -300,
    end_year: 2100},
    //10
    {pantheon_name: "Traditional/Folk",
    pantheon_description: "Just general humans doing humans stuff",
    pantheon_overview_text: text,
    pantheon_history_text: text,
    pantheon_culture_text: text,
    start_year: -10000,
    end_year: 2100},
    //11
    {pantheon_name: "Gnostic",
    pantheon_description: "Just general humans doing humans stuff",
    pantheon_overview_text: text,
    pantheon_history_text: text,
    pantheon_culture_text: text,
    start_year: -10000,
    end_year: 2100},
    //12
    {pantheon_name: "Norse",
    pantheon_description: "Just general humans doing humans stuff",
    pantheon_overview_text: text,
    pantheon_history_text: text,
    pantheon_culture_text: text,
    start_year: -10000,
    end_year: 2100}

  ]);
};
