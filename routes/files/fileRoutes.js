const express = require('express');
const router = express.Router();

const uploadFileController = require('../../controllers/file/uploadFileController');
const viewFileController=require('../../controllers/file/viewFileController')

// POST /upload
router.get('/files/:userId',viewFileController.viewFiles);

router.get('/:userId/:filename',viewFileController.viewFile);

router.post('/upload',uploadFileController);



module.exports = router;