
Number.prototype.within = function(min,max) {
    return (this >= min && this <= max);
}

var Game = (function(width, height) {
    var _game = {
        width: width,
        height: height,
        playzone: { 
            width: width - 200, 
            height: height - 200, 
            'start': { 
                x: 100, 
                y: 100 
            },
            'end': {
                x: width - 100,
                y: height - 100
            }
        },
        draw: function($P) {
            $P.background(0);
            $P.stroke(187,140,221);
            $P.noFill();
            $P.rect(this.playzone.start.x,
                    this.playzone.start.y,
                    this.playzone.width,
                    this.playzone.height);
        }
    };

    return _game;
    
})

//var aGame = Game(width,height);


var Ship = (function(GAME) {
    
    var position = { 
        x: (GAME.width / 2), 
        y: (GAME.height / 2)
    };

    var VELOCITY_DELTA = 1;
    var MAX_VELOCITY = 5;
    var BEARING_DELTA = 6;

    var _ship = {
        velocity: 0,
        bearing: 0,
        decelerate: function() {
            this.velocity = Math.max(this.velocity -= VELOCITY_DELTA, 0);
            return this.velocity;
        },
        accelerate: function() {
            this.velocity = Math.min(this.velocity + VELOCITY_DELTA, 
                                     MAX_VELOCITY);
            return this.velocity;
        },
        turnLeft: function() {
            var newBearing = this.bearing - BEARING_DELTA;
            if (newBearing < 0)
                newBearing = newBearing + 360;
            
            this.bearing = newBearing;
            return newBearing;
        },
        
        turnRight: function() {
            var newBearing = this.bearing + BEARING_DELTA;
            if (newBearing > 360)
                newBearing = newBearing - 360;
            
            this.bearing = newBearing;
            return newBearing;
        },
        moveForward: function($P) {
            //console.log(position, this.velocity);
            if (this.velocity == 0) {
                return [0,0];
            }
            var bearing_rad = $P.radians(this.bearing);
            var cos = $P.cos(bearing_rad);
            var sin = $P.sin(bearing_rad);
            var deltaX = (this.velocity * cos);
            var deltaY = (this.velocity * sin);
            var targetX = position.x + deltaX;
            var targetY = position.y + deltaY;
            
            
            if (targetX <= GAME.playzone.start.x) {
                position.x = GAME.playzone.start.x;
            } else {
                if (targetX >= GAME.playzone.end.x) {
                    position.x = GAME.playzone.end.x
                } else {
                    position.x = targetX;
                }
            }
            if (targetY <= GAME.playzone.start.y) {
                position.y = GAME.playzone.start.y;
            } else {
                if (targetY >= GAME.playzone.end.y) {
                    position.y = GAME.playzone.end.y
                } else {
                    position.y = targetY;
                }
            }
            //console.log(position);
            return [deltaX, deltaY];
        },
        draw: function($P) {
            this.moveForward($P);
            
            var x = $P.floor(position.x);
            var y = $P.floor(position.y);
            $P.text("velocity " + this.velocity + "    bearing " + this.bearing + "      position (" + x + "," + y + ")",
                 10,10);
            
            $P.translate(x, y);
            $P.rotate($P.radians(this.bearing + 90));
            $P.quad( 0,-20,   -10,10,    0,0,    10,10 )
        },
        init: function($P) {
            $P.translate($P.round(position.x), $P.round(position.y));
            $P.rotate($P.radians(this.bearing));
            $P.quad( 0,-20,   -10,10,    0,0,    10,10 )
        }
    }
    
    return _ship;
});//(game);

