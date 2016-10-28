/**
 * For use in multiple locations
 */

module.exports = {
	testingMode: true,
	mongoPort: 27017,
	localPort: 5000,
	brightwaterDropboxTeamId: 'dbtid:AADIihV4QHYt6wCTX1MN2VVwJmdBDiv7tc4',
	localCallback: 'http://localhost:' + this.localPort + '/api/v2/auth/dropbox/callback',
	herokuCallback: 'http://saguaroqbtester.herokuapp.com/auth/dropbox/callback',
	mongoUri: 'mongodb://localhost:' + this.mongoPort + '/saguaro',
}