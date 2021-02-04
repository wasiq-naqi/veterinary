const multer  = require('multer');
const { CreateDirectoryIfNotExist } = require('../functions');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      
        let slashes = (process.env.APP_SERVER.toLowerCase() == 'window') ? '\\' : '/';
        // let slashes = path.sep;

        let date = new Date();
        let dir = __dirname + slashes + "../public" + slashes;

        dir = dir + file.mimetype.split('/')[0] + 's' + slashes;
        dir = dir + date.getFullYear() + slashes;
        dir = dir + (date.getMonth() + 1) + slashes;

        CreateDirectoryIfNotExist(dir);

        file.newFile = `${file.mimetype.split('/')[0]}s${slashes}${date.getFullYear()}${slashes}${(date.getMonth() + 1)}${slashes}`;
        file.newFileType = `${file.mimetype.split('/')[0]}`;
        // console.log(file.newFileDir);
        cb(null, dir);
      
    },
    filename: (req, file, cb) => {

        let nameArray = file.originalname.split('.');
        let date = new Date();
        let newFileName = date.getTime() + '.' + nameArray[nameArray.length - 1];

        file.newFile = file.newFile + newFileName;
        cb(null, newFileName);

    }
});

module.exports = multer ({ storage: storage });