Changes made

memory.html
- set viewport to make it look proper size on mobile
- move resizeIframe function to wrapper.js and changed logic

wrapper.js
- set listener for 'resize' and 'orientationchange' to resizeIframe

index.html
- added function for resizeIframe

game.js
- changed logic to call resizeIframe in configure_game function
