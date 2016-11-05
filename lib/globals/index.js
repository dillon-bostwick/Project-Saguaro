/**
 * For use in multiple locations
 */

var localCallbackUrl = 'http://localhost:5000/api/v2/auth/dropbox/callback';
var hostedCallbackUrl = 'http://saguaroqbtester.herokuapp.com/auth/dropbox/callback';
var dropboxTestToken = 'U5_NcoOJhOAAAAAAAAAANRwq6isw4tvF3xSyKJIYTOrm8Rua8AmqyM3yZnUgN1tZ';

module.exports = {
	testingMode: true,

	mongoPort: 27017,
	localPort: 5000,

	brightwaterDropboxTeamId: 'dbtid:AADIihV4QHYt6wCTX1MN2VVwJmdBDiv7tc4',
	
	mongoUri: 'mongodb://localhost:27017/saguaro',
	authCallbackUrl: process.env.PORT ? hostedCallbackUrl : localCallbackUrl,

	//these are all directories
	dropzonePath: '/dropzone',
	currentFilesPath: '/saguaro',
	archivePath: '/saguaro/archives',

	qbwcUsername: 'saguaro',
	qbwcPassword: 'saguaro',
	qbwcCompanyFile: 'Brighwater Homes',

	testUser: {
		firstName: 'Foo',
		lastName: 'Bar',
		_personalQueue: ["581b462c99dc7928f5198bba", "591b69b7cf124d43afd08d6c"],
		_groups: ["581b69b7cf124e43afd08d68", "581b69b7cf124d53afd08d6a"],
		canKey: true,
		isAdmin: true,
		currentToken: dropboxTestToken
	}
}
