// Make API call to Instagram and pull currently popular public Instagram photos
$.ajax({
    type: 'GET',
    dataType: 'jsonp',
    cache: false,
    url: 'https://api.instagram.com/v1/media/popular?client_id=a5f175ca507b49d5b009c8ad53c057dc&access_token=2038329.a5f175c.44acf3cf29d14357a416eed15e5475bd',
    success: function(data) {
      $('#feed').empty();
      // Go through the first 12 results, and append them to #feed
      for (var i = 0; i < 12; i++) {
            var pic = data.data[i];
                picId = pic.id;
                picLink = pic.link;
                thumbUrl = pic.images.thumbnail.url;
            $('#feed').append('<li class="feedPic" id="' + picId + '"><a target="_blank" href="' + picLink + '"><img src="' + thumbUrl +'"></a></li>');
      };
      $('#instagram li').draggable({revert: true});
    }
});


// Function to make divs droppable and set drop events
function dropify(section){
  section.droppable({
    accept: 'li',
    drop: function(event, ui) {

      // Resize thumbnail to 50x50
      $(ui.draggable).find("img")
        .attr({width: '55px', height: '55px'
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
            alert("No existing albums detected. Go ahead and create some!");
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
          $('#instructions').text('Drag photos to your albums below to save them, and click the album name to view them.');

          // Re-create the new album creation div
          $('<li></li>').html('<div id="newalbum" class="circleBase1"><div style="margin-top:70px"><a href="#" id="new"><p>Create New Album</p></a></div></div>')
          .appendTo('#albums');

          // Event for clicking 'Create new album'
          $('#new').click(function() {
            // $("#description").fadeOut(0); 
            // $("#reload").fadeOut(0); 
            // $("#delicious").fadeOut(0);            
            // $("#instagram").fadeOut(0);
            // $("#gallery").fadeOut(0);
            $('#newalbumdiv').css("display","");
            return false;
          });

          // Create albums from bookmarks in Delicious account
          createDivs(delicioustags,username);

          // Make any newly created divs droppable
          dropify($('.circleBase'));

        });
      return false;
    }
  });


  // Event for clicking 'Load more photos'
  $('#more').click(function() {
    $.ajax({
        type: 'GET',
        dataType: 'jsonp',
        cache: false,
        url: 'https://api.instagram.com/v1/media/popular?client_id=a5f175ca507b49d5b009c8ad53c057dc&access_token=2038329.a5f175c.44acf3cf29d14357a416eed15e5475bd',
        success: function(data) {
          $('#feed').empty();
          // Go through the first 12 results, and append them to #feed
          for (var i = 0; i < 12; i++) {
                var pic = data.data[i];
                    picId = pic.id;
                    picLink = pic.link;
                    thumbUrl = pic.images.thumbnail.url;
                $('#feed').append('<li class="feedPic" id="' + picId + '"><a target="_blank" href="' + picLink + '"><img src="' + thumbUrl +'"></a></li>');
          };
          $('#instagram li').draggable({revert: true});
        }
    });
    return false;
  });

  // Function to retrieve user photos
  $('#loadUser').click(function() {
    var instauser = $('#instauser').val();
    var userurl = 'https://api.instagram.com/v1/users/search?q=' + instauser + '&access_token=2038329.a5f175c.44acf3cf29d14357a416eed15e5475bd';
    console.log(userurl)

    // API call to search username and retrieve an Instagram userid number
    $.ajax({
      
        type: 'GET',
        dataType: 'jsonp',
        cache: false,
        url: userurl,
        success: function(data) {
          var person = data.data[0];
              personId = person.id;
          console.log(person.id)
       
        // API call to get recent feed photos from that Instagram id
        $.ajax({
            type: 'GET',
            dataType: 'jsonp',
            cache: false,
            url: 'https://api.instagram.com/v1/users/' + personId + '/media/recent/?access_token=2038329.a5f175c.44acf3cf29d14357a416eed15e5475bd',
            success: function(data) {
              $('#feed').empty();
              // Go through the first 12 results, and append them to #feed
              for (var i = 0; i < 12; i++) {
                    var pic = data.data[i];
                        picId = pic.id;
                        picLink = pic.link;
                        thumbUrl = pic.images.thumbnail.url;
                    $('#feed').append('<li class="feedPic" id="' + picId + '"><a target="_blank" href="' + picLink + '"><img src="' + thumbUrl +'"></a></li>');
              };
              $('#instagram li').draggable({revert: true});
            }
         });
        }
    });
    return false;
  });


  // Event for clicking 'Cancel' in the new album popup
  $('#save-cancel').click(function() {
    $('#error').text('');
    $('#newalbumdiv').fadeOut(500);
    $('#newalbumdiv').css("display","none");
    $("#description").fadeIn(500); 
    $("#reload").fadeIn(500); 
    $("#instagram").fadeIn(500);
    $("#delicious").fadeIn(500);
    $("#gallery").fadeIn(500);
    $('#newalbumdiv').css("display","");
    return false;
  });

  // Event for clicking 'Save album' in the new album popup
  $('#save-album').click(function() {
    var flag=0;
    var newhtml;
    var trailname= $("#save-trail-name").val();
    
    // Check album name against dictionary API
    //  
    $.getJSON('http://api.wordreference.com/0.8/0990b/json/enfr/' + trailname + '?callback=?',
      function(data){
        console.log(data.Error);
        console.log(data);
        if(data.Error) {
           // var cssObj = {
           //                'background-color':'transparent',
           //                  'top': '20px', 
           //                  'left':'120px', 
           //                  'width': '300px', 
           //                  'font-size':'10pt',
           //                  'font-family':'times new roman',
           //                  'font-style':'italic',
           //                  'color':'red'
           //              }
           // $('#error').text("Sorry looks like this is not a valid word, Try again!!!").css(cssObj);
           // $('#newfeedlist').append('<li><p>NO DEFINITION</p></li>');
           alert('In the name of Cory Doctorow, please use a real English word!');
        }
        else {
          newhtml='<li><div id='+trailname+' class=circleBase><a href=#><p>'+trailname+'</p></a></div></li>'
          $("#albums").append(newhtml);
          $('#error').text('');
          $('#newalbumdiv').fadeOut(500);
          $('#newalbumdiv').css("display","none");
          $("#description").fadeIn(500); 
          $("#reload").fadeIn(500); 
          $("#instagram").fadeIn(500);
          $("#delicious").fadeIn(500);
          $("#gallery").fadeIn(500);
          $('#newalbumdiv').css("display","");
          dropify($('.circleBase'));
        }
        
        return false;
      });
    return false;
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
  dropify($('.circleBase'));

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

        if (chkimg == 'jpg') {
          h+= '<li><a href="'+this.u+'"><img src="'+this.n+'" height="55" width="55" /></a></li>';
        }
        
        chkimg="";
      });
      
      listOfImages = '<ul>'+h+'</ul>';
      $('#'+a1).append(listOfImages);
    });

  //use localStorage to store the username for use by the following linked page
  localStorage.setItem("storedUsername",username);  
}


