class Board extends PIXI.Container{
    cells = [];
    palette = null;
    down = false;
    mode = 'brush';
    square = false;

    constructor(app, rows, cols, position, dims, square = true){
        super();
        this.rows = rows;
        this.cols = cols;
        if(square){
            const side = Math.min(dims.height / rows, dims.width / cols);
            const offset = { x : (dims.width - cols * side) * 0.5, y :  (dims.width - rows * side) * 0.5 };
            this.x = position.x + offset.x;
            this.y = position.y;
            this.dims = { width : side * cols, height : side * rows };
        }else{
            this.x = position.x;
            this.y = position.y;
            this.dims = dims;
        }
        this.square = square;
        this.createBoard();
        app.stage.addChild(this);
    }

    get rows(){
        return this._rows;
    }

    set rows(rows){
        this._rows = rows;
    }

    get cols(){
        return this._cols;
    }

    set cols(cols){
        this._cols = cols;
    }

    get palette(){
        return this._palette;
    }

    set palette(palette){
        this._palette = palette;
    }

    createBoard(){
        this.clearCells();
        const h = this.dims.height / this.rows;
        const w = this.dims.width / this.cols;
        this.cells = this.fillBoard(w, h);
        this.interactive = true;
    }

    fillBoard(w, h, r_i = 0, c_i = 0, rows = this.rows, cols = this.cols){
        const cells = []
        for(let r = r_i; r < r_i + rows; r++){
            const rowsList = [];
            for(let c = c_i; c < c_i + cols; c++){
                const cell = new Cell(this, c * w, r * h, {width : w, height : h});
                cell.on('pointerover', (e) => {
                    cell.container.removeChild(cell);
                    cell.container.addChild(cell);
                    cell.highlightBorder = true;
                    cell.drawCell();
                    if(this.down && this.palette.currentCell != null && (this.mode === 'brush' || this.mode === 'erase')){
                        cell.color = this.mode === 'brush' ? this.palette.currentCell.color : 0x585555;
                        cell.drawCell();
                    }
                }).on('pointerdown', () =>{
                    this.down = true;
                    if(this.palette.currentCell != null && (this.mode === 'brush' || this.mode === 'erase')){
                        cell.color = this.mode === 'brush' ? this.palette.currentCell.color : 0x585555;
                        cell.drawCell();
                    }
                }).on('pointerup', () => {
                    this.down = false;
                });
                rowsList.push(cell);
            }
            cells.push(rowsList);
        }
        return cells;
    }

    clearCells(){
        this.removeChildren();
        this.cells.length = 0;
    }

    resizeBoard(rows, cols, position, dims, square = true, keepOld = true){
        const oldRows = rows;
        const oldCols = cols;
        if(square){
            const side = Math.min(dims.height / rows, dims.width / cols);
            const offset = { x : (dims.width - cols * side) * 0.5, y :  (dims.width - rows * side) * 0.5 };
            this.x = position.x + offset.x;
            this.y = position.y;
            this.dims = { width : side * cols, height : side * rows };
        }else{
            this.x = position.x;
            this.y = position.y;
            this.dims = dims;
        }
        this.square = square;
        this.cols = cols;
        this.rows = rows;


        if(!keepOld){
            console.log("cols" + this.cols);
            console.log("rows" + this.rows);
            console.log("rows" + this.rows);
            this.createBoard();
        } else{
            this.removeChildren();
            const h = this.dims.height / this.rows;
            const w = this.dims.width / this.cols;
            const cells = this.fillBoard(w, h);

            console.log(this.cells);
            console.log(cells);
            //copy old content
            for(let r = 0; r < Math.min(this.cells.length, cells.length); r++){
                for(let c = 0; c < Math.min(this.cells[r].length, cells[r].length); c++){
                    console.log("row  " + r + " col " + c);
                    cells[r][c].color = this.cells[r][c].color;
                    cells[r][c].drawCell();
                }
            }
            this.cells = cells;
        }
    }




}
