# showhide.js
A small library for show and hiding elements written in Vanilla JS

# Features
* Uses M height calculation to allow the links or buttons used to show/hide the content to be inside of the container whose content is being hidden.
  * Uses a ResizeObserver and animation frames to recalculate the M height on window resize.
* Doesn't hide content using display: none.
  * This prevents layout issues from hiding content.

# Functions
## Element.prototype.showHide( object args )
Use this function to indicate an HTMLElement should be shown and hidden.
### Arguements
* linkContainer (HTMLElement)
  * Default: this
* linkElement (HTMLElement)
  * Default: null (Prepends a span at the top of the linkContainer to use for the linkElement)
  * Element that can be clicked to show hide the content.
  * Element will be prepended to linkContainer if it is not a direct decendant of linkContainer.
* extraElements (array of HTMLElement)
  * Default: []
  * Elements to be show and hid in addition to the linkContainer.
* showText (string)
  * Default: 'Show Content'
  * Text of the linkElement to indicate to the user it can be clicked to show the content of linkContainer..
* hideText (string)
  * Default: 'Hide Content'
  * Text of the linkElement to indicate to the user it can be clicked to hide the content of linkContainer.
* showOnHover (boolean)
  * Default: false
  * Show content of linkContainer when the mouse is hovered onto linkContainer.
* hideOnOffClick (boolean)
  * Default: false
  * Hide content of linkContainer when the user clicks outside of the linkContainer.
* subLinkQuery (string)
  * Default: ''
  * CSS selector string to use to indicate sub links in the content of linkContainer.
* hideOnSubLinkClick (boolean)
  * Default: false
  * Hide content of linkContainer when the user clicks a sub link in the content of linkContainer.
  * Sub links are defined by subLinkQuery.
* onShow (function)
  * Default: function( linkContainer, event ) {}
  * Function to execute at the begining of the showContent function of linkContainer.
  * Return false to prevent the content of linkContainer from being shown.
* onShowScroll (function)
  * Default: function( linkContainer, event ) {}
  * Function to override the scroll into view behavior when the content of linkContainer is shown.
* onHide (function)
  * Default: function( linkContainer, event ) {}
  * Function to execute at the begining of the hideContent function of linkContainer.
  * Return false to prevent the content of linkContainer from being hidden.
### Example
```javascript
if( elementToShowHide = document.getElementById('show-hide') ) {
   elementToShowHide.showHide({ 
     showText: 'Show Content',
     hideText: 'Hide Content'
   });
}
```
## Element.prototype.showHideNav( object args )
Use this function to an HTMLElement should it shown and hidden in a navigation style.
### Arguements
* linkQuery (string)
  * Default: 'A'
  * CSS selector string to use to indicate the top level links of the naviation.
  * Links should be inside containers that contain sub level links of the naviation. 
* showOnHover (boolean)
  * Default: true
  * Show content of top level linkContainers when the mouse is hovered onto them.
* hideOnOffClick (boolean)
  * Default: true
  * Hide content of top level linkContainer when the user clicks outside of the linkContainer.
* subLinkQuery (string)
  * Default: ''
  * CSS selector string to use to indicate sub links in the content of top level linkContainers.
* hideOnSubLinkClick (boolean)
  * Default: false
  * Hide content of top level linkContainer when the user clicks a sub link in the content of the linkContainer.
  * Sub links are defined by subLinkQuery.
### Example
```javascript
if( navMenu = document.getElementById('primary-panel-nav') ) {
  navMenu.showHideNav({ 
    linkQuery: 'ul > li > a',
    showOnHover: false,
    hideOnOffClick: true,
    subLinkQuery: 'A',
    hideOnSublinkClick: true
  });
}
```
