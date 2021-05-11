const mongoose = require('mongoose');

const cardsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true,
    },
    likes: {
      type: Array,
      default: [],
    },
    ceatedAt: {
      type: Date,
      default: () => new Date(),
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('card', cardsSchema);
