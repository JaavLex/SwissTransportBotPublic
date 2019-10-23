const Discord = require("discord.js");
const superagent = require("superagent");

module.exports = {
  name: "next-transport",
  aliases: ["nt"],
  category: "Swiss Transports",
  description: "Tells you when is the next public transport from your city to your destination and gives you more information when specifying the departure number!",
  usage: "++next-transport <from> <to> [depature number]",
  run: async (bot,message,args) => {
      let {body} = await superagent
      .get(`http://transport.opendata.ch/v1/connections?from=${args[0]}&to=${args[1]}`);

      if (args[0] && args[1]) {
        var date = new Date(body.connections[0].from.departure),
        hours   = date.getHours(),
        minutes = date.getMinutes();

        var date2 = new Date(body.connections[1].from.departure),
        hours2   = date2.getHours(),
        minutes2 = date2.getMinutes();

        var date3 = new Date(body.connections[2].from.departure),
        hours3   = date3.getHours(),
        minutes3 = date3.getMinutes();

        var output  = ("0" + hours).slice(-2) + ':' + ("0" + minutes).slice(-2) + ' h';
        var output2  = ("0" + hours2).slice(-2) + ':' + ("0" + minutes2).slice(-2) + ' h';
        var output3  = ("0" + hours3).slice(-2) + ':' + ("0" + minutes3).slice(-2) + ' h';
      }

      if (args[0] && args[1] && !args[2] && body.connections[0])
      {
        let timeembed = new Discord.RichEmbed()
        .setColor("#ff9900")
        .setTitle(`**__Departing trains :__**`)
        .addField(`${args[0].toLowerCase()} to ${args[1].toLowerCase()} :`, `${output} - ${output2} - ${output3}`)
        .setThumbnail("https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/1ad2e474538729.5c361fd42e9a6.png")
        .setTimestamp()
        .setFooter("From transport.opendata.ch");

        message.channel.send(timeembed);
      } else if (args[2]) {
        if (args[2] == "1") {
          let timeembed = new Discord.RichEmbed()
          .setColor("#ff9900")
          .setTitle(`**__Additionnal info :__**`)
          .addField(`**1st** transport from ${args[0].toLowerCase()} to ${args[1].toLowerCase()} :`, `-----------------------------------------------------------------------------`)
          .addField(`Operator :`, `${body.connections[0].sections[0].journey.operator}`, true)
          .addField(`Category of transport :`, `${body.connections[0].sections[0].journey.category}`, true)
          .addField(`Transport Number :`, `${body.connections[0].sections[0].journey.number}`, true)
          .addField(`From station :`, `${body.connections[0].from.station.name}`, true)
          .addField(`Number of stops :`, `${body.connections[0].sections.length}`, true)
          .addField(`Time of departure :`, `${output}`, true)
          .addField(`Time to destination :`, `${body.connections[0].duration.slice(3, 11)}`, true)
          .setTimestamp()
          .setFooter("From transport.opendata.ch");

          if (body.connections[0].sections[0].journey.operator == "LEB") {
            timeembed.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Logo_LEB_2017.svg/1200px-Logo_LEB_2017.svg.png")
          } else if (body.connections[0].sections[0].journey.operator == "SBB") {
            timeembed.setThumbnail("https://worldsummit.ai/wp-content/uploads/sites/4/2019/06/SBB-logo.png")
          } else if (body.connections[0].sections[0].journey.operator == "TL") {
            timeembed.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Logo_Transport_publics_de_la_region_lausannoise.svg/1200px-Logo_Transport_publics_de_la_region_lausannoise.svg.png")
          } else {
            timeembed.setThumbnail("https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/1ad2e474538729.5c361fd42e9a6.png")
          }

          message.channel.send(timeembed);
        } else if (args[2] == "2") {
          let timeembed = new Discord.RichEmbed()
          .setColor("#ff9900")
          .setTitle(`**__Additionnal info :__**`)
          .addField(`**2nd** transport from ${args[0].toLowerCase()} to ${args[1].toLowerCase()} :`, `-----------------------------------------------------------------------------`)
          .addField(`Operator :`, `${body.connections[1].sections[0].journey.operator}`, true)
          .addField(`Category of transport :`, `${body.connections[1].sections[0].journey.category}`, true)
          .addField(`Transport Number :`, `${body.connections[1].sections[0].journey.number}`, true)
          .addField(`From station :`, `${body.connections[1].from.station.name}`, true)
          .addField(`Number of stops :`, `${body.connections[1].sections.length}`, true)
          .addField(`Time of departure :`, `${output2}`, true)
          .addField(`Time to destination :`, `${body.connections[1].duration.slice(3, 11)}`, true)
          .setTimestamp()
          .setFooter("From transport.opendata.ch");

          if (body.connections[1].sections[0].journey.operator == "LEB") {
            timeembed.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Logo_LEB_2017.svg/1200px-Logo_LEB_2017.svg.png")
          } else if (body.connections[1].sections[0].journey.operator == "SBB") {
            timeembed.setThumbnail("https://worldsummit.ai/wp-content/uploads/sites/4/2019/06/SBB-logo.png")
          } else if (body.connections[1].sections[0].journey.operator == "TL") {
            timeembed.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Logo_Transport_publics_de_la_region_lausannoise.svg/1200px-Logo_Transport_publics_de_la_region_lausannoise.svg.png")
          } else {
            timeembed.setThumbnail("https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/1ad2e474538729.5c361fd42e9a6.png")
          }

          message.channel.send(timeembed);
        } else if (args[2] == "3") {
          let timeembed = new Discord.RichEmbed()
          .setColor("#ff9900")
          .setTitle(`**__Additionnal info :__**`)
          .addField(`**3rd** transport from ${args[0].toLowerCase()} to ${args[1].toLowerCase()} :`, `-----------------------------------------------------------------------------`)
          .addField(`Operator :`, `${body.connections[2].sections[0].journey.operator}`, true)
          .addField(`Category of transport :`, `${body.connections[2].sections[0].journey.category}`, true)
          .addField(`Transport Number :`, `${body.connections[2].sections[0].journey.number}`, true)
          .addField(`From station :`, `${body.connections[2].from.station.name}`, true)
          .addField(`Number of stops :`, `${body.connections[2].sections.length}`, true)
          .addField(`Time to destination :`, `${body.connections[2].duration.slice(3, 11)}`, true)
          .addField(`Time of departure :`, `${output3}`, true)
          .setTimestamp()
          .setFooter("From transport.opendata.ch");

          if (body.connections[2].sections[0].journey.operator == "LEB") {
            timeembed.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Logo_LEB_2017.svg/1200px-Logo_LEB_2017.svg.png")
          } else if (body.connections[2].sections[0].journey.operator == "SBB") {
            timeembed.setThumbnail("https://worldsummit.ai/wp-content/uploads/sites/4/2019/06/SBB-logo.png")
          } else if (body.connections[2].sections[0].journey.operator == "TL") {
            timeembed.setThumbnail("https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Logo_Transport_publics_de_la_region_lausannoise.svg/1200px-Logo_Transport_publics_de_la_region_lausannoise.svg.png")
          } else {
            timeembed.setThumbnail("https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/1ad2e474538729.5c361fd42e9a6.png")
          }

          message.channel.send(timeembed);
        } else {
          let errorembed = new Discord.RichEmbed()
          .setColor("RED")
          .setTitle("**ERROR! :**")
          .addField("**Issue :**", "You must put a number between **1 and 3** in order to select a departure")
          .setTimestamp()
          .setFooter("Usage : ++next-transport <from> <to>");
          message.channel.send(errorembed);
        }
      } else if (!args[0]) {
        let errorembed = new Discord.RichEmbed()
        .setColor("RED")
        .setTitle("**ERROR! :**")
        .addField("**Issue :**", "You havent put any city names! Specify them after `++next-transport`")
        .setTimestamp()
        .setFooter("Usage : ++next-transport <from> <to> [depature number]");
        message.channel.send(errorembed);
      } else if (!args[1]) {
        let errorembed = new Discord.RichEmbed()
        .setColor("RED")
        .setTitle("**ERROR! :**")
        .addField("**Issue :**", "You need to put the name of **2** cities!")
        .setTimestamp()
        .setFooter("Usage : ++next-transport <from> <to> [depature number]");
        message.channel.send(errorembed);
      } else if (!body.connections[0]) {
        let errorembed = new Discord.RichEmbed()
        .setColor("RED")
        .setTitle("**ERROR! :**")
        .addField("**Issue :**", "One of the name of your cities doesn't exist")
        .setTimestamp()
        .setFooter("Usage : ++next-transport <from> <to> [depature number]");
        message.channel.send(errorembed);
      }
  }
}
