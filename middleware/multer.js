
const multer  = require('multer')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      return cb(null,'./public/uploads')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      return cb(null, uniqueSuffix + '-' +  file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })
  module.exports = upload;