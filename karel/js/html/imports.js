// editor initializer
function importPythonEditor(id, parentId, source) {
  // create container
  var code = document.createElement("div");
  code.innerHTML = source;
  code.id = id;
  code.className = "ideEditor";

  var editorDiv = document.getElementById(parentId);
  editorDiv.appendChild(code);
  
  // set editor theme and language mode
  var editor = ace.edit(id);
  editor.setTheme("ace/theme/eclipse");
  var Mode = require("ace/mode/python").Mode;
  editor.getSession().setMode(new Mode());

  // editor feature configuration
  code.style.fontSize = "14px"; // fontsize
  editor.renderer.setShowGutter(true); // line numbers
  editor.getSession().setUseWrapMode(true); // disable horizontal scroll
  editor.setReadOnly(false); // disable code read-only mode
  editor.getSession().setUseWorker(false); // auto error detection
  editor.getSession().setOptions({
    tabSize: 4,
    useSoftTabs: true,
  }); // tab size

  return editor;
}

// script imports
function importScripts(list) {
  var html = "";
  for (var i = 0; i < list.length; i++) {
    html += list[i];
  }
  document.write(html);
}

function importJsLibraries() {
  var scripts = [
    '<script src="../../karel/lib/jquery.js"></script>',
    '<script src="../../karel/lib/browser_detect.js"></script>',
    '<script src="../../karel/lib/util.js"></script>',
    '<script src="../../karel/lib/tabs.js"></script>',
    '<script src="../../karel/codeMirror/js/codemirror.js"></script>',
    '<script src="../../karel/ace/ace.js"></script>',
    '<script src="../../karel/ace/theme-eclipse.js"></script>',
    '<script src="../../karel/ace/mode-javascript.js"></script>',
    '<script src="../../karel/ace/mode-java.js"></script>',
    '<script src="../../karel/ace/mode-python.js"></script>',
    '<script src="../../karel/lib/curvycorners.js"></script>',
    '<script src="../../karel/lib/jquery.js"></script>',
    '<script src="../../karel/boxy/jquery.boxy.js"></script>',
    '<script src="../../karel/lib/swal.min.js"></script>',
  ];
  importScripts(scripts);
}

function importKarelIde() {
  var scripts = [
    '<script src="../../karel/js/ide/karelImages.js"></script>',
    '<script src="../../karel/js/ide/karelSingleton.js"></script>',
    '<script src="../../karel/js/ide/karelConstants.js"></script>',
    '<script src="../../karel/js/ide/action.js"></script>',
    '<script src="../../karel/js/ide/beepers.js"></script>',
    '<script src="../../karel/js/ide/walls.js"></script>',
    '<script src="../../karel/js/ide/squareColors.js"></script>',
    '<script src="../../karel/js/ide/canvasModel.js"></script>',
    '<script src="../../karel/js/ide/karelModel.js"></script>',
    '<script src="../../karel/js/ide/karelView.js"></script>',
    '<script src="../../karel/js/ide/karel.js"></script>',
    '<script src="../../karel/js/ide/karelCompiledEngine.js"></script>',
    '<script src="../../karel/js/ide/karelEvalEngine.js"></script>',
    '<script src="../../karel/js/ide/karelIde.js"></script>',
    '<script src="../../karel/js/html/starterCode.js"></script>',
  ];
  importScripts(scripts);
}

function importCompiler() {
  var scripts = [
    '<script src="../../karel/js/compiler/karelJavaCompiler.js"></script>',
    '<script src="../../karel/js/compiler/karelPythonCompiler.js"></script>',
    '<script src="../../karel/js/compiler/scanner/TokenScanner.js"></script>',
    '<script src="../../karel/js/compiler/parser/Parser.js"></script>',
    '<script src="../../karel/js/compiler/parser/XParser.js"></script>',
    '<script src="../../karel/js/compiler/vm/VM.js"></script>',
    '<script src="../../karel/js/compiler/vm/XVM.js"></script>',
    '<script src="../../karel/js/compiler/karel/KarelParser.js"></script>',
    '<script src="../../karel/js/compiler/karel/KarelPythonParser.js"></script>',
    '<script src="../../karel/js/compiler/karel/KarelVM.js"></script>',
  ];
  importScripts(scripts);
}

function importReference() {
  var scripts = [
    '<script src="../../karel/js/dialog/referenceDialog.js"></script>',
    '<script src="../../karel/js/dialog/deployDialog.js"></script>',
  ];
  importScripts(scripts);
}


// import JS and CSS modules
// CSS
var html = `
   <link rel="stylesheet" href="../../karel/css/style.css" type="text/css" />
   <link rel="stylesheet" href="../../karel/boxy/stylesheets/boxy.css" type="text/css" />
   `;
document.write(html);

// JS
importJsLibraries();
importCompiler();
importKarelIde();
importReference();
