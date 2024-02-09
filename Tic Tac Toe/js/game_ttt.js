/// Variables

const DEBUG = false;

const X = 'X';
const O = 'O';
const totalCellCount = 9;

let nextTurn = 'X';
let markedCells = 0;
let hasWinner = false;

/// Functions

const useTurn = function()
{
	if (DEBUG)
		console.log('Using a turn.');

	nextTurn = (nextTurn == X) && O || X;
}

const setHover = function()
{
	if (DEBUG)
		console.log('Setting a hover.');

	const board = document.querySelector('.board');

	if (nextTurn == X)
	{
		board.classList.remove(O);
		board.classList.add(X);

		return;
	}

	board.classList.remove(X);
	board.classList.add(O);
}

const eraseHover = function()
{
	if (DEBUG)
		console.log('Erasing a hover.');

	const board = document.querySelector('.board');

	board.classList.remove(X);
	board.classList.remove(O);
}

const announceWinner = function(winner)
{
	if (DEBUG)
		console.log('Announcing a winner.');

	window.alert('Winner!\n' + winner);

	hasWinner = true;

	eraseHover();
}

const crossLine = function(winnerInfo)
{
	if (DEBUG)
		console.log('Crossing a line.');

	const type = winnerInfo['type'];
	const listOfCells = getListOfCells();
	const boardArray = getBoardFromListOfCells(listOfCells);

	switch (type)
	{
		case 'vertical':
		{
			for (let x = 1; x <= 3; x ++)
			{
				let e = boardArray[winnerInfo['y']][x];

				e.classList.add('cross');
			}

			break;
		}
		case 'horizontal':
		{
			for (let y = 1; y <= 3; y ++)
			{
				let e = boardArray[y][winnerInfo['x']];

				e.classList.add('cross');
			}

			break;
		}
		case 'diagonal':
		{
			let start = winnerInfo['start'];
			let max = winnerInfo['max'];
			let increment = winnerInfo['increment'];

			crossDiagonal(listOfCells, start, max, increment);

			break;
		}
	}
}

const checkCounter = function(counter)
{
	if (DEBUG)
		console.log('Checking the counter.');

	if (counter[X] >= 3)
		return X;

	if (counter[O] >= 3)
		return O;

	return false;
}

const getBoardFromListOfCells = function(listOfCells)
{
	if (DEBUG)
		console.log('Converting a list of cells to a board array.');

	var boardArray = { [1]: { }, [2]: { }, [3]: { } };

	// Create columns and insert data.
	for (let i = 0; i < listOfCells.length; i ++)
	{
		const element = listOfCells[i];

		let x = element.getAttribute('x');
		let y = element.getAttribute('y');

		if (DEBUG)
			element.innerHTML = x + ', ' + y;

		boardArray[y][x] = element || false;
	}

	return boardArray;
}

const crossDiagonal = function(listOfCells, start, max, increment)
{
	for (let i = start; i < max; i = i + increment)
	{
		const element = listOfCells[i];

		element.classList.add('cross');
	}
}

const loopDiagonal = function(listOfCells, start, max, increment)
{
	if (DEBUG)
		console.log('Checking for a strike by diagonal lines.');

	let counter = { [X]: 0, [O]: 0 };

	for (let i = start; i < max; i = i + increment)
	{
		const element = listOfCells[i];

		let marked = element.getAttribute('marked') || false;

		counter[marked] ++;
	}

	let winner = checkCounter(counter);

	if (winner)
	{
		if (DEBUG)
			console.log('Winner: ' + winner + ' From: ' + loopDiagonal.name);

		return {
			['winner']: winner,
			['type']: 'diagonal',
			['start']: start,
			['max']: max,
			['increment']: increment
		};
	}

	return false;
}

