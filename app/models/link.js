var db = require('../config');
var crypto = require('crypto');

var linkSchema = new db.Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: { type: Number, default: 0},
  created_at: { type: Date, default: Date.now}
});

linkSchema.pre('save', function(next) {
  console.log('before saving');
  next();
});

// Schema maps data from MongoDB into Javascript Objects
db.Link = Link = mongoose.model('Link', linkSchema);

var Link = db.Model.extend({
  tableName: 'urls',
  hasTimestamps: true,
  defaults: {
    visits: 0
  },
  initialize: function(){
    this.on('creating', function(model, attrs, options){
      var shasum = crypto.createHash('sha1');
      shasum.update(model.get('url'));
      model.set('code', shasum.digest('hex').slice(0, 5));
    });
  }
});

module.exports = Link;
