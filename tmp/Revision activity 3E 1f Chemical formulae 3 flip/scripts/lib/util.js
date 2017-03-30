define("lib/util",["jquery"],function($){
  //array helpers
  Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
  };

  Array.prototype.shuffle = function(){
    var counter = this.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = (Math.random() * counter--) | 0;

        // And swap the last element with it
        temp = this[counter];
        this[counter] = this[index];
        this[index] = temp;
    }
  };
});
