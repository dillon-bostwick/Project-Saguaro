/**
 * For use in multiple locations
 */

var localCallbackUrl: 'http://localhost:5000/api/v2/auth/dropbox/callback',
var herokuCallbackUrl: 'http://saguaroqbtester.herokuapp.com/auth/dropbox/callback',

module.exports = {
	testingMode: true,

	mongoPort: 27017,
	localPort: 5000,


	brightwaterDropboxTeamId: 'dbtid:AADIihV4QHYt6wCTX1MN2VVwJmdBDiv7tc4',
	dropboxTestToken: 'U5_NcoOJhOAAAAAAAAAANRwq6isw4tvF3xSyKJIYTOrm8Rua8AmqyM3yZnUgN1tZ',
	mongoUri: 'mongodb://localhost:27017/saguaro',
	authCallbackUrl: process.env.PORT ? herokuCallbackUrl : localCallbackUrl


	dropzoneFilesPath: '/dropzone',
	currFilesPath: '/saguaro',
	archivedFilesPath: '/saguaro/archives'
}
