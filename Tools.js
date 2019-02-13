function checkOverlap(spriteA, spriteB) 
{
    var boundsA = spriteA.getBounds();
    var boundsB = spriteB.getBounds();

    return Phaser.Geom.Rectangle.Intersection(boundsA, boundsB);
}

function removeFromArray(key, value, array) 
{
	var i;
    var index = -1;
    for (i=0;i<array.length;i++) {
        if (array[i][key] == value) {
            index = i;
        }
    }
    if (index > -1) {
        array.splice(index, 1);
    }
}

function animComplete (animation, frame) 
{
	this.player.power.setVisible(false);
}