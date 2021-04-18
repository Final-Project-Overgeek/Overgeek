const router = require('express').Router();;
const { upload, uploadFile, getFileStream, unlinkFile } = require('../cloudStorage/index');
const fs = require('fs');

router.get('/data/:key', (req, res) => {
  const key = req.params.key;
  const readStram = getFileStream(key)
  
  readStram.pipe(res)
})

router.post('/uploadVideos', upload.single('video'), async (req, res) => {
  const file = req.file;
  // console.log(file);

  const result = await uploadFile(file);
  await unlinkFile(file.path)
  console.log('UPLOAD VIDEO');
  console.log(result);
  fs.writeFileSync('./key.csv', result.Key)

  res.send(`/data/${result.Key}`)
})

router.post('/uploadImages', upload.single('video'), async (req, res) => {
  const file = req.file;
  // console.log(file);

  const result = await uploadFile(file);
  await unlinkFile(file.path)
  console.log('UPLOAD IMAGE');
  console.log(result);
  fs.writeFileSync('./key.csv', result.key)

  res.send(`/data/${result.key}`)
})

module.exports = router;