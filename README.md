###Project title
Instagralbums

###Team member names
Arthur Che  
Carinne Johnson  
Sonali Sharma

###Team member responsibilities
Arthur - worked with the Instagram API to display the most recent public photos; handled final integration and debugging of team members' code  
Carinne - created page2 to display the photos of the selected album; worked on CSS styles and presentation  
Sonali - responsible for the main page – layout, creation of albums from delicious by fetching tags, creating placeholder for albums and then putting images inside the albums. Creating new albums and validating
the album name against dictionary.

###Project description
Instagralbums allows the user to create albums and drag/drop Instagram photos into them. The albums are user-defined, but during creation the names of the albums are checked against a dictionary to correct spelling/provide suggestions. Individual photos are saved as Delicious bookmarks tagged with the album name so they can be re-accessed using a Delicious login.

###Our approach
We met as a group to determine the concept for the project and then divided the tasks into three discrete segments, which we worked on individually. We reconvened midway through the project to share our progress and also used github to collaborate and share work.

###Which of Cory Doctorow's strawmen did you try to address
People are stupid. By providing a dictionary check of tag names, we ensured that users entered real words, spelled correctly.

This project was based on controlled vocabulary where users create tags, which are often misspelled or are redundant. This is an attempt to solve the vocabulary problem by ensuring the following:

1) Users place items in predefined categories to ensure uniformity and reduce redundancy. In our application we display the already existing photo albums to the user, in which user can drag and drop additional
photographs from Instagram.  
2) User is given an option to create a new album, however to ensure that there are no misspelt names, the name are checked against a dictionary and the user is allowed to create only meaningful names.

###Technologies used on the project
HTML5  
CSS3  
jQuery  
jQueryUI  
Instagram API  
Delicious API  
Merriam Webster Dictionary API  

###URL of the repository on github
https://github.com/sonalisharma/IOLabProject2 

###Live URL of where it's hosted
http://arthurche.com/projects/instagralbums/

###Browser support
Chrome  
Safari  
Firefox  
IE 7  

###Bugs/quirks we're aware of
-Cannot test albums names that have multiple words. While testing the names in loop the javascript was giving an error. This can be implemented as a future enhancement.  
-The "create album" modal isn't a true modal (you can still click the stuff around it). Couldn't quite get the true modal working, would be able to sort it out with a bit more time.  
-Originally, we wanted to make the "Create New Album" box droppable, but ran into some issues with that based on how we implemented the album creation.  
-There's currently no way stop Instagralbums from re-loading photos you have already added to an album before when doing a refresh on the API.