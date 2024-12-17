function ideInit(starter_code, initial_world, folderName = null, initialBeepers = 0) {

  var karelIde = null;
  var karelEditor = null;
  var buttonState = "play";

  function main() {
    // create editor instance
    karelEditor = importPythonEditor(
      "ideEditor",
      "ideEditorDiv",
      starter_code.trim() // trim code
    );

    setupWorldDropdown(); // add listeners to world choices (view function for more info)
    var canvas = document.getElementById("ideCanvas"); // get canvas div

    // create complete IDE instance
    karelIde = KarelIde(
      karelEditor,
      canvas,
      initial_world,
      1000,
      1000,
      folderName,
      initialBeepers
    );


    embedHandlers(); // link buttons with handler functions
  }

  function setupWorldDropdown() {
    /* iterate list of worlds from #ideWorlds div and add click listeners for world change */
    let div = document.getElementById("ideWorlds");

    if (!div.childNodes || div.childNodes.length == 0) return;

    for (var itemi = 0; itemi < div.childNodes.length; itemi++) {
      var a = div.childNodes[itemi];
      let worldName = a.innerHTML; // extract world name
      a.onclick = () => setWorld(worldName); // add listener for world change
    }
  }

  function embedHandlers() {
    $("#ideRunButton").click(playClicked); //run button

    // manual command button handlers for chapter 1
    $("#cmdMove").click(karelIde.stepMove);
    $("#cmdTurnLeft").click(karelIde.stepTurnLeft);
    $("#cmdPickBeeper").click(karelIde.stepPickBeeper);
    $("#cmdPutBeeper").click(karelIde.stepPutBeeper);

    // update speed on slider change
    $("#speedSlider").bind("change", function (event, ui) {
      speed = 100 - parseInt(event.target.value);
      karelIde.setSpeed(speed);
    });
  }

  function setWorld(worldName) {
    karelIde.changeWorld(worldName);
    changeToPlayButton();
  }

  function playClicked() {
    if (buttonState == "play") {
      karelIde.playButton();
      changeToResetButton();
    } else if (buttonState == "reset") {
      karelIde.stopButton();
      changeToPlayButton();
    }
  }

  function changeToPlayButton() {
    $("#ideRunButton").html("პროგრამის გაშვება");
    buttonState = "play";
  }

  function changeToResetButton() {
    $("#ideRunButton").html("თავიდან დაწყება");
    buttonState = "reset";
  }

  main();
}
