class Board extends PIXI.Container{
    cells = [];
    palette = null;
    down = false;
    mode = 'brush';
    ratio = 1;
    offset = [];

    constructor(app, rows, cols, position, dims, ratio = 1){
        super();
        this.rows = rows;
        this.cols = cols;
        for(let i = 0; i < rows; i++) this.offset.push(i % 2 ? 0 : 0.5);
        const side = Math.min(dims.height / rows, dims.width / (ratio * cols));
        const offset = { x : (dims.width - ratio * cols * side) * 0.5, y :  (dims.height - rows * side) * 0.5 };
        this.x = position.x + offset.x;
        this.y = position.y + offset.y;
        this.dims = { width : ratio * side * cols, height : side * rows };
        this.ratio = ratio;
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

    highlightRow(r, highlight = true){
        for(let c = 0; c < this.cols; c++){
            this.removeChild(this.cells[r][c]);
            this.addChild(this.cells[r][c]);
            this.cells[r][c].highlightBorder = highlight;
            this.cells[r][c].drawCell();
        }
    }

    toggleOffset(r){
        this.offset[r] = this.offset[r] > 0 ? 0 : 0.5;
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
                const c_offset = this.offset[r] * w;
                const cell = new Cell(this, c * w + c_offset, r * h, {width : w, height : h});
                cell.on('pointerover', (e) => {
                    cell.container.removeChild(cell);
                    cell.container.addChild(cell);
                    cell.highlightBorder = true;
                    cell.drawCell();
                    if(this.down && this.palette.currentCell != null && (this.mode === 'brush' || this.mode === 'erase')){
                        cell.color = this.mode === 'brush' ? this.palette.currentCell.color : 0xE8E8E8;
                        cell.drawCell();
                    } else if(this.mode === 'offset'){
                        this.highlightRow(r, true);
                    }
                }).on('pointerout', () => {
                    if(!cell.selected){
                        cell.highlightBorder = false;
                        cell.drawCell();
                        if(this.mode === 'offset'){
                            this.highlightRow(r, false);
                        }
                    }
                }).on('pointerdown', () =>{
                    this.down = true;
                    if(this.palette.currentCell != null && (this.mode === 'brush' || this.mode === 'erase')){
                        cell.color = this.mode === 'brush' ? this.palette.currentCell.color : 0xE8E8E8;
                        cell.drawCell();
                    }
                    if(this.mode === 'offset'){
                        this.toggleOffset(r);
                        this.resizeBoard(this.rows, this.cols, {x : this.x, y : this.y}, this.dims, this.ratio)
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

    resizeBoard(rows, cols, position, dims, ratio = 1, keepOld = true){
        const oldRows = rows;
        const oldCols = cols;
        const side = Math.min(dims.height / rows, dims.width / (ratio * cols));
        const offset = { x : (dims.width - ratio * cols * side) * 0.5, y :  (dims.height - rows * side) * 0.5 };
        this.x = position.x + offset.x;
        this.y = position.y + offset.y;
        this.dims = { width : ratio * side * cols, height : side * rows };
        this.ratio = ratio;
        this.cols = cols;
        this.rows = rows;

        const offsetRows = [];
        for(let i = 0; i < rows; i++) offsetRows.push(i % 2 ? 0 : 0.5);

        if(!keepOld){
            this.offset.length = 0;
            this.createBoard();
        } else{
            this.removeChildren();
            const h = this.dims.height / this.rows;
            const w = this.dims.width / this.cols;
            for(let r = 0; r < Math.min(this.offset.length, offsetRows.length); r++){
                offsetRows[r] = this.offset[r];
            }
            this.offset = offsetRows;

            const cells = this.fillBoard(w, h);
            //copy old content
            for(let r = 0; r < Math.min(this.cells.length, cells.length); r++){
                
                for(let c = 0; c < Math.min(this.cells[r].length, cells[r].length); c++){
                    cells[r][c].color = this.cells[r][c].color;
                    cells[r][c].drawCell();
                }
            }
            this.cells = cells;
        }
    }




}
