# PaperQuik README



## Installation

You don't really have to "install" anything to look at or use the code. But if you want to see it run locally or run the unit tests you'll need to do a few things. First off, make sure you've installed [Node.js](http://nodejs.org) so you can run the Node Package Manager (npm). Then make sure you've installed both Grunt and Bower. I'm not going to tell you how to do all of that, but instead I'll just direct you to the [Yeoman project](http://yeoman.io) where they tell you about installing all of these great JavaScript tools. Fortunately, npm makes it all pretty darn easy and installing Node.js is easy too.

Finally you need to install Karma (it's used for the unit-tests:

`npm install -g karma`

With all the software you need installed, you can run a couple of commands in the root of the airquotes project to get installed what you need to run or test it locally:

`bower install`

`npm install`

## To-Do List

The to-do list breaks down into three major categories of functionality which are needed: 

1. The current code uses a library to identify which browser the user is running and operating system as well. Usually we don't have to worry about such things, but printing in browsers is still stuck about a decade behind all the other neat stuff like 3D, compiled JavaScript, etc. The code needs additional instructions added for how best to print the pages using IE, Firefox, and Safari.

1. Different paper layouts, better layout of the boxes on the page, the ability for the user to modify the printing (for example, line and dot colors), and double sided printing.

1. IE preview looks like hell even on IE 11. After the high resolution image of the page has been generated, every other browser scales it down nicely and displays it as a preview. IE butchers it. Initially there should just be a message to tell the user that the preview is not indicative of the output, but later a replacement for the image scaling in IE would fix the problem.

### The List

* Add a message about the IE preview problems
* Fix preview rendering on IE 11, 10, and 9
* Create location calculation code
* Build 'Cornell Note-Taking' layout
* Build 'To-Do List' layout
* Create a controls page for the dotted ruled lines renderer
* Add a modal w/ printing instructions for Firefox
* Add a modal w/ printing instructions for IE
* Add a modal w/ printing instructions for Safari
* Allow for double-sided pages
* Create a 'Test Page' layout for printer testing
i18n and l10n
