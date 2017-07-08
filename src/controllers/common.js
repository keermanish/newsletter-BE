import path from 'path';

/**
 * controller to get uploaded files/images
 * GET /uploads/:type (avatar)/:file (file name)
 */
export const getUploadedFiles = (req, res) => {
  if(req.params.type && req.params.file) {
    res.sendFile(path.join(__dirname, './../../uploads', req.params.type, req.params.file));
  } else {
    res.status(404).send('no such file or directory');
  }
};