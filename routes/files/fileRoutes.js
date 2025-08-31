const express = require('express');
const router = express.Router();

const uploadFileController = require('../../controllers/file/uploadFileController');
const viewFileController=require('../../controllers/file/viewFileController')

// POST /upload
router.get('/:userId/:filename',viewFileController);

router.post('/upload',uploadFileController);



module.exports = router;