var config = {
	token: process.env.PIPEBOT_TOKEN,
	name: process.env.PIPEBOT_NAME?process.env.PIPEBOT_NAME:"pipebot",
	icon_emoji: process.env.PIPEBOT_ICON?process.env.PIPEBOT_ICON:":desktop_computer:",
	channel: process.env.PIPEBOT_CHANNEL?process.env.PIPEBOT_CHANNEL:"general"
};
var bot = new (require("slackbots"))({
	token: config.token,
	name: config.name
});
var params = {
	icon_emoji: config.icon_emoji
};
var lines = [];
var updateLoop = function() {
	if(lines.length > 0) {
		bot.postMessageToChannel(config.channel, lines.shift(), params, function(result) {
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
