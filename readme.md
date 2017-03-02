#Pass-a-Fist

A completely bonkers game where you give people life-altering injuries with magnificent fight cards. 


###The Setup N-tier

***NOTE:*** This project is going to take a while

***NOTE:*** **This project is going to take a while**

##***NOTE:*** **This project is going to take a while**

Perhaps on of the most important skills to obtain on your road to becoming a Software Engineer is the ability to work on large projects. Especially when those larger projects have a code scaffolding that has been set up by someone other than yourself. It is important to be able to jump into the mix of a development teams build and disect what everything is doing. 

As we move into these larger projects we are also going to start enforcing stricter guidelines to help teach the concepts of Object Oriented Programming.

You will notice that there are two main directories in this project. One for the frontend and the other is for the server. Having these distinct directories helps create a separation of concerns. To help cement this even further you will want to open up two instances of vscode, one for each directory. 

You will know you have opened the folders correctly when you can press `f5` to start the server and `ctrl/cmd+shift+b` to start the client.

The goal of each of these projects is to be decoupled from each other. Meaning your web front-end should have no idea if your backend ever has to change databases, switch servers, or any number of other things that can often occur. Likewise our backend server shouldn't care at all about what JS-Flavor-of-the-Week-Framework we are using, or even if requests are coming from a mobile application. 

![n-tier](http://www.amzi.com/articles/youbet_architecture.gif)


###The Server
On the server we are utilizing a node-mongodb setup with express sessions and a mongoose ORM. The server side code has been setup in a somewhat oppionated architecture that will help and hinder you. You will want to make sure that you work within the confines of what has been setup for you to this point. 

###The WWW Client
The Web client has been setup to utilize one of the shiney new javascript frameworks Vuejs. There are several advantages to using this setup but again it will force you into utilizing a structure that you may not be ver comfortable with. 


###Feature Requests (AKA your tasks)

Pass-a-Fist has so many things going for it, which means there are going to be a ton of features. 

We will start with the simple stuff, like having players login, connect to a game session and have cards in their hand, then we will move to implementing game mechanics, such as figuring out how to sync players with a turn-based system that cannot be abused on the front-end. 


If you aren't logged in, the page will redirect you to a login page, which also has a link to register. Each user will have a name, email, age, password, and *choice of badge* for others to see in-game. 

A user/player should be able to join, leave, and create game sessions. A game should know all players in its session, when to start the game, and how to manage each player's turn. Within a game session, all players will be synced up to socket.io chat. Players will also be able to chat with eachother in the game session (unless they give you the cold shoulder), and each time an event is recorded, it will be logged in the chat. 


There are two different types of cards: Fighting cards and injury cards. When the game starts, it should shuffle the deck and give all players 5 fight cards. A player should be able to draw a fight card on their turn by default, play **Attack** cards on their turn by default, and have the option to play a **Counter** card or take an **Injury** by default. An injury card should change the player's total injury count by default. A player with 3 injuries will no longer be able to play, but can still remain in the game session (unless you rage-quit). 

When one player remains, the game will know to end itself and declare a winner. Wins are stored in the database for players. Other things will also be stored for the player (like how many times they were beat with the ugly stick). 