const loopLine = function(boardArray)
{
	if (DEBUG)
		console.log('Checking for a strike by straight lines.');

	for (let y = 1; y <= 3; y ++)
	{
		let counter = { [X]: 0, [O]: 0 };

		for (let x = 1; x <= 3; x ++)
		{
			let marked = boardArray[y][x].getAttribute('marked');

			if (marked)
				counter[marked] ++;
		}

		let winner = checkCounter(counter);

		if (winner)
		{
			if (DEBUG)
				console.log('Winner: ' + winner + ' From: #1 ' + loopLine.name);

			return {
				['winner']: winner,
				['type']: 'vertical',
				['y']: y
			};
		}
	}

	for (let x = 1; x <= 3; x ++)
	{
		let counter = { [X]: 0, [O]: 0 };

		for (let y = 1; y <= 3; y ++)
		{
			let marked = boardArray[y][x].getAttribute('marked');

			if (marked)
				counter[marked] ++;
		}

		let winner = checkCounter(counter);

		if (winner)
		{
			if (DEBUG)
				console.log('Winner: ' + winner + ' From: #2 ' + loopLine.name);

			return {
				['winner']: winner,
				['type']: 'horizontal',
				['x']: x
			};
		}
	}

	return false;
}

const getListOfCells = function()
{
	if (DEBUG)
		console.log('Getting the list of cells.');

	return document.getElementsByClassName('cell');
}

// Lazily check for a winner.
// Can be optimised to only check using the last marked cell.
// But this is a simple game that wouldn't really need that much optimisation.
const checkWinner = function()
{
	if (DEBUG)
		console.log('Checking for winner.');

	// Get cells.
	const listOfCells = getListOfCells();

	// Create board.
	const boardArray = getBoardFromListOfCells(listOfCells);

	// Check horizontal and vertical lines.
	const winnerInfo = loopLine(boardArray)
	// Check diagonal lines.
	 	|| loopDiagonal(listOfCells, 0, 9, 4)
	 	|| loopDiagonal(listOfCells, 2, 7, 2)
	// No winner.
	 	|| { };

	const winner = winnerInfo['winner'];

	if (!winner)
		return false;

	crossLine(winnerInfo);
	announceWinner(winner);

	return true;
}


/// Events

function resetGame()
{
	if (DEBUG)
		console.log('Resetting game...');

	// This reloads the game without reloading the page.
	nextTurn = 'X';
	markedCells = 0;
	hasWinner = false;

	let listOfCells = getListOfCells();

	for (let i = 0; i < listOfCells.length; i++) {
		const element = listOfCells[i];
		const marked = element.getAttribute('marked');

		if (marked == X)
			element.classList.remove(X);

		if (marked == O)
			element.classList.remove(O);

		element.classList.remove('cross');

		element.setAttribute('marked', '')
	}

	setHover();

	if (DEBUG)
		console.log('Reset complete.');
}

function markCell(e)
{
	if (DEBUG)
		console.log('Marking cell...');

	if (hasWinner)
	{
		window.alert('The game is over.');

		return;
	}

	if (e.getAttribute('marked'))
	{
		window.alert('This cell is already marked.');

		return;
	}

	if (markedCells == 0)
		document.getElementById('buttonReset').style.display = '';

	switch (nextTurn)
	{
		case X:
		{
			e.classList.add(X);
			e.setAttribute('marked', X);

			break;
		}
		case O:
		{
			e.classList.add(O);
			e.setAttribute('marked', O);

			break;
		}
		default:
		{

			return;
		}
	}

	markedCells ++;

	if (checkWinner())
		return;

	if (markedCells >= totalCellCount)
	{
		window.alert('No more moves are available.');

		return;
	}

	useTurn();
	setHover();

	if (DEBUG)
		console.log('Mark complete.');
}

function loadGame()
{
	if (DEBUG)
		console.log('Loading game...');

	var board = document.createElement('div');

	board.setAttribute('class', 'board');

	document.getElementById('ttt').appendChild(board);

	setHover();

	for (let i = 1; i <= 9; i++)
	{
	 	let cell = document.createElement('div');

		let y = Math.ceil(i / 3);
		let x = ((i - 1) % 3) + 1;

	 	cell.setAttribute('class', 'cell');
		cell.setAttribute('onClick', 'markCell(this)');
		cell.setAttribute('x', x);
		cell.setAttribute('y', y);

	 	board.appendChild(cell);
	}

	if (DEBUG)
		console.log('Load complete.');
}
