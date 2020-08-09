class Palette extends PIXI.Container{
    cells = [];
    currentCell = null;
    pickedColor = null;

    constructor(app, n, position, dims, square = true){
        super();
        this.n = n;
        if(square){
            const side = Math.min(dims.height , dims.width / n);
            const offset = (dims.width - n * side) * 0.5;
            this.x = position.x + offset;
            this.y = position.y;
            this.dims = { width : side * n, height : side };
        }else{
            this.x = position.x;
            this.y = position.y;
            this.dims = dims;
        }
        this.createSlots();
        app.stage.addChild(this);
    }

    get currentCell(){
        return this._palette;
    }

    set currentCell(cell){
        this._currentCell = cell;
    }


    createSlots(){
        const init_vals = [0xF44336, 0xE91E63, 0x9C27B0, 0x673AB7, 0x3F51B5, 0x3F51B5, 0x03A9F4, 0x00BCD4, 0x009688, 0x4CAF50, 0x8BC34A, 0xCDDC39, 0xFFEB3B, 0xFFC107];
        const w = this.dims.width / this.n;
        const h = this.dims.height;
        for(let i = 0; i < this.n; i++){
            const cell = new Cell(this, i * w, 0, {width : w, height : h}, i < init_vals.length ? init_vals[i] : Math.random()*0xffffff);
            cell.on('pointerover', () => {
                cell.container.removeChild(cell);
                cell.container.addChild(cell);
                if(this.currentCell != null){
                    cell.container.removeChild(this.currentCell);
                    cell.container.addChild(this.currentCell);
                }
                cell.highlightBorder = true;
                cell.drawCell();
            }).on('pointerdown', () =>{
                //unselect previous cell
                if(this.currentCell != null){
                    this.currentCell.selected = false;
                    this.currentCell.highlightBorder = false;
                    this.currentCell.drawCell();
                }
                if(cell._clicked){
                    this.pickedColor = cell.color;
                }
                cell.selected = true;
                this.currentCell = cell;
                cell.highlightBorder = true;
                this.currentCell.drawCell();

                cell._clicked = false;
                clearTimeout(cell.__double);
        
            }).on('pointerup', () => {
                cell._clicked = true;
                cell.__double = setTimeout(() => { cell._clicked = false; }, 600); 
            });
        }
    }
}