var db = require('../config');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');


var userSchema = new db.Schema({
  username: String,
  password: String,
  created_at: { type: Date, default: Date.now},
});

userSchema.pre('save', function(next) {
  var self = this;

  console.log('before saving');
  bcrypt.hash(self.password,null, null, function(err,hash) {
    self.password = hash;
    next();
  });
});

// Schema maps data from MongoDB into Javascript Objects
db.Person = Person = mongoose.model('Person', userSchema);



var User = db.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  initialize: function(){
    this.on('creating', this.hashPassword);
  },
  comparePassword: function(attemptedPassword, callback) {
    bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
      callback(isMatch);
    });
  },
  hashPassword: function(){
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.get('password'), null, null).bind(this)
      .then(function(hash) {
        this.set('password', hash);
      });
  }
});

module.exports = User;
