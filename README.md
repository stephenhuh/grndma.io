grndma.io
========
*Speed Dial- for Apps and Services*
Aaron Leon, Kyle Mattimore, Stephen Huh, Ryan Hamilton
------------

A lovingly personalized approach to helping your grand[ma|pa] get up with the tech services we young'ns take for granted. Inspired by Kyle’s grandma’s 90th birthday, a few days before the hackathon. 
grndma.io uses a dynamically generated phone tree with IVR to serve the needs of the elderly i.e. Transportation (Uber), Food (GrubHub), Laundry, Groceries. Services can be tailored by tech-savvy family and friends, and utilized by anyone with a landline or basic cellphone (powered by Twilio).\
Technology:
--
* MEAN Stack : MongoDB, ExpressJS, AngularJS, NodeJS
* Twilio allows us to dynamically create an incredibly personalized phone tree. A caller is greeted by name, and the tree supports text-to-speech or user-submitted recordings. 
* Our backend Node/Express server queries saved data like home address, task order, favorite meals, etc., carries out the task, and responds through Twilio.
* Expandable to many services- at the heart it is just calling APIs with predefined data. Our BattleHack prototype used Uber, and we sketched out support for several more services. 


grndma.io leverages knowledge of the younger generations by having family or friends create a profile tailored to one's preferences through our web application. 
Allows services that are otherwise inaccessible by older generations to be as simple as the push of a button or saying a few words. Payment can also be abstracted from the experience. 
Abstracts the complexity of using service apps in the backend so that calling a service can be done just by pushing a button on the phone pad, allowing an entire demographic of people, the elderly, the non-tech savvy, and anyone without a smartphone, to access essential apps that we take for granted.
