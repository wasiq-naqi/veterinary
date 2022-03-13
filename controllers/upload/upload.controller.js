const { Errors, GenerateHash } = require('../../functions');
const { Upload } = require('../../middlewares');

exports.upload = async (req, res) => {

    try{

        const upload = Upload.single('file');
        upload(req, res, async err => {

            if(err) return Errors(res, Excp);
            else if(!(req.file)) return Errors(res, new Error('Failed to upload file'));
            else res.send({ fileName: req.file.newFile })
        });

    }
    catch(Excp){
        return Errors(res, Excp);
    }
    
}