const express = require('express');
const router = express.Router();

router.get('/quickmeme', (req, res, next) => {
	const file = `${__dirname}/upload-folder/quickmeme.7z`;
	res.download(file); // Set disposition and send it.
});

module.exports = router;
