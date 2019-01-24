initialize();

function initialize() {

	const container = document.querySelector('.container');
	const spaces = Array.from(container.children);
	spaces.shift();
	let player = Math.floor(Math.random() * 2) + 1;

	assignEvents(spaces, player, container);

	addResizeListener();

}

function addResizeListener() {

	const grid = document.querySelector('.grid');
	
	const margin = 100;
	document.body.style.margin = margin / 2 + "px";

	resize();

	window.onresize = function() {
		if (window.innerWidth > 300 && window.innerHeight > 300) resize();		
	}

	function resize() {
		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;
		const baseline = windowWidth < windowHeight ? windowWidth - margin : windowHeight - margin;
		document.body.style.width = baseline + "px";
		document.body.style.height = baseline + "px";
		grid.style.width = baseline + "px";
		grid.style.height = baseline + "px";

		const hOffset = (windowHeight - getStyle(document.body, "height")) / 2;
		const wOffset = (windowWidth - getStyle(document.body, "width")) / 2;
		document.body.style.marginTop = hOffset + "px";
		document.body.style.marginLeft = wOffset + "px";
	}

}

// shorthand function
function getStyle(component, property) {
	return parseFloat(window.getComputedStyle(component).getPropertyValue(property).split('px')[0]);
}

function resetBoard(spaces, player) {

	const container = document.querySelector('.container');

	const modal = document.querySelector('.modal');
	modal.classList.toggle('invisible');
	container.classList.toggle('blur');

	spaces.forEach(space => {
		space.classList = 'space';
		assignEvents(spaces, player);
	});

}

function checkWinCondition(spaces, player) {

	const container = document.querySelector('.container');
	
	if (checkVerticals() || checkHorizontals() || checkDiagonals()) {
		const modal = document.querySelector('.modal');
		modal.classList.toggle('invisible');
		container.classList.toggle('blur');

		const winMessage = document.querySelector('h1');
		if (player === 1) {
			winMessage.innerText = 'O wins!';
		}
		else {
			winMessage.innerText = 'X wins!';
		}

		modal.onclick = function() {
			resetBoard(spaces, player);
		}
	}
	else if (allSpacesAreUsed()) {
		const modal = document.querySelector('.modal');
		modal.classList.toggle('invisible');
		container.classList.toggle('blur');
		
		const winMessage = document.querySelector('h1');
		winMessage.innerText = "It's a draw!";

		modal.onclick = function() {
			resetBoard(spaces, player);
		}
	}

	function allSpacesAreUsed() {
		if (document.querySelectorAll('.used').length === 9) return true;
	}

	function checkVerticals() {
		if (spacesAreEqual(spaces[0], spaces[3], spaces[6])) {
			return true;
		}
		else if (spacesAreEqual(spaces[1], spaces[4], spaces[7])) {
			return true;
		}
		else if (spacesAreEqual(spaces[2], spaces[5], spaces[8])) {
			return true;
		}
		else {
			return false;
		}
	}

	function checkHorizontals() {
		if (spacesAreEqual(spaces[0], spaces[1], spaces[2])) {
			return true;
		}
		else if (spacesAreEqual(spaces[3], spaces[4], spaces[5])) {
			return true;
		}
		else if (spacesAreEqual(spaces[6], spaces[7], spaces[8])) {
			return true;
		}
		else {
			return false;
		}
	}

	function checkDiagonals() {
		if (spacesAreEqual(spaces[0], spaces[4], spaces[8])) {
			return true;
		}
		else if (spacesAreEqual(spaces[2], spaces[4], spaces[6])) {
			return true;
		}
		else {
			return false;
		}
	}

	function spacesAreEqual(a, b, c) {
		if (a.classList.contains('O') && b.classList.contains('O') && c.classList.contains('O')) {
			return true;
		}
		else if (a.classList.contains('X') && b.classList.contains('X') && c.classList.contains('X')) {
			return true;
		}
		else {
			return false;
		}
	}

}

function assignEvents(spaces, player) {

	const container = document.querySelector('.container');

	spaces.forEach(space => {

		space.onmouseenter = e => {
			if (!e.target.classList.contains('X') && !e.target.classList.contains('O')) {
				if (player === 1) {
					e.target.style.backgroundImage = "url('images/X.svg')";
				}
				else {
					e.target.style.backgroundImage = "url('images/O.svg')";
				}
			}			
		};

		space.onmouseout = e => {
			if (!e.target.classList.contains('O') && !e.target.classList.contains('X')) {
				e.target.style.backgroundImage = 'none';
			}
		};

		space.onclick = e => {
			if (player === 1) {
				e.target.classList.toggle('X');
			}
			else {
				e.target.classList.toggle('O');
			}

			e.target.classList.toggle('space');
			e.target.classList.toggle('used');
			e.target.removeAttribute('style');
			e.target.onmouseenter = '';
			e.target.onmouseout = '';
			e.target.onclick = '';
			player = player === 1 ? 2 : 1;

			checkWinCondition(spaces, player);
		}

	});

}