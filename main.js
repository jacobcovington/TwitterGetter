/* TwitterGetter
	* Copyright (c) 2011 Jacob Covington (jacobcovington.com)
	* Licensed under the BSD license.
	* Uses JavaScript Pretty Date from John Resig, info below
	*
	* INSTRUCTIONS:
	* $('your selector').getTweets(twitterID, numberOfTweets, addUserInfo?)
	* 'your selector': where you want the tweets added. Tweets will replace the content of the element
	* twitterID: ID of the twitter user. For @covington, use 'covington'
	* numberOfTweets: number of tweets you want to display (ex: 5). Defaults to 3
	* addUserInfo?: do you want to add user pic, name, and a link the feed? If not, put false here (leaving it blank defaults to true)
	*/

(function($) {  
	$.fn.getTweets = function(twitId, numTweets, userinfo) {
		var $this = $(this);
		numTweets = numTweets || 3; // default # of tweets to 3
		userinfo = typeof(userinfo) === 'undefined' || userinfo; // if userinfo isn't set to false, we'll add it to $this
		
		// get the twitters
		$.getJSON('http://search.twitter.com/search.json?from=' + twitId + '&rpp=' + numTweets + '&callback=?', function(data) {
			var links = /\bhttp:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-z]{2,3}(\/\S+)/gi;
			var tweets = $.map(data.results, function(twit, i) {
					var time = prettyDate(twit.created_at)
					,	reTweet = 'http://twitter.com/?status=@' + twitId + '%20&in_reply_to=' + twitId + '&in_reply_to_status_id=' + twit.id
					, tttwit = twit.text
				;
				// make the links and hashes links
				tttwit = twit.text.replace(/http:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-z]{2,3}\/\S+/gi, '<a href="$&">$&</a>');
				tttwit = tttwit.replace(/\s(#)(\w+)/g, ' <a href="http://search.twitter.com/search?q=%23$2" target="_blank">#$2</a>');
				// construct the tweet
				var item = '<li>' 
					+ '<p>' + tttwit + '</p>'
					+ ' <span class="time">' + time + '</span>'
					+ ' <a href="' + reTweet + '" class="retweet">reply</a>'
					+ '</li>';
				return item;
			});
			
			// Add list of tweets for each $this
			var twitters = $('<ul>', {
				className: 'tweets',
				html : tweets.join('\n')
			}).replaceAll($this.children())
			if (userinfo) { // add 
				$this.prepend('<img class="twitimg" src="' + data.results[0].profile_image_url + '" ><p class="whotwit">' + data.results[0].from_user + '</p>').append('<p class="jointwit"><a href="http://twitter.com/' + data.results[0].from_user + '">join the conversation</a></p>');
			}
				
		});
		return $this;
	};
	
	/*
	 * JavaScript Pretty Date
	 * Copyright (c) 2008 John Resig (jquery.com)
	 * Licensed under the MIT license.
	 */

	// Takes an ISO time and returns a string representing how
	// long ago the date represents.
	function prettyDate(time){
		var date = new Date((time || "").replace(/-/g,"/").replace(/[TZ]/g," ")),
			diff = (((new Date()).getTime() - date.getTime()) / 1000),
			day_diff = Math.floor(diff / 86400);
				
		if ( isNaN(day_diff) || day_diff < 0 || day_diff >= 31 )
			return;
				
		return day_diff === 0 && (
				diff < 60 && "just now" ||
				diff < 120 && "1 minute ago" ||
				diff < 3600 && Math.floor( diff / 60 ) + " minutes ago" ||
				diff < 7200 && "1 hour ago" ||
				diff < 86400 && Math.floor( diff / 3600 ) + " hours ago") ||
			day_diff == 1 && "Yesterday" ||
			day_diff < 7 && day_diff + " days ago" ||
			day_diff < 31 && Math.ceil( day_diff / 7 ) + " weeks ago";
	}

})(jQuery);  