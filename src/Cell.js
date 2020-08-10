class Cell extends PIXI.Graphics{
    highlightBorder = false;
    highlightColor = true;
    selected = false;

    constructor(container, x, y, dims, color = 0xE8E8E8, lineColor = 0x7f7676){
        super();
        this.container = container;
        this.x = x;
        this.y = y;
        this.dims = dims;
        this.color = color;
        this.lineColor = lineColor;
        this.createCell();
    }

    createCell(){
        this.hitArea = new PIXI.Rectangle(0,0,this.dims.width,this.dims.height);
        this.drawCell();

        this.interactive = true;
        this.buttonMode = true;
        this.on('pointerover', () => {
            this.container.removeChild(this);
            this.container.addChild(this);
            this.highlightBorder = true;
            this.drawCell();
        }).on('pointerout', () => {
            if(!this.selected){
                this.highlightBorder = false;
                this.drawCell();
            }
        });
        this.container.addChild(this);
    }

    drawCell(color = this.color){
        const alphaBorder = this.highlightBorder ? 1 : 0.5;
        const alphaColor = this.highlightColor ? 1 : 0.5;
        const lineColor = this.highlightBorder ? 0xaea6d : this.lineColor;
        this.clear();
        this.beginFill(this.color, alphaColor);
        this.lineStyle(2, lineColor, alphaBorder);
        this.drawRect(0,0, this.dims.width, this.dims.height);    
        this.endFill();
    }

}