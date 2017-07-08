import multer from 'multer';
import fs from 'fs';
import path from 'path';

/* funtion to check supported image extensions */
const fileFilter = (req, file, cb) => {
  /* accept image only */
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error('Only image files are allowed'), false);
  }
  cb(null, true);
};

/* storge for avatar */
const avatarStorage = multer.diskStorage({
  'destination': '/uploads/avatar/',
  'filename': (req, file, cb) => {
    const uploadedFileName = file.originalname.split('.');
  	const fileName = uploadedFileName[0];
  	const ext = uploadedFileName[1];

    cb(null, `${fileName}-${Date.now()}-${req.user._id}-avatar.${ext}`);
  }
});

/* required config for avatar upload */
export const avatarUpload = multer({
  'storage': avatarStorage,
  'limits': {
		'fileSize': 3000000
	},
  'onFileSizeLimit': function (file) {
    /* delete the partially written file */
    fs.unlink(path.join(__dirname, `./../../${file.path}`));
  },
  fileFilter
}).single('avatar');