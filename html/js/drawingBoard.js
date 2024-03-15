import { getMousePos } from "./utils.js";

class DrawingBoard {

    constructor() {
        this.drawingCanvas = document.getElementById('drawingBoard');
        this.toolbar = document.getElementById('toolbar');

        this.ctx = this.drawingCanvas.getContext('2d');

        this.canvasOffsetX = this.drawingCanvas.offsetLeft;
        this.canvasOffsetY = this.drawingCanvas.offsetTop;

        this.isPainting = false;
        this.lineWidth = 5;
        this.startX;
        this.startY;

        this.drawingCanvas.width = window.innerWidth - this.canvasOffsetX;
        this.drawingCanvas.height = 3 * window.innerHeight / 4;

        this.toolbar.addEventListener('click', e => {
            if (e.target.id === 'clear') {
                this.ctx.clearRect(0, 0, this.drawingCanvas.width, this.drawingCanvas.height);
            }
        });

        this.toolbar.addEventListener('change', e => {
            if (e.target.id === 'stroke') {
                this.ctx.strokeStyle = e.target.value;
            }

            if (e.target.id === 'lineWidth') {
                this.lineWidth = e.target.value;
            }
        });

        this.drawingCanvas.addEventListener('mousedown', (e) => {
            this.isPainting = true;
            this.startX = e.clientX;
            this.startY = e.clientY;
        });

        this.drawingCanvas.addEventListener('mouseup', (e) => {
            this.isPainting = false;
            this.ctx.stroke();
            this.ctx.beginPath();
        });

        this.drawingCanvas.addEventListener('mousemove', (e) => this.draw(e));
    }

    draw(e) {
        if (!this.isPainting) {
            return;
        }

        this.ctx.lineWidth = this.lineWidth;
        this.ctx.lineCap = 'round';

        const pos = getMousePos(this.drawingCanvas, e)

        this.ctx.lineTo(pos.x, pos.y);
        this.ctx.stroke();
    }
}

export { DrawingBoard };