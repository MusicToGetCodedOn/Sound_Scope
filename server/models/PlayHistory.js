const mongoose = require('mongoose');

const playHistorySchema = new mongoose.Schema({
  userId: { type: String, required: true, index: true },
  trackId: String,
  trackName: String,
  artistName: String,
  albumName: String,
  durationMs: Number,
  playedAt: { type: Date, required: true }, // Wann wurde es gehört?
  image: String
});

// WICHTIG: Ein Zusammengesetzter Index sorgt dafür, dass wir denselben Song 
// zur selben Zeit nicht doppelt speichern (Duplikate vermeiden).
playHistorySchema.index({ userId: 1, playedAt: 1 }, { unique: true });

module.exports = mongoose.model('PlayHistory', playHistorySchema);