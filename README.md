# showhide.js
A small library for show and hiding elements written in Vanilla JS

# Features
* Uses M height calculation to allow the links or buttons used to show/hide the content to be inside of the parent container.
** Uses a ResizeObserver and animation frames to recalculate the M height on window resize.
* Doesn't hide content using display: none.
** This prevents layout issues from hiding content.

# Functions
* Element.prototype.showHide( object args )
** Arguements
*** linkContainer (HTMLElement)
**** Default: this
*** linkElement (HTMLElement)
**** Default: null (Prepends a span at the top of the linkContainer to use for the linkElement)
**** Element that can be clicked to show hide the content.
**** Element will be prepended to linkContainer if it is not a direct decendant of linkContainer.
*** extraElements (array of HTMLElement)
**** Default: []
**** Elements to be show and hid in addition to the linkContainer.
*** showText (string)
**** Default: 'Show Content'
**** Text of the linkElement to indicate to the user it can be clicked to show the content of linkContainer..
*** hideText (string)
**** Default: 'Hide Content'
**** Text of the linkElement to indicate to the user it can be clicked to hide the content of linkContainer.
*** showOnHover (boolean)
**** Default: false
**** Show content of linkContainer when the mouse is hovered onto linkContainer.
*** hideOnOffClick (boolean)
**** Default: false
**** Hide content of linkContainer when the user clicks outside of the linkContainer.
*** subLinkQuery (string)
**** Default: ''
**** CSS selector string to use to indicate sub links in the content of linkContainer.
*** hideOnSubLinkClick (boolean)
**** Default: false
**** Hide content of linkContainer when the user clicks a sub link in the content of linkContainer.
**** Sub links are defined by subLinkQuery.
*** onShow (function)
**** Default: function( linkContainer, event ) {}
**** Function to execute at the begining of the showContent function of linkContainer.
*** onHide (function)
**** Default: function( linkContainer, event ) {}
**** Function to execute at the begining of the hideContent function of linkContainer.

