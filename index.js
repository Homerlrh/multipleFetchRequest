const fetch = require("node-fetch");
const request = require("request");

var requestAsync = function (url) {
	return new Promise((resolve, reject) => {
		var req = request(url, (err, response, body) => {
			if (err) return reject(err, response, body);
			resolve(JSON.parse(body));
		});
	});
};

const getParallel = async (urls) => {
	try {
		const data = await Promise.all(urls.map(requestAsync));
		return data;
	} catch (err) {
		console.error(err);
		return null;
	}
};

const run = async (url) => {
	const res = await fetch(url);
	return res.json();
};

function filter(object, ...keys) {
	return keys.reduce((result, key) => ({ ...result, [key]: object[key] }), {});
}
run(`https://swapi.dev/api/people/1`).then(async (json) => {
	//console.log(json);
	const films = await getParallel(json.films);
	const filteredFilms = films.map((film) =>
		filter(film, "title", "episode_id", "url")
	);
	json.films = filteredFilms;
	console.log(json);
});
