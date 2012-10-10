// Request popular photos from Instagram API, append 12 of them to the Instagram div on index page
$.ajax({
        type: "GET",
        dataType: "jsonp",
        cache: false,
        url: "https://api.instagram.com/v1/media/popular?client_id=a5f175ca507b49d5b009c8ad53c057dc&access_token=2038329.a5f175c.44acf3cf29d14357a416eed15e5475bd",
        success: function(data) {
        	for (var i = 0; i < 12; i++) {
        		$("#instagram").append("<a target='_blank' href='" + data.data[i].link + "'><img src='" + data.data[i].images.thumbnail.url +"'></img></a>");
        		console.log(data.data[i].link);
        	};
        }
    });


