

$(document).ready(function() {
  var j =1;
  var delicioustags=[];

     $('#signin').click(function() {
                    
                    var username = $('#username').val();
                    //alert("Hello");
                    // This cross-domain request requires that you use '?callback=?' because it is done using JSONP
                    $.getJSON('http://feeds.delicious.com/v2/json/' + username + '?callback=?',
                     function(json){
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
                });
        $('#top-content li img').draggable({revert: true});
        $('.circleBase').droppable({
          //accept: 'li',
          drop: function(event, ui) {
              // Don't confuse ul, the <ul> unordered-list with ui, the user interface element
              // .draggable('disable') says that we want to remove the draggable behavior
              alert("hello");
          $(ui.draggable).draggable('disable').css({top: '0px', left: '0px'}).appendTo('#newalbum');
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

              alert("inside form");
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
                               $('#error').text("Sorry looks like this is not a valid word!!");
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
                                    h+= '<img src="'+this.u+'" height="50" width="50" />';
                                  }
                                  chkimg="";
                                 
                                 //alert("inside loop h"+h);

                                          });
                                 // h = '<ul>'+h+'</ul>';
                   
                                  //alert("h************:"+h);  
                                  $('#'+a1).append(h);
                    });

}
