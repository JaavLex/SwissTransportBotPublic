const Discord = require("discord.js");
const superagent = require("superagent");

module.exports = {
  name: "next-transport",
  aliases: ["nt"],
  category: "Swiss Transports",
  description: "Tells you when is the next public transport from your city to your destination and gives you more information when specifying the departure number!",
  usage: "++next-transport <from> <to> [depature number]",
  run: async (bot,message,args) => {
      // Gets API infos
      let {body} = await superagent
      .get(`http://transport.opendata.ch/v1/connections?from=${args[0]}&to=${args[1]}`);

      var output = ``;

      // Creates the embed for error messages
      function DiscordError (ErrorString)
      {
        let errorembed = new Discord.RichEmbed()
        .setColor("RED")
        .setTitle("**ERROR! :**")
        .addField("**Issue :**", `${ErrorString}`)
        .setTimestamp()
        .setFooter("Usage : ++next-transport <from> <to> [departurenumber]");
        message.channel.send(errorembed);
      }
      // Gets the 3 next departing transports and converting hour format
      if (body.connections[0]) {
        for (let i = 0; i <= 2; i++)
        {
          var date = new Date(body.connections[i].from.departure),
          hours   = ("0" + date.getHours()).slice(-2)
          minutes = ("0" + date.getMinutes()).slice(-2)

          output += `*${i + 1}.* **${hours}:${minutes}** `;
          if (i <= 1) {
            output += "- "
          }
        }
      }
      // Sends a message with the time of departure of the 3 next transports
      if (args[0] && args[1] && !args[2] && body.connections[0])
      {
        let timeembed = new Discord.RichEmbed()
        .setColor("#ff9900")
        .setTitle(`**Departing trains :**`)
        .addField(`${args[0].toUpperCase()} to ${args[1].toUpperCase()} :`, `${output}`)
        .setThumbnail("https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/1ad2e474538729.5c361fd42e9a6.png")
        .setTimestamp()
        .setFooter("From transport.opendata.ch");
        message.channel.send(timeembed);
        // Sends more info about one of the 3 next departures
      } else if (args[2]) {
        // Creates the embed format for the departure information
        function DepartingInfo(InfArg)
        {
          let timeembed = new Discord.RichEmbed()
          .setColor("#ff9900")
          .setTitle(`**__Additionnal info :__**`)
          .addField(`**${InfArg + 1}. | ** Transport from ${args[0].toUpperCase()} to ${args[1].toUpperCase()} :`, `-----------------------------------------------------------------------------`)
          .addField(`Operator :`, `${body.connections[InfArg].sections[0].journey.operator}`, true)
          .addField(`Category of transport :`, `${body.connections[InfArg].sections[0].journey.category}`, true)
          .addField(`Transport Number :`, `${body.connections[InfArg].sections[0].journey.number}`, true)
          .addField(`From station :`, `${body.connections[InfArg].from.station.name}`, true)
          .addField(`Number of stops :`, `${body.connections[InfArg].sections.length}`, true)
          .addField(`Time to destination :`, `${body.connections[InfArg].duration.slice(3, 11)}`, true)
          .setTimestamp()
          .setFooter("From transport.opendata.ch");

          // Changes the picture depending on the transport operator
          if (body.connections[InfArg].sections[0].journey.operator == "LEB") {
            timeembed.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Logo_LEB_2017.svg/1200px-Logo_LEB_2017.svg.png")
          } else if (body.connections[InfArg].sections[0].journey.operator == "SBB") {
            timeembed.setThumbnail("https://worldsummit.ai/wp-content/uploads/sites/4/2019/06/SBB-logo.png")
          } else if (body.connections[InfArg].sections[0].journey.operator == "TL") {
            timeembed.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Logo_Transport_publics_de_la_region_lausannoise.svg/1200px-Logo_Transport_publics_de_la_region_lausannoise.svg.png")
          } else {
            timeembed.setThumbnail("https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/1ad2e474538729.5c361fd42e9a6.png")
          }
          message.channel.send(timeembed);
        }
        // Departing transport selector
        if (args[2] == "1" || args[2] == "2" || args[2] == "3")
        {
          if (args[2] == "1") {
            var InfArg = 0;
          } else if (args[2] == "2") {
            var InfArg = 1;
          } else if (args[2] == "3") {
            var InfArg = 2;
          }
          DepartingInfo(InfArg);
        } else {
          let errorembed = new Discord.RichEmbed()
          .setColor("RED")
          .setTitle("**ERROR! :**")
          .addField("**Issue :**", "You must put a number between **1 and 3** in order to select a departure")
          .setTimestamp()
          .setFooter("Usage : ++next-transport <from> <to>");
          message.channel.send(errorembed);
        }
        // All possible error messages
      } else if (!args[0] || !args[1] || !body.connections[0]) {
        if (!args[0]) {
          var ErrorString = "You havent put any city names! Specify them after `++next-transport`";
        } else if (!args[1]) {
          var ErrorString = "You need to put the name of **2 or 3** cities!";
        } else if (!body.connections[0]) {
          var ErrorString = "One of the name of your cities doesn't exist";
        }
        DiscordError(ErrorString);
      }
  }
}
