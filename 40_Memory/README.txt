Fixes for mobile support
- Displayed too small in mobile display > set viewport
- iframe is not resized based on its contents > fixed resize function
- Showing 2 cards in a row in portrait / 4 cards in a row in landscape
  > made custom Bootstrap class .col-xxs-6 for portrait mode
- Vertically centering words in cards > https://css-tricks.com/centering-css-complete-guide/


Changes made

memory.html
- set viewport to make it look proper size on mobile
- move resizeIframe function to resizer.js and changed logic

resizer.js
- set listener for 'resize' and 'orientationchange' to resizeIframe

index.html
- added function for resizeIframe
- added .col-xxs-6 class

game.js
- changed logic to call resizeIframe in configure_game function

theme.css
- deleted padding for .card
- deleted margin for .answer-text
- added postition, top, left and transform for .answer-text
- added .col-xxs-6 and media query
