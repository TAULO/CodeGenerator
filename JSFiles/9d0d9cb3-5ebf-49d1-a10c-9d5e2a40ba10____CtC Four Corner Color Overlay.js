/*  Instructions: (Must be done each time a puzzle page is loaded.)

        1. Right click on a blank spot on the browser page and select "Inspect" or "Open Inspector".
        2. Navigate to the console panel in the inspector window.
        3. Make sure the correct frame is selected. For the new app, this will be the one labeled "top". The frame drop down is
        usually located at the top or bottom of the console tab. For the legacy app, the correct frame will be a set of characters
        with "cracking-the-cryptic.web.app" next to them.
        4. Next copy this entire file and paste it into the console tab.
        5. Hit the enter key on your keyboard.

        If everything is successful, you will be greeted with a message saying the script has run. Hit okay and At this point you can
        close the inspector window. You should now see a button in a box below the standard controls. Click this button to active the
        extension.

        This extension operates completely separate from the normal toolbar. It only interacts with the grid using its own methods.
        This means all the buttons on the regular toolbar including undo and redo have no effect regarding corner colors.
        This extension also does not have its own undo/redo feature at this time, so all actions are final with regard to corner colors.
        This extension has been tested in Chrome and Edge. It may work in other browsers. Use at your own risk. I will try and keep it
        working, but I make no guarantees that it will work in the future, or with all past puzzles. I've tested it on a few.
        If there are any issues, feel free to submit them.

    How to Use the Extension:
        Applying colors to corners of selected cells:
            1. Select any cells you want to affect in the grid.
            2. Click on one or more of the four white squares in the new tool area. These are the corners of the selected cells that will
            be affected by your next action.
            3. Click on one of the colors (in the new tool area) to apply that color to the selected corners.

        Removing colors from the corners of selected cells:
            1. Select any cells you want to affect in the grid.
            2. Click on one or more of the four white squares in the new tool area. These are the corners of the selected cells that will
            be affected by your next action.
            3. Click on delete (in the new tool area) to remove any color from the selected corners of the selected cells.

        Removing all corner colors from the entire grid at once:
            1. Click on Clear All Corner Colors button to clear all corner colors from the grid.
            2. Click yes/continue/confirm to the prompt to remove them or cancel to leave them.

        Temporarily disabling the extension:
            1. Click on the Disable button to remove the extension. A button will remain to re-enable it.
            2. Click yes/continue/confirm to remove the extension or cancel to leave it active.
        
        Completely remove the extension:
            1. Simply reload the webpage. Note that in the legacy app this will reset the puzzle.
    
    Notes:
        In some of the older puzzles, and especially in the legacy app, the sorting order can cause the corner squares to hide some puzzle
        elements. I have tried to ensure the best consistency between the new app and the legacy app, meaning that when possible, the
        corner colors will sit in front of the standard colors, behind (most) puzzle elements, behind the numbers, and behind the selected
        cells. You can mix corner square markings and the regular color markings in both the legacy app and the new app. Some blending of
        colors may occur, but for the most part I think I've stopped this from happening, or at least happening with most color combinations.
        
        For these reasons, I recommend that if a cell needs multiple color options, use the extension only for that cell.
        There are currently no keyboard shortcuts and you must click on each of the corner selection cells in the control area separately.
        To keep this extension simple, I did not have it make modifications to the underlying game code (although it does use a few
        functions from the original code). This extension does rely on certain assumptions about how the app creates and updates the puzzle
        grid, so any updates to the apps could break this extension, even without changes, future (or some past) puzzles may also break
        this extension. You can always try it, and if it fails, submit a bug report. 
        
        There is no harm in trying the extension (beyond possible loss of progress during play, but unlikely as failure would more likely
        happen during installation) and if something does go wrong, simply reload the puzzle and the extension will be gone. During testing
        I noted that the new app will still save any puzzle marks between reloading the page (although all corner color marks are not saved,
        again, separate code), but the legacy app does lose all progress when reloading.
        
        The code to handle all this is pretty basic and the way I've implemented it lends well to being added to the new app permenantly
        should CtC ask their developer to add it to the app. The ony work left besides some formatting would be the keyboard inputs and the
        undo/redo integration. Maybe they will give them the go ahead.

        Enjoy!
*/
//Helper Functions
function preventEverything(e) {
    if (!e) var e = window.event;

    e.preventDefault();
    e.stopPropagation();
}
function outMSG(msg) {
    console.log(msg);
    alert(msg);
}
//Main Code
if (document.querySelector(".app") && document.querySelector("#svgrenderer")) {
    console.log("New app detected.");/**********************************************************    New App Code Start    ************************************/
    svgns = "http://www.w3.org/2000/svg";
    cell = document.querySelector(".cell");
    if (cell) {
        cellW = cell.clientWidth;
        cellH = cell.clientHeight;
    } else {
        cellW = 64;
        cellH = 64;
    }
    cornerW = cellW / 2;
    cornerH = cellH / 2;
    overlayButtonStyle = "font-size: 8px; margin: 0px; padding: 5px;";
    function add_cell_overlay() {
        svgR = document.querySelector("#svgrenderer");
        hiNode = document.querySelector("#cell-highlights");
        if (svgR && hiNode) {
            gEl = document.createElementNS(svgns, "g");
            gEl.setAttribute("id", "cell-overlay-container");
            cells = document.querySelectorAll(".cell");
            for (i=0; i<cells.length; i++) {
                row = cells[i].getAttribute("row");
                col = cells[i].getAttribute("col");
                tLX = col * cellW;      tLY = row * cellH;
                gEl.appendChild(createCornerRect(tLX, tLY, cornerW, cornerH, "cell-overlay-top-left", row, col));
                tRX = tLX + cornerW;    tRY = tLY;
                gEl.appendChild(createCornerRect(tRX, tRY, cornerW, cornerH, "cell-overlay-top-right", row, col));
                bLX = tLX;              bLY = tLY + cornerH;
                gEl.appendChild(createCornerRect(bLX, bLY, cornerW, cornerH, "cell-overlay-bottom-left", row, col));
                bRX = tLX + cornerW;    bRY = tLY + cornerH;
                gEl.appendChild(createCornerRect(bRX, bRY, cornerW, cornerH, "cell-overlay-bottom-right", row, col));
            }
            svgR.insertBefore(gEl, hiNode);
        } else {
            outMSG("Unable to create corner overlay. The application may have been altered, breaking this script.");
        }
    }
    function createCornerRect(x, y, w, h, c, row, col) {
        rect = document.createElementNS(svgns, "rect");
        rect.setAttribute("vector-effect", "non-scaling-size");
        rect.setAttribute("class", c);
        rect.setAttribute("fill", "none");
        rect.setAttribute("stroke", "none");
        rect.setAttribute("stroke-width", "0");
        rect.setAttribute("x", x);
        rect.setAttribute("y", y);
        rect.setAttribute("width", w);
        rect.setAttribute("height", h);
        rect.setAttribute("opacity", "1");
        rect.setAttribute("row", row);
        rect.setAttribute("col", col);
        return rect;
    }
    function remove_cell_overlay() {
        cells = document.querySelectorAll("#cell-overlay-container");
        for (i=0; i<cells.length; i++) {
            cells[i].remove();
        }
    }
    function add_cell_overlay_controls() {
        cornerSelectBoxStyle = "display:inline-block; width: 18px; height: 18px; margin: 0px; padding: 0px; border: 1px solid black;";
        controlsHTML = '<div id="overlay-controls" style="margin: 10px 10px 0px 10px; padding: 0px; display: grid;">';
        controlsHTML +=		'<div id="overlay-box-controls-container" style="display: grid; grid-template-columns: 1fr 2fr;">';
        controlsHTML += 		'<div id="overlay-corner-select-container" style="display: grid; grid-template-columns: 20px 20px; width: 40px; height: 40px; justify-self: center; align-self: center;">' +
                            '<div id="overlay-top-left-corner-select" style="' + cornerSelectBoxStyle + '" data-selected="0" onmousedown="(function (event) { select_corner(event, 0); })();"> </div>' + 
                            '<div id="overlay-top-right-corner-select" style="' + cornerSelectBoxStyle + '" data-selected="0" onmousedown="(function (event) { select_corner(event, 1); })();"> </div>' + 
                            '<div id="overlay-bottom-left-corner-select" style="' + cornerSelectBoxStyle + '" data-selected="0" onmousedown="(function (event) { select_corner(event, 2); })();"> </div>' + 
                            '<div id="overlay-bottom-right-corner-select" style="' + cornerSelectBoxStyle + '" data-selected="0" onmousedown="(function (event) { select_corner(event, 3); })();"> </div>' + 
                        '</div>'; 

        controlsHTML += 		'<div id="overlay-color-select-container" style="display: grid; grid-template-columns: repeat(3, 1fr); width: 51px; height: 66px; justify-self: center; align-self: center;">';

        colorSet = ["rgba(214, 214, 214, 0.7)", "rgba(124, 124, 124, 0.7)", "rgba(-36, -36, -36, 0.7)",
                "rgba(179, 229, 106, 0.7)", "rgba(232, 124, 241, 0.7)", "rgba(236, 131, 69, 0.7)",
                "rgba(235, 76, 71, 0.7)", "rgba(248, 216, 86, 0.7)", "rgba(74, 195, 232, 0.7)"];
        for (i=0; i<colorSet.length; i++) {
            currentColor = colorSet[i];
            colorSelectBoxStyle = 'display: inline-block; width: 10px; height: 10px; margin: 5px 5px 5px 0px; padding: 0px; border: 1px solid black; background-color: ' + currentColor + ';';
            controlsHTML += 		'<div class="overlay-color-picker" style="' + colorSelectBoxStyle + '" onmousedown="(function (event) { overlay_set_color(event, ' + "'" + currentColor + "'" + '); })();"> </div>'
        }

        controlsHTML += 		'</div>';
        controlsHTML += 	'</div>';
        controlsHTML +=		'<div id="overlay-button-controls-container" style="display: grid; grid-template-columns: 1fr 1fr;">';
        controlsHTML += 		'<div id="overlay-delete-colors-container" style="display: inline-block; margin: 0px; padding: 5px;"><input type="button" value="DELETE" style="' + overlayButtonStyle + '" onmousedown="(function (event) { overlay_clear_color(event); })();"></input></div>';
        controlsHTML += 		'<div id="overlay-clear-all-colors-container" style="display: inline-block; margin: 0px; padding: 5px;"><input type="button" value="Clear All Corner Colors" style="' + overlayButtonStyle +'" onmousedown="(function (event) { if (confirm(' + "'" + 'Clear all the corner color markings from the entire grid?\\nThis action cannot be undone.' + "'" + ')) { overlay_clear_all_colors(event); } })();"></input></div>';
        controlsHTML += 	'</div>';
        controlsHTML += '</div>';

        oCContainer = document.getElementById("overlay-controls-container");
        oCContainer.innerHTML += controlsHTML;
        oCCEls = document.querySelectorAll("#overlay-controls-container *");
        for (i=0; i<oCCEls.length; i++) {
            oCCEls[i].style.boxSizing = "content-box";
        }
    }
    function overlay_set_color(e, newColor) {
        if (document.getElementById("overlay-top-left-corner-select").dataset.selected == "1") {
            selectedCells = get_highlighted_cells("top-left");
            for(i=0; i<selectedCells.length; i++) {
                selectedCells[i].setAttribute("fill", newColor);
            }
        }
        if (document.getElementById("overlay-top-right-corner-select").dataset.selected == "1") {
            selectedCells = get_highlighted_cells("top-right");
            for(i=0; i<selectedCells.length; i++) {
                selectedCells[i].setAttribute("fill", newColor);
            }
        }
        if (document.getElementById("overlay-bottom-left-corner-select").dataset.selected == "1") {
            selectedCells = get_highlighted_cells("bottom-left");
            for(i=0; i<selectedCells.length; i++) {
                selectedCells[i].setAttribute("fill", newColor);
            }
        }
        if (document.getElementById("overlay-bottom-right-corner-select").dataset.selected == "1") {
            selectedCells = get_highlighted_cells("bottom-right");
            for(i=0; i<selectedCells.length; i++) {
                selectedCells[i].setAttribute("fill", newColor);
            }
        }
        preventEverything(e);
    }
    function overlay_clear_color(e) {
        if (document.getElementById("overlay-top-left-corner-select").dataset.selected == "1") {
            selectedCells = get_highlighted_cells("top-left");
            for(i=0; i<selectedCells.length; i++) {
                selectedCells[i].setAttribute("fill", "none");
            }
        }
        if (document.getElementById("overlay-top-right-corner-select").dataset.selected == "1") {
            selectedCells = get_highlighted_cells("top-right");
            for(i=0; i<selectedCells.length; i++) {
                selectedCells[i].setAttribute("fill", "none");
            }
        }
        if (document.getElementById("overlay-bottom-left-corner-select").dataset.selected == "1") {
            selectedCells = get_highlighted_cells("bottom-left");
            for(i=0; i<selectedCells.length; i++) {
                selectedCells[i].setAttribute("fill", "none");
            }
        }
        if (document.getElementById("overlay-bottom-right-corner-select").dataset.selected == "1") {
            selectedCells = get_highlighted_cells("bottom-right");
            for(i=0; i<selectedCells.length; i++) {
                selectedCells[i].setAttribute("fill", "none");
            }
        }
        preventEverything(e);
    }
    function overlay_clear_all_colors(e) {
        selectedCells = document.querySelectorAll(".cell-overlay-top-left, " + 
                                ".cell-overlay-top-right, " +
                                ".cell-overlay-bottom-left, " +
                                ".cell-overlay-bottom-right");
        for(i=0; i<selectedCells.length; i++) {
            selectedCells[i].setAttribute("fill", "none");
        }

        preventEverything(e);
    }
    function select_corner(e, corner) {
        if (corner == 0) {//Top Left
            cDiv = document.getElementById("overlay-top-left-corner-select");
        } else if (corner == 1) {//Top Right
            cDiv = document.getElementById("overlay-top-right-corner-select");
        } else if (corner == 2) {//Bottom Left
            cDiv = document.getElementById("overlay-bottom-left-corner-select");
        } else {//Bottom Right
            cDiv = document.getElementById("overlay-bottom-right-corner-select");
        }
        if (cDiv.dataset.selected == 0) {//Not selected, so highlight and set selected.
            cDiv.style.backgroundColor = "rgba(255, 215, 0, 0.5)";
            cDiv.dataset.selected = "1";
        } else {//Selected, so remove highlight and set unselected.
            cDiv.style.backgroundColor = "rgba(255, 255, 255, 0)";
            cDiv.dataset.selected = "0";
        }
        preventEverything(e);
    }
    function remove_cell_overlay_controls() {
        document.getElementById("overlay-controls").remove();
    }
    function change_button(addRemove) {
        oButton = document.getElementById("overlay-controls-button");
        if (addRemove == "add") {
            oButton.value = "Enable Four Corner Color Overlay";
            oButton.onclick = function () { enable_overlay(); };
        } else {
            oButton.value = "Disable Four Corner Color Overlay";
            oButton.onclick = function () { disable_overlay(); };
        }
    }
    function get_highlighted_cells(corner) {
        selectedCells = [];
        hiCells = document.querySelectorAll(".cell-highlight");
        for (i=0; i<hiCells.length; i++) {
            currentCellX = hiCells[i].x.baseVal.value / hiCells[i].width.baseVal.value;
            currentCellY = hiCells[i].y.baseVal.value / hiCells[i].height.baseVal.value;
            cornerCell = document.querySelector(".cell-overlay-" + corner + "[row='" + currentCellY + "'][col='" + currentCellX + "']");
            if (cornerCell)
            {
                selectedCells.push(cornerCell);
            }
        }
        return selectedCells;
    }
    function enable_overlay() {
        add_cell_overlay();
        add_cell_overlay_controls();
        change_button("remove");
    }
    function disable_overlay() {
        if (confirm("Are you sure you want to disable the four corner color overlay?\nAll corner color marks will be removed from the entire grid.\nThis action cannot be undone.")) {
            remove_cell_overlay();
            remove_cell_overlay_controls();
            change_button("add");
        }
    }
    if (document.querySelector("#overlay-controls-container")) {
        outMSG("The extension appears to already be installed.\n\nIf it isn't working, try refreshing the page and then installing again.\n\nIf it continues to not work, it is possible the app has been modified, or you are using an unsupported browser. Chrome or Edge are recommended. Other browsers may work, but are untested."); 
    } else {
        cContainer = document.querySelector("#controls");
        nDiv = document.createElement("div");
        nDiv.id ="overlay-controls-container";
        nDiv.style = "box-sizing: content-box; display: grid; width: 180px; border: 1px solid black; margin: 10px; padding: 10px; justify-items: center; align-items: center;";
        nDiv.innerHTML = '<input type="button" id="overlay-controls-button" value="Enable Four Corner Color Overlay" style="box-sizing: content-box; font-size: 8px; margin: 0px auto; padding: 5px;" onclick="enable_overlay();"></input>';
        cContainer.appendChild(nDiv);

        outMSG("The script has been run. If you don't see any errors, then you may close the console and proceed.\n\nClick on the 'Enable Four Corner Color Overlay' button to launch the extension.\n\nTested on Chrome and Edge only. Use at your own risk.\n\nTo unload click the 'Disable' button, or to fully remove, simply refresh the page.");
    }
} else if (document.querySelector("#legacyapp") || document.querySelector(".app")) {
    console.log("Legacy app detected");/**********************************************************    Legacy App Code Start    ************************************/
    overlayButtonStyle = "font-size: 8px; margin: 0px; padding: 5px;";
    highlightColor = "rgba(255,215,0,0.5)";//Make sure no spaces and defined in manner of original css style declaration.
    function add_cell_overlay() {
        cells = document.querySelectorAll(".sudoku-cell__inner");
        if (cells.length > 0) {
            cellContainerStyle = "display: grid; margin: 0px; padding:0px; width: 100%; height: 100%; grid-template-columns: 1fr 1fr;";
            cellOverlayCornerStyle = "z-index: 2; display: inline-block; width: 100%; height: 100%; margin: 0px; padding: 0px; top: 0px; right: 0px;";
            for (i=0; i<cells.length; i++) {
                cellOverlayHTML = '<div class="cell-overlay-container" style="' + cellContainerStyle + '">';
                cellOverlayHTML += 	'<div class="cell-overlay-top-left" style="' + cellOverlayCornerStyle + '"> </div>';
                cellOverlayHTML += 	'<div class="cell-overlay-top-right" style="' + cellOverlayCornerStyle + '"> </div>';
                cellOverlayHTML += 	'<div class="cell-overlay-bottom-left" style="' + cellOverlayCornerStyle + '"> </div>';
                cellOverlayHTML += 	'<div class="cell-overlay-bottom-right" style="' + cellOverlayCornerStyle + '"> </div>';
                cellOverlayHTML += '</div>';

                    cells[i].innerHTML += cellOverlayHTML;
            }
        } else {
            outMSG("Unable to create corner overlay. The application may have been altered, breaking this script.");
        }
    }
    function remove_cell_overlay() {
        cells = document.querySelectorAll(".cell-overlay-container");
        for (i=0; i<cells.length; i++) {
            cells[i].remove();
        }
    }
    function add_cell_overlay_controls() {
        cornerSelectBoxStyle = "display:inline-block; width: 18px; height: 18px; margin: 0px; padding: 0px; border: 1px solid black;";
        controlsHTML = '<div id="overlay-controls" style="margin: 10px 10px 0px 10px; padding: 0px; display: grid;">';
        controlsHTML +=		'<div id="overlay-box-controls-container" style="display: grid; grid-template-columns: 1fr 2fr;">';
        controlsHTML += 		'<div id="overlay-corner-select-container" style="display: grid; grid-template-columns: 20px 20px; width: 40px; height: 40px; justify-self: center; align-self: center;">' +
                            '<div id="overlay-top-left-corner-select" style="' + cornerSelectBoxStyle + '" data-selected="0" onmousedown="(function (event) { select_corner(event, 0); })();"> </div>' + 
                            '<div id="overlay-top-right-corner-select" style="' + cornerSelectBoxStyle + '" data-selected="0" onmousedown="(function (event) { select_corner(event, 1); })();"> </div>' + 
                            '<div id="overlay-bottom-left-corner-select" style="' + cornerSelectBoxStyle + '" data-selected="0" onmousedown="(function (event) { select_corner(event, 2); })();"> </div>' + 
                            '<div id="overlay-bottom-right-corner-select" style="' + cornerSelectBoxStyle + '" data-selected="0" onmousedown="(function (event) { select_corner(event, 3); })();"> </div>' + 
                        '</div>'; 

        controlsHTML += 		'<div id="overlay-color-select-container" style="display: grid; grid-template-columns: repeat(3, 1fr); width: 51px; height: 66px; justify-self: center; align-self: center;">';

        colorSet = ["rgba(0, 0, 0, 0.8)", "rgba(207, 207, 207, 0.8)", "rgba(255, 255, 255, 0.8)",
                "rgba(163, 224, 72, 0.8)", "rgba(210, 59, 231, 0.8)", "rgba(235, 117, 50, 0.8)",
                "rgba(230, 38, 31, 0.8)", "rgba(247, 208, 56, 0.8)", "rgba(52, 187, 230, 0.8)"];
        for (i=0; i<colorSet.length; i++) {
            currentColor = colorSet[i];
            colorSelectBoxStyle = 'display: inline-block; width: 10px; height: 10px; margin: 5px 5px 5px 0px; padding: 0px; border: 1px solid black; background-color: ' + currentColor + ';';
            controlsHTML += 		'<div class="overlay-color-picker" style="' + colorSelectBoxStyle + '" onmousedown="(function (event) { overlay_set_color(event, ' + "'" + currentColor + "'" + '); })();"> </div>'
        }

        controlsHTML += 		'</div>';
        controlsHTML += 	'</div>';
        controlsHTML +=		'<div id="overlay-button-controls-container" style="display: grid; grid-template-columns: 1fr 1fr;">';
        controlsHTML += 		'<div id="overlay-delete-colors-container" style="display: inline-block; margin: 0px; padding: 5px;"><input type="button" value="DELETE" style="' + overlayButtonStyle + '" onmousedown="(function (event) { overlay_clear_color(event); })();"></input></div>';
        controlsHTML += 		'<div id="overlay-clear-all-colors-container" style="display: inline-block; margin: 0px; padding: 5px;"><input type="button" value="Clear All Corner Colors" style="' + overlayButtonStyle +'" onmousedown="(function (event) { if (confirm(' + "'" + 'Clear all the corner color markings from the entire grid?\\nThis action cannot be undone.' + "'" + ')) { overlay_clear_all_colors(event); } })();"></input></div>';
        controlsHTML += 	'</div>';
        controlsHTML += '</div>';

        oCContainer = document.getElementById("overlay-controls-container");
        oCContainer.innerHTML += controlsHTML;
    }
    function overlay_set_color(e, newColor) {
        if (document.getElementById("overlay-top-left-corner-select").dataset.selected == "1") {
            selectedCells = get_highlighted_cells("top-left");
            for(i=0; i<selectedCells.length; i++) {
                selectedCells[i].style.backgroundColor = newColor;
            }
        }
        if (document.getElementById("overlay-top-right-corner-select").dataset.selected == "1") {
            selectedCells = get_highlighted_cells("top-right");
            for(i=0; i<selectedCells.length; i++) {
                selectedCells[i].style.backgroundColor = newColor;
            }
        }
        if (document.getElementById("overlay-bottom-left-corner-select").dataset.selected == "1") {
            selectedCells = get_highlighted_cells("bottom-left");
            for(i=0; i<selectedCells.length; i++) {
                selectedCells[i].style.backgroundColor = newColor;
            }
        }
        if (document.getElementById("overlay-bottom-right-corner-select").dataset.selected == "1") {
            selectedCells = get_highlighted_cells("bottom-right");
            for(i=0; i<selectedCells.length; i++) {
                selectedCells[i].style.backgroundColor = newColor;
            }
        }
        preventEverything(e);
    }
    function overlay_clear_color(e) {
        if (document.getElementById("overlay-top-left-corner-select").dataset.selected == "1") {
            selectedCells = get_highlighted_cells("top-left");
            for(i=0; i<selectedCells.length; i++) {
                selectedCells[i].style.backgroundColor = "rgba(0, 0, 0, 0)";
            }
        }
        if (document.getElementById("overlay-top-right-corner-select").dataset.selected == "1") {
            selectedCells = get_highlighted_cells("top-right");
            for(i=0; i<selectedCells.length; i++) {
                selectedCells[i].style.backgroundColor = "rgba(0, 0, 0, 0)";
            }
        }
        if (document.getElementById("overlay-bottom-left-corner-select").dataset.selected == "1") {
            selectedCells = get_highlighted_cells("bottom-left");
            for(i=0; i<selectedCells.length; i++) {
                selectedCells[i].style.backgroundColor = "rgba(0, 0, 0, 0)";
            }
        }
        if (document.getElementById("overlay-bottom-right-corner-select").dataset.selected == "1") {
            selectedCells = get_highlighted_cells("bottom-right");
            for(i=0; i<selectedCells.length; i++) {
                selectedCells[i].style.backgroundColor = "rgba(0, 0, 0, 0)";
            }
        }
        preventEverything(e);
    }
    function overlay_clear_all_colors(e) {
        selectedCells = document.querySelectorAll(".sudoku-cell .sudoku-cell__inner .cell-overlay-top-left, " + 
                                ".sudoku-cell .sudoku-cell__inner .cell-overlay-top-right, " +
                                ".sudoku-cell .sudoku-cell__inner .cell-overlay-bottom-left, " +
                                ".sudoku-cell .sudoku-cell__inner .cell-overlay-bottom-right");
        for(i=0; i<selectedCells.length; i++) {
            selectedCells[i].style.backgroundColor = "rgba(0, 0, 0, 0)";
        }

        preventEverything(e);
    }
    function select_corner(e, corner) {
        if (corner == 0) {//Top Left
            cDiv = document.getElementById("overlay-top-left-corner-select");
        } else if (corner == 1) {//Top Right
            cDiv = document.getElementById("overlay-top-right-corner-select");
        } else if (corner == 2) {//Bottom Left
            cDiv = document.getElementById("overlay-bottom-left-corner-select");
        } else {//Bottom Right
            cDiv = document.getElementById("overlay-bottom-right-corner-select");
        }
        if (cDiv.dataset.selected == 0) {//Not selected, so highlight and set selected.
            cDiv.style.backgroundColor = "rgba(255, 215, 0, 0.5)";
            cDiv.dataset.selected = "1";
        } else {//Selected, so remove highlight and set unselected.
            cDiv.style.backgroundColor = "rgba(255, 255, 255, 0)";
            cDiv.dataset.selected = "0";
        }
        preventEverything(e);
    }
    function remove_cell_overlay_controls() {
        document.getElementById("overlay-controls").remove();
    }
    function change_button(addRemove) {
        oButton = document.getElementById("overlay-controls-button");
        if (addRemove == "add") {
            oButton.value = "Enable Four Corner Color Overlay";
            oButton.onclick = function () { enable_overlay(); };
        } else {
            oButton.value = "Disable Four Corner Color Overlay";
            oButton.onclick = function () { disable_overlay(); };
        }
    }
    function get_highlighted_cells(corner) {
        selectedCells = [];
        hiCells = document.querySelectorAll(".sudoku-cell__highlight");
        for (i=0; i<hiCells.length; i++) {
            currentCell = hiCells[i];
            if (currentCell.style.backgroundColor.replace(/\s+/g, "").toLowerCase() == highlightColor) {
                cornerCell = currentCell.parentNode.querySelector(".cell-overlay-" + corner);
                if (cornerCell) {
                    selectedCells.push(cornerCell);
                }
            }
        }
        return selectedCells;
    }
    function enable_overlay() {
        add_cell_overlay();
        add_cell_overlay_controls();
        change_button("remove");
    }
    function disable_overlay() {
        if (confirm("Are you sure you want to disable the four corner color overlay?\nAll corner color marks will be removed from the entire grid.\nThis action cannot be undone.")) {
            remove_cell_overlay();
            remove_cell_overlay_controls();
            change_button("add");
        }
    }
    if (document.querySelector("#legacyapp")) {
        outMSG("This script must be run inside the legacy app frame.\n\nIf in Chrome, select the dropdown above (should say 'top') and select the frame (usually a long string of random characters followed by 'cracking-the-cryptic.web.app'). Then paste the code again.");
    } else {
        if (document.querySelector("#overlay-controls-container")) {
            outMSG("The extension appears to already be installed.\n\nIf it isn't working, try refreshing the page and then installing again.\n\nIf it continues to not work, it is possible the app has been modified, or you are using an unsupported browser.\n\nChrome or Edge are recommended. Other browsers may work, but are untested.");
        } else {
            cContainer = document.querySelector(".sudoku-play__controls-container");
            nDiv = document.createElement("div");
            nDiv.id ="overlay-controls-container";
            nDiv.style = "display: grid; width: 180px; border: 1px solid black; margin: 10px; padding: 10px; justify-items: center; align-items: center;";
            nDiv.innerHTML = '<input type="button" id="overlay-controls-button" value="Enable Four Corner Color Overlay" style="font-size: 8px; margin: 0px auto; padding: 5px;" onclick="enable_overlay();"></input>';
            cContainer.appendChild(nDiv);
            outMSG("The script has been run. If you don't see any errors, then you may close the console and proceed.\n\nClick on the 'Enable Four Corner Color Overlay' button to launch the extension.\n\nTested on Chrome and Edge only. Use at your own risk.\n\nTo unload click the 'Disable' button, or to fully remove, simply refresh the page.");
        }
    }
} else {/**********************************************************    Unable to find Legacy App or New App    ************************************/
    outMSG("This script must be run inside the new app top frame or in the legacy app frame.\n\nFor the new app, if in Chrome, make sure the dropdown above says 'top' and not 'bc.min.html' or '_uspapiLocator'. Then paste the code again.\n\nIf using the legacy app, if in Chrome, select the dropdown above (should say 'top') and select the frame (usually a long string of random characters followed by 'cracking-the-cryptic.web.app'). Then paste the code again.");
}
