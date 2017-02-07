require('dotenv').load()

module.exports = (mongoose) => {
  const name = 'User'
  const schema = new mongoose.Schema({
    // userId: { type: mongoose.Schema.ObjectId, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    roles: { type: Array, default: process.env.USER_ROLES_DEFAULT.split(',') }
  }, {
    timestamps: true
  })

  return mongoose.model(name, schema)
}
