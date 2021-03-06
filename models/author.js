let mongoose = require('mongoose');
let moment = require('moment');

let Schema = mongoose.Schema;

let AuthorSchema = new Schema(
  {
    first_name: {type: String, required: true, max: 100},
    family_name: {type: String, required: true, max: 100},
    date_of_birth: {type: Date, default: Date.now},
    date_of_death: {type: Date, default: Date.now},
  }
);

// Virtual for author's full name
AuthorSchema
.virtual('name')
.get(function () {

// To avoid errors in cases where an author does not have either a family name or first name
// We want to make sure we handle the exception by returning an empty string for that case

  let fullname = '';

  if (this.first_name && this.family_name) {
    fullname = this.family_name + ', ' + this.first_name
  }

  if (!this.first_name || !this.family_name) {
    fullname = '';
  }

    return fullname;
  });


  // Virtual for author's lifespan
  AuthorSchema
  .virtual('date_of_birth_formatted')
  .get(function () {
    return moment(this.date_of_birth).format('MMMM Do, YYYY');
  });

  // Virtual for author's lifespan
  AuthorSchema
  .virtual('date_of_death_formatted')
  .get(function () {
    return moment(this.date_of_death).format('MMMM Do, YYYY');
  });


  // Virtual for author's lifespan
  AuthorSchema.virtual('lifespan').get(function() {
  var lifetime_string = '';

  if (this.date_of_birth) {
    lifetime_string = moment(this.date_of_birth).format('MMMM Do, YYYY');
  }

  lifetime_string += ' - ';

  if (this.date_of_death) {
    lifetime_string += moment(this.date_of_death).format('MMMM Do, YYYY');
  } else { lifetime_string += 'Present'}

  return lifetime_string;
});


// Virtual for author's URL
AuthorSchema
.virtual('url')
.get(function () {
  return '/catalog/author/' + this._id;
});

//Export model
module.exports = mongoose.model('Author', AuthorSchema);
