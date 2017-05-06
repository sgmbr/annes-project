# annes-project
A repository for Anne's project

## iPhone iframe overflow

setting iframe width as following worked.
 #quiz {
    width: 1px;
    min-width: 100%;
}

http://stackoverflow.com/questions/23083462/how-to-get-an-iframe-to-be-responsive-in-ios-safari



## iPhone flex img overflow
Group(image) cards are located beyond #ans/#box div on iPhone

does not happen when Group(text).
only when images are used.
not exceed twice the width.
-> width of images are calculated half?

following didn't work
 display: -webkit-flex;
 -webkit-flex-wrap: wrap;

following didn't work
 display: -webkit-box;

setting flex-basis by percentage worked
 .answer-card {
     flex-basis: 30%;
 }

30% worked but 10% didn't

When set to 3rem, 6 images in a row; when set to 10%, 8 images in a row. This explains that when small number is set for images inside flexbox, image width is ignored and the small number is applied.

flex-basis: auto; worked perfectly!
