//Aliases
let Application = PIXI.Application;
loader = PIXI.loader,
resources = PIXI.loader.resources,
Sprite = PIXI.Sprite;    

//Create color chooser
const pickr = Pickr.create({
    el: '.color-picker',
    useAsButton: true,
    theme: 'classic', // or 'monolith', or 'nano'
    components: {
        // Main components
        preview: true,
        opacity: false,
        hue: true,
        lockOpacity: true,
        // Input / output Options
        interaction: {
            hex: true,
            rgba: true,
            input: true,
            save: true
        }
    }
});    

pickr.on('save', (color, instance) => {
    if(board.palette.currentCell != null){
        board.palette.currentCell.color = parseInt(color.toHEXA().toString().substring(1), 16);
        board.palette.currentCell.drawCell();
        pickr.hide();
    }


});


let app = new PIXI.Application({width: 800, height: 600, view : document.getElementById("pixiCanvas")});
//document.body.appendChild(app.view);
app.renderer.backgroundColor = 0x061639;

//Autoresize and occupy the whole screen
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";

app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth * 0.8, window.innerHeight * 0.8);
app.ticker.add(delta => gameLoop(delta));

const height = app.renderer.view.height;
const width = app.renderer.view.width;
//take the minimum of both
const side = Math.min(height, width);
const boardPosition = {x : width * 0.1, y : height * 0.1 };
const boardDims = {width : width * 0.8, height : height * 0.7 };

const board = new Board(app, 30 , 50, boardPosition, boardDims);
board.palette = new Palette(app, 14, {x : board.x, y : (board.rows + 2 ) * board.dims.height / board.rows + board.y }, {width : board.dims.width, height : board.dims.height / board.rows});

window.addEventListener('mouseup', () => {
    console.log("Aqui");
    board.down = false;
});


function gameLoop(delta){
    //Add code here
    if(board.palette.pickedColor != null){
        //pick the current color
        pickr.setColor("#" + (board.palette.pickedColor & 0x00FFFFFF).toString(16).padStart(6, '0'));
        pickr.show();
        board.palette.pickedColor = null;
    }
}

//Set the board value depending on panel button
$('#optionsPanel .btn').on('click', function(event) {
    board.mode = $(this).find('input').val() 
});

function sliderControl(name, onchange){
    const slider = document.getElementById(name);
    const label = document.getElementById(name + "Val");
    label.innerHTML = slider.value;
    slider.oninput = () => {
        label.innerHTML = slider.value;
    }

    slider.onchange = () => onchange(slider.value);
}

sliderControl("rowsRange", (value) => {
    board.resizeBoard(value, board.cols, boardPosition, boardDims, true, true);
});

sliderControl("colsRange", (value) => {
    board.resizeBoard(board.rows, value, boardPosition, boardDims, true, true);
});

