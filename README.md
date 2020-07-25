# chat-loc.github.io
This app aims to solve the need of connecting users, who share the same nationality and ethnicity and happen to be in close proximity.

***

# Community Application

## Group Members

1. [Khush](#Khushboo-Umrigar)
2. [Amandeep Singh](#amandeep-singh)
3. [Kay](#ibiyemi-kayode)


# Khushboo Umrigar

After using slack application for a while, my idea is to create a collabrative app where 
1. all the user can chat
2. share the files. 
3. Having a to-do list feature will be a great addition to that. 
  3. In the to-do list we can assign task by selecting a person name and can assign deadline for the same.
4. link with google calender or apple reminders to have reminer set for upcoming meetings or other important stuff

My ides is very simple yet have all the necessary features that a collaborative application should have with a clear and easy to understand, user friendly layout.


# Ibiyemi Kayode 

**This is a proposition for a chat application bound to a user's location**. This app aims to solve the need of connecting with users, who happen to share the same nationality and ethnicity and are in close proximity. This would work well in an event or a get-together or something similar. The user will not need to search. The app would automatically generate users that meet this criteria. This will be great to connect to people of similar origin, especially in a divers metro like Toronto. More so because it does feel great to get affiliated with people who speak the same language and share the same origin.

There will be a login system to capture the details of the users. And the details that will be captured are nationality detail and tribe detail of the users. Some other data that will be requested are the name of the user and an indicator of his interest and / or mood. They will always have to fill in their 'mood' for every session they log in, so other users can better get an insight on how to tailor their chats if eventually they connect. Names of the be mood may be as follows: 'burned out', 'flexible', 'cant wait', 'just online' etc.

As highlighted, the third consideration for this app is distance. This application will only 'lock in' users who are within a 1-mile perimeter. The application will create a catalogue of users that meet this criteria. The closest possible users will be on top of the stack. When users fall out of the perimeter, a disconnection triggers. In similar vein, when users have actually struck up a connection, there would be a warning if they are on the threshold of disconnecting. In the event there is a connection, the application will try to improve the chat flow if there are delays in the chat or there are infrequencies or simply put: a lack of 'vibe'. The application will have to listen for chat drabness and try to help users by making suggestions of news or current events by lifting some words in the chats and running a search query or fetching from some data source e.g. a News-headline API.

The application will work with NodeJS. Socket.io and Express server will be used to publicly expose endpoints and intercept and send back appropriate responses. Mongoose will be used as the object modelling tool for database items and Atlas as the MongoDB clour provider.


# Amandeep Singh

In order to make a collab app the ideas which i got after doing  some research on different collab platforms available are as follow:

* There should a particular page which include all the users in a team with there contact details and work assigned to them. Then there should be a status column which high lights there progress of particular project, time spent.

* users on same projects can create there chat group which can be linked to the project. here they have an option to send attachments too.

* will try to integrate it with slack api so that users can get updates about the changes in there projects.
