var bot = new (require("slackbots"))({
	token: "xoxb-102610855889-1LhNkiUIDHgvMistVt0tdiVG",
	name: "pipebot"
});
var params = {
	icon_emoji: ":desktop_computer:"
};
var lines = [];
var updateLoop = function() {
	if(lines.length > 0) {
		bot.postMessageToChannel("general", lines.shift(), params, function(result) {
			if(!result.ok) {
				console.error(result);
			}
			updateLoop();
		});
	}
	setTimeout(updateLoop, 0);
};
bot.on('start', updateLoop);
process.stdin.resume();
process.stdin.setEncoding('utf8');
var remainder = "";
process.stdin.on('data', function(chunk) {
	remainder += chunk;
	var spl = remainder.split("\n");
	remainder = spl[spl.length-1];
	lines = lines.concat(spl.slice(0, spl.length-1));
});
process.stdin.on('end', function() {
	lines.push(remainder);
	remainder = "";
});
