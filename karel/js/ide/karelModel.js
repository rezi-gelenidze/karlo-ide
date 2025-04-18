/**
 * Class: KarelModel
 * -----------------
 * The KarelModel class is in charge of storing and updating
 * the underlying representation of Karel and her world.
 * Supports deep copy.
 */
function KarelModel(nBeepersInBag) {
   var that = {};

   that.dir = Const.KAREL_EAST;
   that.karelRow = 0;
   that.karelCol = 0;
   that.beepers = null;
   that.walls = null;
   that.squareColors = null;
   that.rows = 0;
   that.cols = 0;
   that.nBeepersInBag = nBeepersInBag;
   that.karelHistory = []; // moves are appended to karelHistory TODO: clear when canvas is reset

   that.deepCopy = function() {
      var newModel = KarelModel(that.nBeepersInBag);
      newModel.dir = that.dir;
      newModel.karelRow = that.karelRow;
      newModel.karelCol = that.karelCol;
      newModel.beepers = that.beepers.deepCopy();
      newModel.walls = that.walls.deepCopy();
      newModel.squareColors = that.squareColors.deepCopy();
      newModel.rows = that.rows;
      newModel.cols = that.cols;
      return newModel;
   }

   that.equals = function(otherModel) {
      if (that.dir != otherModel.dir) return false;
      if (that.karelRow != otherModel.karelRow) return false;
      if (that.karelCol != otherModel.karelCol) return false;
      if (!that.beepers.equals(otherModel.beepers)) return false;
      if (!that.squareColors.equals(otherModel.squareColors)) return false;
      return true;
   }

   that.move = function() {
      var newRow = that.karelRow;
		var newCol = that.karelCol;
		switch(that.dir) {
			case Const.KAREL_EAST: newCol = newCol + 1; break;
			case Const.KAREL_WEST: newCol = newCol - 1; break;
			case Const.KAREL_NORTH: newRow = newRow - 1; break;
			case Const.KAREL_SOUTH: newRow = newRow + 1; break;
			default: alert("invalid that.dir: " + that.dir); break;
		}
		if(that.walls.isMoveValid(that.karelRow, that.karelCol, newRow, newCol)) {
			that.karelRow = newRow;
			that.karelCol = newCol;
		} else {
		   error('წინ წასასვლელი დაბლოკილია');
		}
   }

   that.turnLeft = function() {
      var newD = that.dir;
		switch(that.dir) {
			case Const.KAREL_EAST:  newD = Const.KAREL_NORTH; break;
			case Const.KAREL_WEST:  newD = Const.KAREL_SOUTH; break;
			case Const.KAREL_NORTH: newD = Const.KAREL_WEST; break;
			case Const.KAREL_SOUTH: newD = Const.KAREL_EAST; break;
			default: alert("invalid that.dir: " + that.dir); break;
		}
		that.dir = newD;
   }

   that.turnRight = function() {
      var newD = that.dir;
		switch(that.dir) {
			case Const.KAREL_EAST:  newD = Const.KAREL_SOUTH; break;
			case Const.KAREL_WEST:  newD = Const.KAREL_NORTH; break;
			case Const.KAREL_NORTH: newD = Const.KAREL_EAST; break;
			case Const.KAREL_SOUTH: newD = Const.KAREL_WEST; break;
			default: alert("invalid that.dir: " + that.dir); break;
		}
		that.dir = newD;
   }

   that.pickBeeper = function() {
      if (that.beepers.beeperPresent(that.karelRow, that.karelCol)) {
         that.beepers.pickBeeper(that.karelRow, that.karelCol);
         that.nBeepersInBag += 1;
      } else {
         error('მოცემულ ბლოკში ბიპერი არ დევს');
      }
   }

   that.putBeeper = function() {
      if (that.nBeepersInBag == 0) {
         error('კარელს არ აქვს ბიპერები დასადებად');
      } else {
         that.beepers.putBeeper(that.karelRow, that.karelCol);
         that.nBeepersInBag -= 1;
      }
   }

   that.turnAround = function() {
      var newD = that.dir;
		switch(that.dir) {
			case Const.KAREL_EAST:  newD = Const.KAREL_WEST; break;
			case Const.KAREL_WEST:  newD = Const.KAREL_EAST; break;
			case Const.KAREL_NORTH: newD = Const.KAREL_SOUTH; break;
			case Const.KAREL_SOUTH: newD = Const.KAREL_NORTH; break;
			default: alert("invalid that.dir: " + that.dir); break;
		}
		that.dir = newD;
   }

   that.paintCorner = function(color) {
      that.squareColors.paintCorner(that.karelRow, that.karelCol, color);
   }

   that.getDirection = function() {
      return that.dir;
   }

   that.getNBeepersInBag = function() {
      return that.nBeepersInBag;
   }

   that.getNumRows = function() {
      return that.rows;
   }

   that.getNumCols = function() {
      return that.cols;
   }

   that.getKarelRow = function() {
      return that.karelRow;
   }

   that.getKarelCol = function() {
      return that.karelCol;
   }

   that.getSquareColor = function(r, c) {
      return that.squareColors.getColor(r, c);
   }

   that.getNumBeepers = function(r, c) {
      return that.beepers.getNumBeepers(r, c);
   }

   that.hasTopWall = function(r, c) {
      return that.walls.topWall(r, c);
   }

   that.hasRightWall = function(r, c) {
      return that.walls.rightWall(r, c);
   }

	that.beeperPresent = function() {
		return that.beepers.beeperPresent(that.karelRow, that.karelCol);
	}

   that.frontIsClear = function() {
      var newRow = that.karelRow;
		var newCol = that.karelCol;
		switch(that.dir) {
			case Const.KAREL_EAST: newCol = newCol + 1; break;
			case Const.KAREL_WEST: newCol = newCol - 1; break;
			case Const.KAREL_NORTH: newRow = newRow - 1; break;
			case Const.KAREL_SOUTH: newRow = newRow + 1; break;
			default: alert("invalid that.dir: " + that.dir); break;
		}
		return that.walls.isMoveValid(that.karelRow, that.karelCol, newRow, newCol);
	}

	that.rightIsClear = function() {
		var newRow = that.karelRow;
		var newCol = that.karelCol;
		switch(that.dir) {
			case Const.KAREL_EAST: newRow = newRow + 1; break;
			case Const.KAREL_WEST: newRow = newRow - 1; break;
			case Const.KAREL_NORTH: newCol = newCol + 1; break;
			case Const.KAREL_SOUTH: newCol = newCol - 1; break;
			default: alert("invalid that.dir: " + that.dir); break;
		}
		return that.walls.isMoveValid(that.karelRow, that.karelCol, newRow, newCol);
	}

	that.leftIsClear = function() {
		var newRow = that.karelRow;
		var newCol = that.karelCol;
		switch(that.dir) {
			case Const.KAREL_EAST: newRow = newRow - 1; break;
			case Const.KAREL_WEST: newRow = newRow + 1; break;
			case Const.KAREL_NORTH: newCol = newCol - 1; break;
			case Const.KAREL_SOUTH: newCol = newCol + 1; break;
			default: alert("invalid that.dir: " + that.dir); break;
		}
		return that.walls.isMoveValid(that.karelRow, that.karelCol, newRow, newCol);
	}

	that.facingNorth = function() {
		return virtualDirection == KAREL_NORTH;
	}

	that.facingSouth = function() {
		return virtualDirection == KAREL_SOUTH;
	}

	that.facingEast = function() {
		return virtualDirection == KAREL_EAST;
	}

	that.facingWest = function() {
		return virtualDirection == KAREL_WEST;
	}

   that.loadWorld = function(worldText, canvasModel) {
      var lines = worldText.split("\n");

		// get world dimension
		loadDimensionLine(lines[0]);

		that.beepers = Beepers(that.rows, that.cols);
		that.walls = Walls(that.rows, that.cols);
      that.squareColors = SquareColors(that.rows, that.cols);

      that.dir = Const.KAREL_EAST;
      placeKarel(that.rows - 1, 0);

		// load world details
		for (var i = 1; i < lines.length; i++) {
		   if (lines[i] != '') {
			   loadLine(lines[i]);
		   }
		}

		canvasModel.setKarelDimensions(that.rows, that.cols);
   }

   // print state of initial world
   that.initialWorldText = function(customDescription) {
     var worldText = `კარელი არის სამყაროში რომელსაც აქვს ${that.rows} რიგი და ${that.cols} სვეტი.`; // world dims
     if (customDescription){
       // e.g. Karel is in a square house with walls on all sides except to the East of (2, 3). The house’s top left corner is (1, 1) and its bottom right corner is (3, 3).
       worldText = worldText.concat(` ${customDescription}`);
     }
     worldText = worldText.concat(` ${that.beepers.beeperText()}.`); // beeper info (number of beepers, positions)
     worldText = worldText.concat(` კარელი დგას რიგ ${perceptualRow(that.karelRow)}_ზე და სვეტ ${perceptualCol(that.karelCol)}_ზე, მიმართულია ${directionString(that.dir)}. Karel’s front is ${clearOrBlockedString(that.frontIsClear())}, left is ${clearOrBlockedString(that.leftIsClear())}, and right is ${clearOrBlockedString(that.rightIsClear())}.`); // karel position info
    return worldText;
   }

   that.moveText = function(action) {
     // returns text describing move. NOTE: assumes move has already occurred
     if(action.includes('turn')) {
       // e.g. 'turned left', 'turned right'
       return `Karel ${action} and is now facing ${directionString(that.dir)}.`;
     } else if (action.includes('move')) {
       // e.g. 'moved one step forward'
       var numBeepers = that.beepers.getNumBeepers(that.karelRow, that.karelCol);
       return `Karel ${action} and is now at row ${perceptualRow(that.karelRow)} and column ${perceptualCol(that.karelCol)}, facing ${directionString(that.dir)}. There ${singularOrPlural(numBeepers)} ${numBeepers} ${that.beepers.conjugateBeepers(numBeepers)} here. Karel’s front is ${clearOrBlockedString(that.frontIsClear())}, left is ${clearOrBlockedString(that.leftIsClear())}, and right is ${clearOrBlockedString(that.rightIsClear())}.`;
     } else if (action.includes('beeper')) {
       // e.g. 'picked up a beeper', 'placed a beeper'
       var numBeepers = that.beepers.getNumBeepers(that.karelRow, that.karelCol);
       return `Karel ${action}. There ${singularOrPlural(numBeepers)} now ${numBeepers} ${that.beepers.conjugateBeepers(numBeepers)} here.`
     }
     return `Karel ${action}.`;
  }

  function perceptualRow(rowIdx){
    return that.rows - rowIdx;
  }

  function perceptualCol(colIdx){
    return colIdx + 1
  }

  function singularOrPlural(num){
    if (num == 1){
      return 'is';
    }
    return 'are';
  }

  function directionString(dir){
    switch(dir){
      case 0: return 'North';
      case 1: return 'East';
      case 2: return 'South';
      case 3: return 'West';
    }
  }

  function clearOrBlockedString(directionIsClear){
    return directionIsClear ? 'clear' : 'blocked';
  }

   function extractCoord(coordString) {
      var rParenIndex = coordString.indexOf('(');
      var lParenIndex = coordString.indexOf(')');
      coordString = coordString.substring(rParenIndex + 1, lParenIndex);
      coordStrings = coordString.split(',');
      var row = parseInt(coordStrings[0]);
      var col = parseInt(coordStrings[1]);
      return [row, col];
   }

   function loadDimensionLine(line) {
		var dimensionStrings = line.split(":");

      assert(dimensionStrings[0] == 'Dimension', 'World file malformed');
      var coord = extractCoord(dimensionStrings[1]);

		that.rows = coord[0];
		that.cols = coord[1];
   }

   function error(msg) {
      throw msg;
   }

   function placeKarel(row, col) {
      that.karelRow = row;
      that.karelCol = col;
   }

   function loadBagLine(line) {
      that.nBeepersInBag = eval(line)
   }

   function loadWallLine(line) {
      var coord = extractCoord(line);
      if (line.indexOf('west') != -1) {
         var row = that.rows - coord[1];
         var col = coord[0] - 2;
         that.walls.addRightWall(row, col);
      } else {
         var row = that.rows - coord[1] + 1;
         var col = coord[0] - 1;
         that.walls.addTopWall(row, col);
      }
   }

   function loadBeeperLine(line) {
      var coord = extractCoord(line);
      var row = that.rows - coord[0];
      var col = coord[1] - 1;

      // load the optional number of beepers
      // default to 1
      let afterParenIndex = line.indexOf(')') + 1;
      let remaining = line.substring(afterParenIndex).trim()
      let nBeepers = remaining ? eval(remaining) : 1

      // add the beepers
      for (var i = 0; i < nBeepers; i++) {
         that.beepers.putBeeper(row, col)
      }

   }

   function loadKarelLine(line) {
      var coord = extractCoord(line);
      var row = that.rows - coord[0];
      var col = coord[1] - 1;
      placeKarel(row, col);
      if (line.indexOf('west') != -1) {
         that.dir = Const.KAREL_WEST;
      }
      if (line.indexOf('south') != -1) {
         that.dir = Const.KAREL_SOUTH;
      }
      if (line.indexOf('north') != -1) {
         that.dir = Const.KAREL_NORTH;
      }
   }

   function loadLine(line) {
		var elements = line.split(":");
		assert(elements.length == 2, line + 'World file missing :');
		var key = elements[0];

		if (key == "Karel")  {
			loadKarelLine(elements[1]);
		} else if (key == "Wall")  {
			loadWallLine(elements[1]);
		} else if (key == "Beeper") {
			loadBeeperLine(elements[1]);
		} else if (key == "Bag") {
         loadBagLine(elements[1]);
    }
	}

   return that;

}
