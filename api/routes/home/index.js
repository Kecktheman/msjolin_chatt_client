const express = require('express');
const path = require('path');
const router = express.Router();
const axios = require('axios');
var url = require('url');
/* const server = require('http').Server(express);
const io = require('socket.io')(server); */

const refreshTokenTime = 3600 * 1000; // 60min
let apiCode = null;
let apiToken = null;

router.get('/', (req, res, next) => {
	// 1 - Get lokin apiCode from spotify. Refresh each hour
	const redirectUrl = encodeURIComponent('https://msjolin.azurewebsites.net/');
	const clientId = '96c3cbd838fb4d0391862b80acf801f7';
	console.log(apiCode);

	/* if (apiToken == null) {
		var scopes = 'user-read-private user-read-email';
		res.redirect(
			'https://accounts.spotify.com/authorize' +
				'?response_type=code' +
				'&client_id=' +
				clientId +
				(scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
				'&redirect_uri=' +
				redirectUrl
		);
		apiCode = req.query.code;
		console.log(apiCode);
	}
 */
	// 2 - If api code is set, then fetch token on pageload

	/* 	setTimeout(() => {
		getCode();
	}, refreshTokenTime); */

	if (apiCode != null) {
		console.log('inside');

		function getToken() {
			const getTokenUrl = 'https://accounts.spotify.com/api/token';
			const redirectUri = 'https://msjolin.azurewebsites.net/';

			const spClientId = '96c3cbd838fb4d0391862b80acf801f7';
			const spClientSc = '71a63117f872444da92ae4efe172b0a3';
			let spAuthorization = `${spClientId}:${spClientSc}`;
			spAuthorization = Buffer.from(spAuthorization).toString('base64');

			axios({
				method: 'POST',
				url: getTokenUrl,
				params: {
					'grant_type': 'authorization_code',
					'code': apiCode,
					'redirect_uri': redirectUri,
					'client_secret': spClientSc,
					'client_id': spClientId
				},
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			})
				.then(response => {
					console.log('response:', response);
					apiToken = response.access_token;
					res.redirect('/?token=' + apiToken);
				})
				.catch(err => {
					console.error('Woops', err);
				});

			setTimeout(() => {
				// Refresh apiToken each hour
				getToken();
			}, refreshTokenTime);
		}

		res.sendFile(path.join(__dirname + '/index.html'));
	} else {
		console.log('no response code', apiCode, apiToken);

		res.sendFile(path.join(__dirname + '/index.html'));
	}
});

module.exports = router;
