# PaperQuik README

[![Code Climate](https://codeclimate.com/github/JohnMunsch/PaperQuik/badges/gpa.svg)](https://codeclimate.com/github/JohnMunsch/PaperQuik)

## Introduction

After going to several sites and not being able to get the kind of printable paper I wanted (due to poor print quality or a lack of choices I liked), I decided to make my own. I thought it would be easy to do so but it turns out that print quality for SVG is utter rubbish in **all** the browsers out there, even today. If you don't believe me, read this: [Using SVG to make custom paper
(and why it didn't work)](http://johnmunsch.com/2013/09/01/using-svg-to-make-custom-paper-and-why-it-didnt-work/) I
was, frankly, astonished that it didn't work.

So I figured out that I could print a really big image from the browser and that looked great on paper (because everybody cares how their pictures print out) so I switched to using [Paper.js](http://paperjs.org/) to render the page image on demand and it works pretty darn well if I do say so myself. Plus, you don't have to stand up a big complicated server to generate PDF files on the fly or anything like that.

Anyway, this is the code that makes [PaperQuik.com](http://paperquik.com) go.

## Installation

You don't really have to "install" anything to look at or use the code. But if you want to see it run locally or run the unit tests you'll need to do a few things. First off, make sure you've installed [Node.js](http://nodejs.org) so you can run the Node Package Manager (npm). Then make sure you've installed both Grunt and Bower. I'm not going to tell you how to do all of that, but instead I'll just direct you to the [Yeoman project](http://yeoman.io) where they tell you about installing all of these great JavaScript tools. Fortunately, npm makes it all pretty darn easy and installing Node.js is easy too.

With all the software you need installed, you can run a commands in the root of the project to get installed what you need to run it locally:

`npm install`

## Running

Then use Gulp to run a server and launch the web page in a browser where you can explore the working UI:

`gulp serve`

## Testing

Sorry, there are no working tests at this time. If you're just looking for an example of some tests, you should check my project [airquotes](https://github.com/JohnMunsch/airquotes), it has 100% code coverage.

## Machine Provisioning and Deployment

Provisioning is just a fancy way of saying setting up a server from scratch and I've used a tool called Ansible to create scripts to do both that configuration and deployment of new versions of the app to a Linux box running Ubuntu 16.04 LTS. If you install Ansible yourself you'll find configuration and Ansible playbooks to perform those tasks in the ops directory.

I've provided Gulp tasks (`gulp ops:configure` or `gulp ops:deploy`) to run them easily though you'll need to create a server somewhere and provide its information in the ops/hosts file instead of the name of my server.

## To-Do List

The to-do list breaks down into three major categories of functionality which are needed:

1. The current code uses a library to identify which browser the user is running and operating system as well. Usually we don't have to worry about such things, but printing in browsers is still stuck about a decade behind all the other neat stuff like 3D, compiled JavaScript, etc. The code needs additional instructions added for how best to print the pages using IE, Firefox, and Safari.

1. Different paper layouts, better layout of the boxes on the page, the ability for the user to modify the printing (for example, line and dot colors), and double sided printing

### The List

* Create location calculation code
* Build 'Cornell Note-Taking' layout
* Build 'To-Do List' layout
* Create a controls page for the dotted ruled lines renderer
* Add a modal w/ printing instructions for Firefox
* Add a modal w/ printing instructions for IE
* Add a modal w/ printing instructions for Safari
* Allow for double-sided pages
* Create a 'Test Page' layout for printer testing
* i18n and l10n
