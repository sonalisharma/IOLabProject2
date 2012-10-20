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

$(document).ready(function() {
  var j =1;
  var delicioustags=[];

     $('#signin').click(function() {
                    
                    var username = $('#username').val();
                    var password=$('#password').val();
                    if(!username || !password)
                    {
                      alert("Please enter a valid username and password");
                    }
                  else{
                    //alert("Hello");
                    // This cross-domain request requires that you use '?callback=?' because it is done using JSONP
                    $.getJSON('http://feeds.delicious.com/v2/json/' + username + '?callback=?',
                     function(json){
                      if(json.length ==0)
                      {
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

                        //alert(delicioustags.length);
                       createDivs(delicioustags,username);
    //  $('#new-trail li').draggable({revert: true}); 
                    });
                    return false;

}


                });
        $('.circleBase').droppable({
          accept: 'li',
          drop: function(event, ui) {
              // Don't confuse ul, the <ul> unordered-list with ui, the user interface element
              // .draggable('disable') says that we want to remove the draggable behavior
              alert("hello");
          $(ui.draggable).draggable('disable').css({top: '0px', left: '0px'}).appendTo($(this));
             }
        }
        );

   // Use jQuery UI to make the #new-trail div droppable




            $('#new').click(function() {
                  
                  $("#top-content").fadeOut(1000);
                  $("#center-content").fadeOut(1000);
                  $("#bottom-content").fadeOut(1000);
                  $('#newalbumdiv').css("display","");
                  return false;

                });

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


             $('#save-album').click(function() {

              //alert("inside form");
              var flag=0;
              var newhtml;
              var trailname= $("#save-trail-name").val();
              //  http://api.wordreference.com/0.8/0990b/json/enfr/
                 $.getJSON('http://api.wordreference.com/0.8/0990b/json/enfr/' + trailname + '?callback=?',
                     function(data){
                            //var fileDom = $(data);
                           // alert("inside test read");
                            //alert(data.length);

                            if(data.Error )
                            {
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
                            else
                            {
                              newhtml='<li><div id='+trailname+' class=circleBase><a href=#><p>'+trailname+'</p></a></div></li>'
                                $("#albums").append(newhtml);
                                $('#error').text('');
                                $('#newalbumdiv').fadeOut(1000);
                                $('#newalbumdiv').css("display","none");
                                $("#top-content").fadeIn(1000);
                                $("#center-content").fadeIn(1000);
                                $("#bottom-content").fadeIn(1000);
                                 $('#newalbumdiv').css("display","");
                             
                            }


                         
                           return false;
                        });

              });


 });
 function createDivs(deltags,username) {
  var i=1;
  var theHtml=""; 
  //var re = ['/trail:.*/', '/^(step:.*)/'];
    var j;
    len = deltags.length;
    out = [];
    arrout=[];
    obj = { };

    for (j = 0; i < len; i++) 
    {
      obj[deltags[i]] = 0;
    }
  for (k in obj) {
      out.push(k);
  }
  //alert(out.length);
  k=0;
   $.each(out, function(index, value) {  
          if(!out[index].match(/(step:).*/))
          {
            arrout[k]= value.replace('trail:','');;
            value.replace('trail:','');
            theHtml += '<li><div id='+ arrout[k]+' class=circleBase><a href="https://www.google.com" target="_blank"><p>'+ arrout[k]+'</p></a></div></li>';
            
             $("#albums").append(theHtml);
             theHtml='';
             //alert(arrout[k]);
             addContent(arrout[k]);
              k++;
          }
     });

    // Make the new album divs droppable
    $('.circleBase').droppable({
      accept: 'li',
      drop: function(event, ui) {
        // Resize thumbnail to 50x50
        $(ui.draggable).find("img")
          .attr({width: '50px', height: '50px'
        }); 
        // Append thumbnail to album
        $(ui.draggable)
          .draggable('disable')
          .css({top: '0px', left: '0px'})
          .appendTo($(this));
      }
    });
          
}
function addContent(a1)
{
 
  var username = $('#username').val();
  var h="";
  //alert("http://feeds.delicious.com/v2/json/" + username + "/"+a1);

 $.getJSON('http://feeds.delicious.com/v2/json/' + username + '/'+a1+'?callback=?',
                     function(json){
                      //alert("json length:"+json.length);
                      //alert("inside json");
                        $(json).each(function(index) {
                           //alert("inside json function");
                            // this.u // url
                            // this.d // description
                            // this.n // extended notes
                            // this.t // array of tags
                           // alert(this.t);
                                  var u = this.u
                                  var chkimg = u.substr(u.length - 3);
                                  if(chkimg == 'jpg')
                                  {
                                    h+= '<li><img src="'+this.u+'" height="50" width="50" /></li>';
                                  }
                                  chkimg="";
                                 h='<ul>'+h+'</ul>';
                                 //alert("inside loop h"+h);

                                          });
                                 // h = '<ul>'+h+'</ul>';
                   
                                  //alert("h************:"+h);  
                                  $('#'+a1).append(h);
                    });

}


