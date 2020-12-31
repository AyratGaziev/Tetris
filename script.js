const wrapper = $(".wrapper");
const rowCount = 15;
const colCount = 10;


class Grid {
    constructor(rowCount, colCount) {
        this.rowCount = rowCount;
        this.colCount = colCount;
        this.rows = [];
        this.bottom = [];
        this.right = [];
        this.left = [];
    }
    createGrid(wrapper) {
        for (let i = 1; i <= this.rowCount; i++) {
            const cols = [];
            for (let j = 0; j < this.colCount; j++) {
                const id = `${i}${j}`;
                if (i === this.rowCount) {
                    this.bottom.push(id);
                }
                if (j === 0) {
                    this.left.push(id);
                }
                if (j === colCount - 1) {
                    this.right.push(id);
                }
                const box = $("<div></div>").addClass("box").attr("id", id);
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
    clearGrid(doneBlocks) {
        this.rows.forEach((row) => {
            row.forEach((col) => {
                const hasDoneBlock = doneBlocks.some((id) => {
                    return id === +col.attr("id");
                });

                if (hasDoneBlock) {
                    return;
                } else {
                    col.css("background-color", "black");
                }
            });
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
        this.doneBlocks = [];
        this.blockType = null;
    }
    checkBorder(border, idStep) {
        return this.block.some((id) => {
            return border.some((borderId) => {
                return idStep ? +borderId === id + idStep : +borderId === id;
            });
        });
    }
    checkCorner() {
        return this.block.some((blockId) => {
            return this.doneBlocks.some((doneId) => {
                return (
                    doneId === blockId + 10 + 1 || doneId === blockId + 10 - 1
                );
            });
        });
    }
    checkFullRow(rows, game) {
        rows.forEach((row) => {
            if (
                row.every((col) => {
                    return this.doneBlocks.some((dBl) => {
                        return +col.attr("id") === dBl;
                    });
                })
            ) {
                game.score += 10;
                $(".score__now").text(`SCORE: ${game.score}`);
                this.doneBlocks = this.doneBlocks.filter((dBlock) => {
                    return row.every((col) => {
                        return +col.attr("id") !== dBlock;
                    });
                });
                this.doneBlocks = this.doneBlocks.map((dBlock) => {
                    return dBlock < +row[0].attr("id")
                        ? (dBlock += 10)
                        : dBlock;
                });
            }
        });
    }
    moveDown(bottom, grid, game) {
        if (!this.block) return;

        const gameOver = () => {
            return grid.rows[1].some((col) => {
                return this.doneBlocks.some((id) => id === +col.attr("id"));
            });
        };

        if (gameOver()) {
            game.gameOver = true;
            if (+localStorage.getItem("highScore") < game.score) {
                localStorage.setItem("highScore", game.score);
            }
            console.log("game over", game.score, game.highScore);
            $(".end__score").text(`SCORE: ${game.score}`);
            $(".end__high").text(`HIGH SCORE: ${game.highScore}`);
            $(".end").css("display", "flex");
            $(".end__replay").on("click", (e) => {
                game.restartGame();
            });

            return;
        }

        if (this.checkBorder(this.doneBlocks, 10) || this.checkBorder(bottom)) {
            this.listeners.forEach((listener) => listener.unbind());
            this.doneBlocks = this.doneBlocks.concat(this.block);
            this.checkFullRow(grid.rows, game);
            this.block = null;
            game.gameSpeed = 250;

            return;
        }
        this.block = this.block.map((id) => (id += 10));
    }
    moveLeft(left, bottom) {
        if (
            this.checkBorder(this.doneBlocks, -1) ||
            this.checkBorder(left) ||
            this.checkBorder(bottom) ||
            this.checkCorner()
        ) {
            return;
        }
        this.block = this.block.map((id) => (id -= 1));
    }
    moveRight(right, bottom) {
        if (
            this.checkBorder(this.doneBlocks, 1) ||
            this.checkBorder(right) ||
            this.checkBorder(bottom) ||
            this.checkCorner()
        ) {
            return;
        }

        this.block = this.block.map((id) => (id += 1));
    }
    rotate(bottom) {
        if (this.checkBorder(bottom) || this.checkCorner()) {
            return;
        }
        switch (this.blockType) {
            case 0:
                break;
            case 1:
                if (this.turnCounter === 0) {
                    this.block = [
                        this.block[0] + 20,
                        this.block[1] + 9,
                        this.block[2],
                        this.block[3] - 11
                    ];
                    this.turnCounter += 1;
                } else {
                    this.block = [
                        this.block[0] - 20,
                        this.block[1] - 9,
                        this.block[2],
                        this.block[3] + 11
                    ];
                    this.turnCounter = 0;
                }
                break;
            case 2:
                if (this.turnCounter === 0) {
                    this.block = [
                        this.block[0] + 20,
                        this.block[1] + 9,
                        this.block[2] - 2,
                        this.block[3]
                    ];
                    this.turnCounter += 1;
                } else if (this.turnCounter === 1) {
                    this.block = [
                        this.block[0] - 8,
                        this.block[1],
                        this.block[2] + 1,
                        this.block[3]
                    ];
                    this.turnCounter += 1;
                } else if (this.turnCounter === 2) {
                    this.block = [
                        this.block[0] + 9,
                        this.block[1],
                        this.block[2],
                        this.block[3]
                    ];
                    this.turnCounter += 1;
                } else if (this.turnCounter === 3) {
                    this.block = [
                        this.block[0] - 19,
                        this.block[1] - 10,
                        this.block[2],
                        this.block[3]
                    ];
                    this.turnCounter = 0;
                }
                break;
            case 3:
                if (this.turnCounter === 0) {
                    this.block = [
                        this.block[0] + 11,
                        this.block[1],
                        this.block[2] - 11,
                        this.block[3] - 22
                    ];
                    this.turnCounter += 1;
                } else {
                    this.block = [
                        this.block[0] - 11,
                        this.block[1],
                        this.block[2] + 11,
                        this.block[3] + 22
                    ];
                    this.turnCounter = 0;
                }
                break;
        }
    }
    increaseSpeed(game, increase) {
        game.gameSpeed = increase ? 50 : 250;
    }
    createBlock(left, right, bottom, game) {
        if (!this.block) {
            this.turnCounter = 0;
            function randomSelect(elements) {
                return Math.floor(Math.random() * elements.length);
            }
            const randomBlockIdx = randomSelect(this.blockTypes);
            const randomColorIdx = randomSelect(this.colors);
            this.color = this.colors[randomColorIdx];
            this.block = this.blockTypes[randomBlockIdx];
            this.blockType = randomBlockIdx;
            this.block.forEach((id) => {
                $(`#${id}`).css("background-color", `${this.color}`);
            });
            const moveHandler = (event) => {
                event.preventDefault();
                if (
                    event.key === "ArrowLeft" ||
                    $(event.target).attr("class") === "arrow__left"
                ) {
                    this.moveLeft(left, bottom);
                } else if (
                    event.key === "ArrowRight" ||
                    $(event.target).attr("class") === "arrow__right"
                ) {
                    this.moveRight(right, bottom);
                } else if (
                    event.key === "ArrowUp" ||
                    $(event.target).attr("class") === "arrow__up"
                ) {
                    this.rotate(bottom);
                } else if (
                    event.key === "ArrowDown" ||
                    $(event.target).attr("class") === "arrow__down"
                ) {
                    this.increaseSpeed(game, true);
                }
            };
            const increaseRemoveHandler = (event) => {
                if (event.key === "ArrowDown") {
                    this.increaseSpeed(game, false);
                }
            };
            this.listeners = [
                $(document).keydown(moveHandler),
                $(document).keyup(increaseRemoveHandler),
                $(".arrow").mousedown(moveHandler),
                $(".arrow").mouseup(increaseRemoveHandler)
            ];
        } else {
            this.block.forEach((id) => {
                $(`#${id}`).css("background-color", `${this.color}`);
            });
        }
    }
}

class Game {
    constructor(Grid, rowCount, colCount, Block) {
        this.grid = new Grid(rowCount, colCount);
        this.block = new Block();
        this.startTime = null;
        this.gameSpeed = 250;
        this.started = false;
        this.gameOver = false;
        this.score = 0;
    }
    restartGame() {
        $(".end").css("display", "none");
        this.block.doneBlocks = [];
        this.gameOver = false;
        this.highScore = localStorage.getItem("highScore") || 0;
        this.score = 0;
        this.startGame();
    }
    startBtn() {
        this.grid.createGrid(wrapper);
        this.highScore = localStorage.getItem("highScore") || 0;
        $(".score__high").text(`HIGH SCORE: ${this.highScore}`);
        $(document).keydown((e) => {
            if (this.started) return;
            if (e.key === "Enter") {
                this.startGame();
                this.started = true;
            }
        });
        $(".start__btn").on("click", () => {
            if (this.started) return;
            this.startGame();
            this.started = true;
        });
    }

    startGame() {
        $(".start").css("display", "none");
        $(".score").css("display", "block");
        $(".score__now").text(`SCORE: 0`);

        this.block.createBlock(
            this.grid.left,
            this.grid.right,
            this.grid.bottom,
            this
        );

        const run = (timeStamp) => {
            if (this.gameOver) {
                return;
            }
            if (!this.startTime) this.startTime = timeStamp;
            let progress = timeStamp - this.startTime;
            if (progress > this.gameSpeed) {
                this.startTime = timeStamp;
                this.block.moveDown(this.grid.bottom, this.grid, this);
                this.grid.clearGrid(this.block.doneBlocks);
                this.block.createBlock(
                    this.grid.left,
                    this.grid.right,
                    this.grid.bottom,
                    this
                );
            }
            requestAnimationFrame(run);
        };
        requestAnimationFrame(run);
        console.log(this.block);
    }
}

let game = new Game(Grid, rowCount, colCount, Block);
game.startBtn();

console.log(game.grid);
console.log(game);
