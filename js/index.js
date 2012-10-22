// Make API call to Instagram and pull currently popular public Instagram photos
$.ajax({
    type: 'GET',
    dataType: 'jsonp',
    cache: false,
    url: 'https://api.instagram.com/v1/media/popular?client_id=a5f175ca507b49d5b009c8ad53c057dc&access_token=2038329.a5f175c.44acf3cf29d14357a416eed15e5475bd',
    success: function(data) {
      // Go through the first 14 results, and append them to #feed
      for (var i = 0; i < 14; i++) {
            var pic = data.data[i];
                picId = pic.id;
                picLink = pic.link;
                thumbUrl = pic.images.thumbnail.url;
            $("#feed").append('<li class="feedPic" id="' + picId + '"><a target="_blank" href="' + picLink + '"><img src="' + thumbUrl +'"></a></li>');
      };
      $('#top-content li').draggable({revert: true});
    }
});


// Function to make divs droppable and set drop events
function dropify(section){
  section.droppable({
    accept: 'li',
    drop: function(event, ui) {

      // Resize thumbnail to 50x50
      $(ui.draggable).find("img")
        .attr({width: '50px', height: '50px'
      }); 

      // Assemble data for Delicious
      var postData = {
          url: $(ui.draggable).find('a').attr('href'),
          description: $(ui.draggable).find('a').attr('href'),
          extended: $(ui.draggable).find("img").attr("src"),
          tags: $(this).attr("id"),
          method: "posts/add",
          username: $('#username').val(),
          password: $('#password').val()
      };

      // Save picture to Delicious
      $.getJSON("http://courses.ischool.berkeley.edu/i290-iol/f12/resources/trailmaker/delicious_proxy.php?callback=?",
      postData,
       function(rsp){
          if (rsp.result_code === "access denied") {
              alert('The provided Delicious username and password are incorrect.');
          } else if (rsp.result_code === "something went wrong") {
              alert('There was an unspecified error communicating with Delicious.');
          } else if (rsp.result_code === "done") {
                  alert ("Your photo has been saved!");
              }
          }
      );

      // Append thumbnail to album div
      $(ui.draggable)
        .draggable('disable')
        .css({top: '0px', left: '0px'})
        .appendTo($(this));
    }
  });
}


