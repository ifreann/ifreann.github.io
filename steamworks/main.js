const minGames = 100;
const maxGames = 1000000000;
const defaultGames = 1000;
const loggingThreshold = 10000;
const loggingEnabled = document.querySelector('#loggingEnabled');
const output = document.querySelector('div');
const button = document.querySelector('button');
const input = document.querySelector('input');
const numberOfGamesLabel = document.querySelector('label[for="numberOfGames"]');
const humorIdiot = document.querySelector('#humorIdiot');
const idiotArray = [
	'[1,2,3]',
	'[1,3,2]',
	'[3,1,2]',
	'[2,1,3]',
	'[1.2,3]',
	'[2,3,1]',
	'[2,1,3]',
	'[1,3,2]',
	'[3,1,2]',
	'[3,2,1]',
	'[1,2,3]',
	'[1,2,3]',
	'[1,2,3]',
	'[1,3,2]'
];

input.min = minGames;
input.max = maxGames;
input.value = defaultGames;

let numberOfGames = +input.value;

button.innerText = `Click to play the MHW steamworks ${Number(numberOfGames).toLocaleString()} times`;

input.addEventListener('input', e => {
	button.innerText = `Click to play the MHW steamworks ${Number(input.value).toLocaleString()} times`;
	numberOfGames = +input.value;
});

input.addEventListener('change', e => {
	if (numberOfGames < 100) {
		numberOfGames = 100;
		input.value = 100;
		button.innerText = `Click to play the MHW steamworks ${numberOfGames} times`;
	}
	else if (numberOfGames > maxGames) {
		numberOfGames = maxGames;
		input.value = maxGames;
		button.innerText = `Click to play the MHW steamworks ${Number(numberOfGames).toLocaleString()} times`;
	}
});

button.addEventListener('click', e => {
	play(+input.value);
});

numberOfGamesLabel.innerHTML = `Number of games (${Number(minGames).toLocaleString()} min, ${Number(maxGames).toLocaleString()} max <b class="rainbow">(this will crash your browser!!!)</b>, ${Number(defaultGames).toLocaleString()} default):`;

function play(n) {

	// prevent abuse
	if (n > maxGames) n = maxGames;
	else if (n < minGames) n = minGames;

	let p1Wins = 0;
	let p2Wins = 0;
	const idiot = humorIdiot.checked;
	let idiotWins = 0;
	let idiotIndex = 0;

	output.innerText = "";

	while (n) {
		const correctSequence = JSON.stringify(shuffle([1, 2, 3]));
		const p1 = '[1,2,3]';
		const p2 = JSON.stringify(shuffle([1, 2, 3]));
		const p3 = idiotArray[idiotIndex] === correctSequence;
		const p1Won = p1 === correctSequence;
		const p2Won = p2 === correctSequence;
		const idiotWon = idiot ? p3 : false;

		if (p1Won) p1Wins++;
		if (p2Won) p2Wins++;

		// if humoring an idiot
		if (idiot) {
			if (idiotWon) idiotWins++;
			idiotIndex++;
			if (idiotIndex > idiotArray.length - 1) idiotIndex = 0;
		}

		// if logging is enabled, log
		if (+input.value <= loggingThreshold && loggingEnabled.checked) output.insertAdjacentHTML('afterbegin', `<p>Correct sequence: ${correctSequence}. Auto-play ${p1Won ? 'won' : 'lost'} with ${p1}, random selection ${p2Won ? 'won' : 'lost'} with [${p2}]${idiot ? `, and some idiot ${idiotWon ? 'won' : 'lost'} with [${p3}].` : ''}</p>`);

		// go next
		n--;
	}

	const result = `<p>Over ${Number(numberOfGames).toLocaleString()} games, auto-play won <b>${Number(p1Wins).toLocaleString()}</b> times, and random selection won <b>${Number(p2Wins).toLocaleString()}</b> times.${idiot ? ` And some idiot won <b>${idiotWins}<b/> times.` : ''}</p><br />`;

	output.innerHTML = result + output.innerHTML;

	if (+input.value > loggingThreshold) output.insertAdjacentHTML('beforeend', `<p>Logging is disabled for number of games over 10k.</p>`);

}

function shuffle(array) {

  let currentIndex = array.length, randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;

}