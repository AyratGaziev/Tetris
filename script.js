const wrapper = $(".wrapper");
const rowCount = 15;
const colCount = 10;

class Grid {
    constructor(rowCount, colCount) {
        this.rowCount = rowCount;
        this.colCount = colCount;
        this.rows = [];
    }
    createGrid(wrapper) {
        for (let i = 1; i <= this.rowCount; i++) {
            const cols = [];
            for (let j = 0; j < this.colCount; j++) {
                const box = $("<div></div>")
                    .addClass("box")
                    .attr("id", `${i}${j}`);
                cols.push(box);
            }
            this.rows.push(cols);
        }
        this.rows.forEach((cols) => {
            const row = $("<div></div>").addClass("row");
            cols.forEach((col) => row.append(col));
            wrapper.append(row);
        });
    }
    clearGrid() {
        this.rows.forEach((row) => {
            row.forEach((col) => col.css("background-color", "black"));
        });
    }
}

class Block {
    constructor() {
        this.blockTypes = [
            [14, 15, 24, 25],
            [13, 14, 24, 25],
            [13, 14, 15, 24],
            [13, 14, 15, 16]
        ];
        this.colors = ["#ffbe0b", "#fb5607", "#ff006e", "#8338ec", "#3a86ff"];
    }
    createBlock() {
        function randomSelect(elements) {
            return Math.floor(Math.random() * elements.length);
        }
        const randomBlockIdx = randomSelect(this.blockTypes);
        const randomColorIdx = randomSelect(this.colors);
        this.block = this.blockTypes[randomBlockIdx];
        this.block.forEach((id) => {
            $(`#${id}`).css(
                "background-color",
                `${this.colors[randomColorIdx]}`
            );
        });
    }
}

class Game {
    constructor(Grid, rowCount, colCount, Block) {
        this.grid = new Grid(rowCount, colCount);
        this.block = new Block();
    }
    startGame() {
        this.grid.createGrid(wrapper);
        this.block.createBlock();
        console.log(this.block);
    }
}

const game = new Game(Grid, rowCount, colCount, Block);
game.startGame();
console.log(game.grid);