// Click functions on document ready
$(document).ready(function() {
  
  var j =1;
  var delicioustags=[];

  // Log in to Delicious account
  $('#signin').click(function() {
    var username = $('#username').val();
    var password=$('#password').val();
    if(!username || !password) {
      alert("Please enter a valid username and password");
    }
    else {
      // This cross-domain request requires that you use '?callback=?' because it is done using JSONP
      $.getJSON('http://feeds.delicious.com/v2/json/' + username + '?callback=?',
        function(json) {
          if(json.length ==0) {
            alert("Sorry no matching results found!");
          }

          $(json).each(function(index) {
            //this.u // url
            // this.d // description
            // this.n // extended notes
            // this.t // array of tags
            $.each(this.t, function(i, value) {  
              delicioustags[j]= value;
              j++;
              });
            });

          // Empty albums to clear them out when entering new Delicious credentials
          $('#albums').empty();

          // Re-create the new album creation div
          $('<li></li>').html('<div id="newalbum" class="circleBase1"><div style="margin-top:110px"><a href="#" id="new"><p>Create New Album</p></a></div></div>')
          .appendTo('#albums');

          // Create albums in Delicious account
          createDivs(delicioustags,username);
        });
      return false;
    }
  });

  // Make any newly created divs droppable
  dropify($('.circleBase'))

  // Event for clicking 'Create new album'
  $('#new').click(function() {                  
    $("#top-content").fadeOut(1000);
    $("#center-content").fadeOut(1000);
    $("#bottom-content").fadeOut(1000);
    $('#newalbumdiv').css("display","");
    return false;
  });

  // Event for clicking 'Cancel' in the new album popup
  $('#save-cancel').click(function() {
    $('#error').text('');
    $('#newalbumdiv').fadeOut(1000);
    $('#newalbumdiv').css("display","none");
    $("#top-content").fadeIn(1000);
    $("#center-content").fadeIn(1000);
    $("#bottom-content").fadeIn(1000);
    $('#newalbumdiv').css("display","");
    return false;
  });

  // Event for clicking 'Save album' in the new album popup
  $('#save-album').click(function() {
    var flag=0;
    var newhtml;
    var trailname= $("#save-trail-name").val();
    
    // Check album name against dictionary API
    // http://api.wordreference.com/0.8/0990b/json/enfr/
    $.getJSON('http://api.wordreference.com/0.8/0990b/json/enfr/' + trailname + '?callback=?',
      function(data){
        if(data.Error) {
           var cssObj = {
                          'background-color':'transparent',
                            'top': '20px', 
                            'left':'120px', 
                            'width': '300px', 
                            'font-size':'10pt',
                            'font-family':'times new roman',
                            'font-style':'italic',
                            'color':'red'
                        }
           $('#error').text("Sorry looks like this is not a valid word, Try again!!!").css(cssObj);
        }
        else {
          newhtml='<li><div id='+trailname+' class=circleBase><a href=#><p>'+trailname+'</p></a></div></li>'
          $("#albums").append(newhtml);
          $('#error').text('');
          $('#newalbumdiv').fadeOut(1000);
          $('#newalbumdiv').css("display","none");
          $("#top-content").fadeIn(1000);
          $("#center-content").fadeIn(1000);
          $("#bottom-content").fadeIn(1000);
          $('#newalbumdiv').css("display","");
          dropify($('.circleBase'));
        }
        
        return false;
      });

  });

  var name = localStorage.getItem("storedUsername");
  var album = localStorage.getItem("albumName");

 });


// Function to create album divs after loading Delicious account
function createDivs(deltags,username) {
  var i=1;
  var theHtml="";
  var j;
  len = deltags.length;
  out = [];
  arrout=[];
  obj = { };

  for (j = 0; i < len; i++) {
    obj[deltags[i]] = 0;
  }
  
  for (k in obj) {
    out.push(k);
  }

  k=0;
   
  $.each(out, function(index, value) {  
    if(!out[index].match(/(step:).*/)) {
      arrout[k]= value.replace('trail:','');
      value.replace('trail:','');
      theHtml += '<li><div id='+ arrout[k]+' class=circleBase><a href="page2.html" target="_blank"><p>'+ arrout[k]+'</p></a></div></li>';
      
      $("#albums").append(theHtml);
      theHtml='';
      addContent(arrout[k]);
      k++;
    }
  });

  // Make the new album divs droppable
  dropify($('.circleBase'))

  //use localStorage to store which album the user selects for display on the following linked page
  $('.circleBase').click(function() {
    var idName = $(this).attr("id");
    localStorage.setItem("albumName",idName);
    });   
}


// Function to fill new album divs with thumbnails based on Delicious data
function addContent(a1) {
 
  var username = $('#username').val();
  var h="";

  $.getJSON('http://feeds.delicious.com/v2/json/' + username + '/'+a1+'?callback=?',
    function(json){
      $(json).each(function(index) {
        // this.u // url
        // this.d // description
        // this.n // extended notes
        // this.t // array of tags
        var n = this.n
        var chkimg = n.substr(n.length - 3);

        if (chkimg == 'jpg' || chkimg == 'png') {
          h+= '<li><a href="'+this.u+'"><img src="'+this.n+'" height="50" width="50" /></a></li>';
        }
        
        chkimg="";
      });
      
      listOfImages = '<ul>'+h+'</ul>';
      $('#'+a1).append(listOfImages);
    });

  //use localStorage to store the username for use by the following linked page
  localStorage.setItem("storedUsername",username);  
}


