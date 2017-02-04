module.exports = (mongoose) => {
  const name = 'Post'
  const schema = new mongoose.Schema({
    // userId: { type: mongoose.Schema.ObjectId, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }
  }, {
    timestamps: true
  })

  return mongoose.model(name, schema)
}
