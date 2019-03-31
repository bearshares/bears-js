var bears = require('../lib');

bears.api.getAccountCount(function(err, result) {
	console.log(err, result);
});

bears.api.getAccounts(['dan'], function(err, result) {
	console.log(err, result);
	var reputation = bears.formatter.reputation(result[0].reputation);
	console.log(reputation);
});

bears.api.getState('trending/bearshares', function(err, result) {
	console.log(err, result);
});

bears.api.getFollowing('ned', 0, 'blog', 10, function(err, result) {
	console.log(err, result);
});

bears.api.getFollowers('dan', 0, 'blog', 10, function(err, result) {
	console.log(err, result);
});

bears.api.streamOperations(function(err, result) {
	console.log(err, result);
});

bears.api.getDiscussionsByActive({
  limit: 10,
  start_author: 'thecastle',
  start_permlink: 'this-week-in-level-design-1-22-2017'
}, function(err, result) {
	console.log(err, result);
});
