const { Command } = require("commander");

const commander = new Command();

commander.option("--mode <mode>", "Working mode", "development").parse();

module.exports = {
  commander
};
