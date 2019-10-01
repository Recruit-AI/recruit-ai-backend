
exports.seed = function(knex) {
  const string = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin nulla eget risus vestibulum"
  const text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin nulla eget risus vestibulum, a molestie diam facilisis. Curabitur auctor tortor in porta pretium. Suspendisse sed massa non ex venenatis ornare. Nullam faucibus cursus nisl, eget accumsan eros aliquam at. Praesent ornare tincidunt neque, vel pharetra metus maximus imperdiet. Integer justo velit, malesuada a orci quis, viverra imperdiet dui. Fusce id sapien tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque et erat vel felis posuere condimentum ut sit amet turpis. Vestibulum gravida ultricies nunc quis viverra. Fusce quis tempus urna, et ornare lacus. Integer nec nunc consectetur, viverra purus in, euismod massa. Nullam at egestas nulla, quis posuere risus. Nullam consequat, mi sed porttitor ultricies, turpis turpis posuere ipsum, interdum finibus turpis justo a enim. Ut ac dictum lectus. Vestibulum nisi purus, porta in posuere at, scelerisque vitae mi. Mauris vitae arcu tortor. Aliquam ut risus vel magna hendrerit fringilla et vitae turpis. Curabitur ut nisi dapibus, tempus mauris in, tristique elit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean id risus fermentum, commodo nibh nec, posuere diam. Proin nunc dui, auctor non sodales a, fermentum quis enim. Curabitur sit amet lectus eleifend, elementum dolor et, consectetur libero. Nunc et semper massa, sed mattis dui. Aliquam quam magna, ultricies vel dui at, posuere semper felis. Mauris suscipit turpis in aliquet iaculis. Ut posuere augue vitae elit condimentum, id tempor odio iaculis. Fusce scelerisque consequat nulla sed ultrices. Suspendisse vehicula ligula nec felis bibendum ornare. Pellentesque vel dictum libero. Donec vehicula tellus risus, et suscipit arcu venenatis a. Sed id nunc nisi. Sed ligula arcu, semper ac metus a, fringilla lacinia tortor. Proin condimentum nunc ac nulla pretium lobortis. Proin finibus diam quis condimentum imperdiet. Suspendisse ante tellus, finibus quis eleifend eget, lobortis eget nibh. Suspendisse pulvinar dapibus odio nec ornare. Phasellus mollis diam at dignissim accumsan."


  return knex('symbols').insert([
    {
      symbol_name: "The Magician",
      symbol_kind_id: 1,
      symbol_description: string,
      symbol_overview_text: text,
      other_spellings: "",
      symbol_meaning_text: text,
      order_number: 1,
      extra_info: JSON.stringify({suit: "Major Arcana"})
    },
    {
      symbol_name: "The Fool",
      symbol_kind_id: 1,
      symbol_description: string,
      symbol_overview_text: text,
      other_spellings: "",
      symbol_meaning_text: text,
      order_number: 1,
      extra_info: JSON.stringify({suit: "Major Arcana"})
    },
    {
      symbol_name: "The High Priestess",
      symbol_kind_id: 1,
      symbol_description: string,
      symbol_overview_text: text,
      other_spellings: "",
      symbol_meaning_text: text,
      order_number: 3,
      extra_info: JSON.stringify({suit: "Major Arcana"})
    },
    {
      symbol_name: "Aleph",
      symbol_kind_id: 2,
      symbol_description: string,
      symbol_overview_text: text,
      other_spellings: "Alef",
      symbol_meaning_text: text,
      order_number: 1,
      extra_info: JSON.stringify({"sound": "Silent", "value": "1", "meaning": "Ox"})
    },
    {
      symbol_name: "Beit",
      symbol_kind_id: 2,
      symbol_description: string,
      symbol_overview_text: text,
      other_spellings: "Beyt",
      symbol_meaning_text: text,
      order_number: 2,
      extra_info: JSON.stringify({"sound": "B/v", "value": "2", "meaning": "House"})
    },
    {
      symbol_name: "Gimel",
      symbol_kind_id: 2,
      symbol_description: string,
      symbol_overview_text: text,
      other_spellings: "",
      symbol_meaning_text: text,
      order_number: 3,
      extra_info: JSON.stringify({"sound": "G", "value": "3", "meaning": "Camel"})
    },
    {
      symbol_name: "Virgo",
      symbol_kind_id: 3,
      symbol_description: string,
      symbol_overview_text: text,
      other_spellings: "",
      symbol_meaning_text: text,
      order_number: 7,
      extra_info: JSON.stringify({"mutability": "Stable", "element": "Earth", "symbol": "Virgin", "dates": "Aug 23-Sept 24"})
    },
    {
      symbol_name: "Cancer",
      symbol_kind_id: 3,
      symbol_description: string,
      symbol_overview_text: text,
      other_spellings: "",
      symbol_meaning_text: text,
      order_number: 5,
      extra_info: JSON.stringify({"mutability": "Mutable", "element": "Water", "symbol": "Crab", "dates": "June 23 - July 24"})
    },
    {
      symbol_name: "Scorpio",
      symbol_kind_id: 3,
      symbol_description: string,
      symbol_overview_text: text,
      other_spellings: "",
      symbol_meaning_text: text,
      order_number: 9,
      extra_info: JSON.stringify({"mutability": "Cardinal", "element": "Water", "symbol": "Scorpion", "dates": "Oct 23-Nov 24"})
    },
    {
      symbol_name: "Lakshmi",
      symbol_kind_id: 5,
      symbol_description: string,
      symbol_overview_text: text,
      other_spellings: "",
      symbol_meaning_text: text,
      order_number: 0,
      extra_info: JSON.stringify({})
    },
    {
      symbol_name: "Shiva",
      symbol_kind_id: 5,
      symbol_description: string,
      symbol_overview_text: text,
      other_spellings: "",
      symbol_meaning_text: text,
      order_number: 0,
      extra_info: JSON.stringify({})
    },
    {
      symbol_name: "Thoth",
      symbol_kind_id: 5,
      symbol_description: string,
      symbol_overview_text: text,
      other_spellings: "",
      symbol_meaning_text: text,
      order_number: 0,
      extra_info: JSON.stringify({})
    },
    {
      symbol_name: "Hecate",
      symbol_kind_id: 5,
      symbol_description: string,
      symbol_overview_text: text,
      other_spellings: "",
      symbol_meaning_text: text,
      order_number: 0,
      extra_info: JSON.stringify({})
    }

  ]);
};
