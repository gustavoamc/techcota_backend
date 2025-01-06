const multer = require("multer");
const path = require("path");

// Destination to store image
const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `public/logos/`);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); //TODO: review naming
  },
});

const imageUpload = multer({
  storage: imageStorage,
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg)$/)) { //TODO: limit size ? (x and y, not MBs)
      // upload only png and jpg format
      return cb(new Error("Por favor, envie apenas png ou jpg!"));
    }
    cb(undefined, true);
  },
});

module.exports = { imageUpload };
