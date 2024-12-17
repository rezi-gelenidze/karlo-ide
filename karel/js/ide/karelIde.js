/**
 * Class: Karel IDE
 * ---------
 * This is the main class for the Karel Ide. It provides the
 * API availible to manipulate Karel. This class is in charge
 * of maintaining the karelImages singleton and making sure
 * that Karel doesn't try to render before images have been
 * loaded.
 */
function KarelIde(
  editor,
  canvas,
  initialWorld,
  canvasWidth,
  canvasHeight,
  folderName = null,
  initialBeepers
) {
  // defaults
  let PATH_TO_ROOT = "../../";
  let programLang = "python";
  let lang = "en";

  let customInitialWorldDescription = "";
  let setInitialWorldText = console.log;
  let setAriaLabel = console.log;
  let addMoveText = console.log;

  // runtime speed value [100 - slowest, 1 - fastest]
  var runtime_speed = 50

  // I am using the class style described in JavaScript the good parts
  var that = {};

  // constants
  var DRAW_HEARTBEAT = runtime_speed;
  var HEART_BEAT = 10;

  // instance variables
  if (canvas) var context = canvas.getContext("2d");
  var actionCountdown = runtime_speed;
  var worldName = initialWorld;
  var canvasModel = CanvasModel(canvasWidth, canvasHeight);
  var worldLoaded = false;

  var karel = Karel(canvasModel, programLang, lang, initialBeepers);
  var compileEngine = null;

  // state flags
  var animating = false;
  var imagesReady = false;
  var numActions = 0;
  var silent = false;

  that.ariaLabel = "";

  // Setup the variables, create a animation callback loop and load images.
  function init() {
    if (canvas) {
      canvas.width = canvasModel.getWidth();
      canvas.height = canvasModel.getHeight();
    }
    if (!karelImages.haveCalledLoadImages()) {
      karelImages.loadImages(imagesLoaded);
    } else if (!karelImages.haveLoadedAllImages()) {
      karelImages.addListener(imagesLoaded);
    } else {
      imagesLoaded();
    }
    setInterval(heartbeat, HEART_BEAT);
  }

  //--------------- PUBLIC METHODS ---------------------//

  // set speed to given value (1-100). Speed slider uses this method
  that.setSpeed = value => {
    runtime_speed = value; 
    DRAW_HEARTBEAT = value;
    actionCountdown = value;
  }

  /**
   * Function: Stop Button
   * Usage: $('#stopButton').click(karelIde.stopButton);
   * ---------------------
   * Public method that stops animation and resets the current world.
   */
  that.stopButton = function () {
    animating = false;
    loadWorld(worldName);
    editor.moveCursorTo(0);
  };

  that.resizeCanvas = function (width, height) {
    // beware! Do not try to change the canvas width
    // that is simply the size that is rendered to, not the
    // size that is displayed. The display size comes from
    // the
  };

  /**
   * Function: Play Button
   * Usage: $('#playButton').click(karelIde.playButton);
   * --------------
   * Runs the code from the IDE editor without reseting Karel's world.
   * "Compiles" the code and then sets the animation
   * flag to be true so that the program starts rendering Karel's progress.
   * Should be called when the play button is pressed.
   */
  that.playButton = (playCallback) => that.runCode(playCallback);

  /**
   * Function: Change World
   * ------------
   * Sets the world to be the given fileName. Assumes that the fileName given
   * exists (doesn't do any checking).
   */
  that.changeWorld = function (fileName) {
    animating = false;
    editor.moveCursorTo(0);
    worldName = fileName;
    if (imagesReady) {
      loadWorld(fileName);
    }
  };

  // Make Karel take a single step forward.
  that.stepMove = () => step(karel.move);

  // Make Karel turn left once.
  that.stepTurnLeft = () => step(karel.turnLeft);

  // Make Karel turn right once.
  that.stepTurnRight = () => step(karel.turnRight);

  // Make Karel place a single beeper.
  that.stepPutBeeper = () => step(karel.putBeeper);

  // Make Karel pick up a single beeper.
  that.stepPickBeeper = () => step(karel.pickBeeper);

  // Returns the model of karel used by this ide
  that.getModel = function () {
    return karel.getModel();
  };

  that.setCode = function (code) {
    if (editor == null) return null;
    return editor.getSession().setValue(code);
  };

  that.getCode = function () {
    return getCode();
  };

  that.setSilent = function (newSilent) {
    silent = newSilent;
  };

  that.runUnitTest = function (inputWorld, outputWorld, callback) {
    var tempIde1 = KarelIde(editor, null, inputWorld);
    var tempIde2 = KarelIde(editor, null, outputWorld);
    var simulationOver = function (error) {
      var passed = tempIde1.getModel().equals(tempIde2.getModel());
      callback(passed && !error);
    };
    tempIde1.setSilent(true);
    tempIde1.runCode(simulationOver);
  };

  that.runSpecificCode = function (code, finishedCallback) {
    // setup
    compileEngine = getCompiler();
    that.stopButton();

    // compile
    try {
      compileEngine.compile(code);
    } catch (compilerError) {
      if (!silent) {
        _errorAlert(compilerError);
      }
      finishedCallback(true);
      return;
    }

    // run the code!
    if (silent) {
      return runCodeNoDisplay(finishedCallback);
    } else {
      console.log("running...");
      that.playCallback = finishedCallback;
      animating = true;
    }
  };

  that.runCode = function (finishedCallback) {
    if (!worldLoaded) throw new Error("TRIED TO RUN BEFORE WORLD LOADED");
    var code = getCode();
    that.runSpecificCode(code, finishedCallback);
  };

  //----------------------------- PRIVATE METHODS --------------------------//

  function runCodeNoDisplay(finishedCallback) {
    try {
      while (true) {
        var result = compileEngine.executeStep();
        if (result["isDone"]) {
          if (finishedCallback) finishedCallback(false);
          break;
        }
      }
    } catch (karelError) {
      if (finishedCallback) finishedCallback(true);
    }
  }

  function getCompiler() {
    if (Const.USE_COMPILER) {
      if (programLang == "python") {
        return KarelPythonCompiler(karel);
      }
      // default to Java
      return KarelJavaCompiler(karel);
    }
    return KarelEvalEngine(karel);
  }

  /**
   * Function: Step
   * ----
   * Make karel execute a single action (the passed in stepFunction).
   * Clears karel of any errors and turns on animation so that karel will
   * animate the action.
   */
  function step(stepFunction) {
    try {
      stepFunction();
    } catch (msg) {
      _errorAlert(msg);
    }
    draw();
  }

  /**
   * Function: ImagesLoaded
   * ------------
   * This method is the callback for when images have finished loading.
   * Updates the imagesReady flag and loads the current world.
   * Usage: karelImages.loadImages(imagesLoaded);
   */
  function imagesLoaded() {
    imagesReady = true;
    loadWorld(worldName);
  }

  /**
   * Function: WorldFileLoaded
   * ------------
   * This method is the callback for when a world has finished loading.
   * Updates the karelWorld instance and redraws the canvas.
   * Usage: loadDoc(worldUrl, worldFileLoaded);
   */
  function worldFileLoaded(text) {
    karel.loadWorld(text, canvasModel);
    draw();
    worldLoaded = true;
    var worldDescription = karel.getInitialWorldText(
      customInitialWorldDescription
    );
    // that.ariaLabel = worldDescription; // aria label text for, e.g., `world.html`
    setAriaLabel(worldDescription); // aria label text for, e.g., `world.html`
    setInitialWorldText(worldDescription); // set initial text of text description box in interactive IDEs for e.g. `bigCode.html` and `runnable.html`
    karel.addMoveText = addMoveText; // give karel obj access to function to modify DOM upon move
  }

  /**
   * Funciton: Load World
   * ----------
   * Loads a new Karel World. Assumes that images have already been
   * preloaded.
   */
  function loadWorld(worldName) {
    worldName += ".w";
    if (!imagesReady) {
      alert("load world called before images ready");
    }

    // by default convention, every world is organized if folders with the name of its html files
    // but for reusabilty of world files, folder name can be specified for using another template's world files
    var fileName;
    if (folderName) {
      fileName = folderName;
    } else {
      fileName = document.location.pathname.split("/").pop().split(".")[0];
    }
    // get current html file's own worlds
    var url = `./tasks/${fileName}/${worldName}`;
    loadDoc(url, worldFileLoaded);
  }

  /**
   * Function: Heartbeat
   * ---------
   * Animation callback method which is executed once every HEART_BEAT
   * milliseconds. Only updates and draws if the animating flag is true
   */
  function heartbeat() {
    if (animating) {
      update();
      if (actionCountdown == DRAW_HEARTBEAT) {
        draw();
      }
    }
  }

  /**
   * Function: Update
   * ------
   * Updates the world once every ACTION_HEATRTBEATS number of heartbeats.
   */
  function update() {
    actionCountdown = actionCountdown - 1;
    if (actionCountdown == 0) {
      try {
        result = compileEngine.executeStep();
        let isDone = result["isDone"];
        animating = !isDone;
        if (isDone && that.playCallback) that.playCallback(false);
        if (!isDone) {
          let lineNum = result["lineNumber"];
          if (lineNum) {
            // if there is a selection things get funky
            editor.clearSelection();
            editor.moveCursorTo(lineNum);
          }
        }
        numActions += 1;
      } catch (karelError) {
        if (!silent) {
          _errorAlert(karelError);
        }
        animating = false;
        numActions = 0;
        if (that.playCallback) that.playCallback(true);
      }
      actionCountdown = runtime_speed;
    }
  }

  /**
   * Function: Draw
   * ----
   * Clears the canvas and draws a new version of Karel. Assumes that a
   * world has been loaded. Draws Karel infront of beepers but behind walls.
   */
  function draw() {
    if (canvas) {
      clear();
      karel.draw(context);
    }
  }


  /**
   * Function: Clear
   * -----
   * Clears the canvas by filling it with a rectangle colored BACKGROUND_COLOR
   */
  function clear() {
    context.clearRect(0, 0, canvasModel.getWidth(), canvasModel.getHeight());
    //context.fillStyle = Const.BACKGROUND_COLOR;
    // context.fillRect(0, 0, canvasModel.getWidth(), canvasModel.getHeight());
  }

  /**
   * Function: Get Code
   * -----
   * Returns the code in the Karel IDE as a String.
   */
  function getCode() {
    if (editor == null) return null;
    return editor.getSession().getValue();
  }

  function _errorAlert(msg) {
    swal({
      text: msg,
      type: "error",
      confirmButtonText: "კარგი",
    });
  }

  // Initialize and return the instance (based on JavaScript the
  // Good Parts)
  init();
  return that;
}
