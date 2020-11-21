import { Component } from "react";

export default class App extends Component {
    state = {
        WIDTH: 10,
        HEGIHT: 10,
        BOARD: [],
        APPLE: { x: 7, y: 7 },
        SNAKE: [{ x: 2, y: 4 }],
        SCORE: 0,
        ON_GAME: false,
        LAST_DIRECTION: null,
        LAST_CLICK: null,
        HIGH_SCORES: localStorage.getItem("scores")
            ? JSON.parse(localStorage.getItem("scores"))
            : [],
    };
    isSnakeInThisPosition = (pos) =>
        this.state.SNAKE.find((part) => part.x === pos.x && part.y === pos.y);
    drawScore = () =>
        this.state.HIGH_SCORES.map((score, i) => [
            `${i + 1}. - ${score} puan`,
            <br key={i} />,
        ]);
    componentDidMount = () => this.tick();
    drawBoard() {
        const board = [];
        for (let y = 0; y < this.state.HEGIHT; y++) {
            for (let x = 0; x < this.state.WIDTH; x++) {
                if (x === this.state.APPLE.x && y === this.state.APPLE.y) {
                    board.push("🍎");
                    continue;
                }
                let flag = true;
                for (let s = 0; s < this.state.SNAKE.length; s++) {
                    if (
                        x === this.state.SNAKE[s].x &&
                        y === this.state.SNAKE[s].y
                    ) {
                        board.push("🟩");
                        flag = false;
                    }
                }
                if (flag) board.push("🟫");
            }
            board.push(<br key={y} />);
        }
        return board;
    }
    locateApple() {
        const APPLE = { x: 0, y: 0 };
        do {
            APPLE.x = parseInt(Math.random() * this.state.WIDTH);
            APPLE.y = parseInt(Math.random() * this.state.HEGIHT);
        } while (this.isSnakeInThisPosition(APPLE));
        this.setState({ APPLE });
    }
    newGame = () => {
        if (this.state.ON_GAME) return;
        this.setState({
            ON_GAME: true,
            SCORE: 0,
            SNAKE: [{ x: 5, y: 5 }],
        });
        this.locateApple();
    };
    step() {
        if (
            this.state.APPLE.x === this.state.SNAKE[0].x &&
            this.state.APPLE.y === this.state.SNAKE[0].y
        ) {
            this.setState({
                SCORE: this.state.SCORE + 1,
            });
            this.locateApple();
        }
    }
    gameOver = () => {
        if (!this.state.ON_GAME) return;
        const HIGH_SCORES = [this.state.SCORE, ...this.state.HIGH_SCORES]
            .sort((a, b) => b - a)
            .slice(0, 5);
        localStorage.setItem("scores", JSON.stringify(HIGH_SCORES));
        this.setState({
            WIDTH: 10,
            HEGIHT: 10,
            APPLE: { x: 1, y: 1 },
            SNAKE: [{ x: 5, y: 5 }],
            SCORE: 0,
            ON_GAME: false,
            BOARD: [],
            LAST_DIRECTION: null,
            LAST_CLICK: null,
            HIGH_SCORES,
        });
    };
    move(direction) {
        if (!this.state.ON_GAME) return;
        let { LAST_DIRECTION, LAST_CLICK } = this.state;
        switch (direction) {
            case "left":
                if (LAST_DIRECTION !== "right") LAST_CLICK = "left";
                break;
            case "up":
                if (LAST_DIRECTION !== "down") LAST_CLICK = "up";
                break;
            case "right":
                if (LAST_DIRECTION !== "left") LAST_CLICK = "right";
                break;
            case "down":
                if (LAST_DIRECTION !== "up") LAST_CLICK = "down";
                break;
            default:
                break;
        }
        this.setState({ LAST_CLICK });
    }
    tick = () => {
        setTimeout(this.tick, 1000 / Math.sqrt(this.state.SCORE + 1));
        if (!this.state.ON_GAME) return;
        if (this.state.LAST_CLICK) {
            const { SNAKE } = this.state;
            const head = SNAKE[0];
            const nextPos = { x: head.x, y: head.y };
            switch (this.state.LAST_CLICK) {
                case "left":
                    nextPos.x =
                        head.x - 1 < 0 ? this.state.WIDTH - 1 : head.x - 1;
                    break;
                case "up":
                    nextPos.y =
                        head.y - 1 < 0 ? this.state.HEGIHT - 1 : head.y - 1;
                    break;
                case "right":
                    nextPos.x = head.x + 1 >= this.state.WIDTH ? 0 : head.x + 1;
                    break;
                case "down":
                    nextPos.y =
                        head.y + 1 >= this.state.HEGIHT ? 0 : head.y + 1;
                    break;
                default:
                    break;
            }
            if (this.isSnakeInThisPosition(nextPos)) this.gameOver();
            else {
                SNAKE.unshift(nextPos);
                if (SNAKE.length > this.state.SCORE + 1) SNAKE.pop();
                this.setState({ SNAKE, LAST_DIRECTION: this.state.LAST_CLICK });
                this.step();
            }
        }
    };
    render() {
        return (
            <div>
                {this.drawBoard()}
                <br />
                Puan: {this.state.SCORE}
                <br />
                <button onClick={this.newGame}>✔️</button>
                <button onClick={() => this.move("left")}>⬅️</button>
                <button onClick={() => this.move("up")}>⬆️</button>
                <button onClick={() => this.move("down")}>⬇️</button>
                <button onClick={() => this.move("right")}>➡️</button>
                <button onClick={this.gameOver}>❌</button>
                <br />
                <br />
                Sıralama:
                <br />
                {this.drawScore()}
            </div>
        );
    }
}
