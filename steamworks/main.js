const minGames = 100;
const maxGames = 1000000;
const defaultGames = 10000;
const loggingThreshold = 10000;
const loggingEnabled = document.querySelector('#loggingEnabled');
const output = document.querySelector('div');
const button = document.querySelector('button');
const input = document.querySelector('input');
const label = document.querySelector('label');

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
	else if (numberOfGames > 1000000) {
		numberOfGames = 1000000;
		input.value = 1000000;
		button.innerText = `Click to play the MHW steamworks ${Number(numberOfGames).toLocaleString()} times`;
	}
});

button.addEventListener('click', e => {
	play(+input.value);
});

label.innerText = `Number of games (${Number(minGames).toLocaleString()} min, ${Number(maxGames).toLocaleString()} max, ${Number(defaultGames).toLocaleString()} default):`;

function play(n) {

	// prevent abuse
	if (n > 1000000) n = 1000000;
	else if (n < 100) n = 100;

	output.innerText = "";

	let p1Wins = 0;
	let p2Wins = 0;

	while (n) {
		const correctSequence = JSON.stringify(shuffle([1, 2, 3]));
		const p1 = '[1,2,3]';
		const p2 = shuffle([1, 2, 3]);
		const p1Won = p1 === correctSequence;
		const p2Won = JSON.stringify(p2) === correctSequence;
		if (p1Won) p1Wins++;
		if (p2Won) p2Wins++;
		n--;

		if (+input.value <= loggingThreshold && loggingEnabled.checked) output.insertAdjacentHTML('afterbegin', `<p>Correct sequence: ${correctSequence}. Auto-play ${p1Won ? 'won' : 'lost'} with ${p1}, random selection ${p2Won ? 'won' : 'lost'} with [${p2}]</p>`);
	}

	const result = `<p>Over ${Number(numberOfGames).toLocaleString()} games, auto-play won <b>${Number(p1Wins).toLocaleString()}</b> times, and random selection won <b>${Number(p2Wins).toLocaleString()}</b> times.</p><br />`;

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