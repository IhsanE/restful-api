$('#AllTweets').click(function() {
    $.get( "/getAllTweets", function( data ) {
        $('.right').text(JSON.stringify(data, null, '  '));
    });
});

$('#AllUsers').click(function() {
    $.get( "/getAllUsers", function( data ) {
        $('.right').text(JSON.stringify(data, null, '  '));
    });
});

$('#AllExternalLinks').click(function() {
    $.get( "/getAllExternalLinks", function( data ) {
        $('.right').text(JSON.stringify(data, null, '  '));
    });
});

$('#UserExpandedURL').click(function() {
    $.get( "/getAllUserExpandedURL", function( data ) {
        $('.right').text(JSON.stringify(data, null, '  '));
    });
});

$('#TweetInformation').click(function() {
    $.post( "/getTwitterID", JSON.stringify({"id" : $("#twitterID").val()}))
      .done(function( data ) {
          $('.right').text(JSON.stringify(data, null, '  '));
          $("#twitterID").val('');
      });
});

$('#UserInformation').click(function() {
    $.post( "/getUserByScreenName", JSON.stringify({"screen_name" : $("#screenName").val()}))
      .done(function( data ) {
          $('.right').text(JSON.stringify(data, null, '  '));
          $("#screenName").val('');
      });
});
