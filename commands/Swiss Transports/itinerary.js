const Discord = require("discord.js");
const superagent = require("superagent");

module.exports = {
  name: "itinerary",
  aliases: ["i"],
  category: "Swiss Transports",
  description: "Gives you the detail of an itinerary",
  usage: "++itinerary <from> <to>",
  run: async (bot,message,args) => {
      let {body} = await superagent
      .get(`http://transport.opendata.ch/v1/connections?from=${args[0]}&to=${args[1]}`);

        var date = new Date(body.connections[0].from.departure),
        hours   = date.getHours(),
        minutes = date.getMinutes();

        var output  = ("0" + hours).slice(-2) + ':' + ("0" + minutes).slice(-2) + ' h';

        if (args[0] && args[1] && !args[2] && body.connections[0])
        {
          let timeembed = new Discord.RichEmbed()
          .setColor("#ff9900")
          .setTitle(`**__itinerary :__**`)
          .addField("**Itinerary info :**", `${args[0].toLowerCase()} to ${args[1].toLowerCase()}\nDeparture time : ${output}`)
          .addBlankField()
          .setThumbnail("https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/1ad2e474538729.5c361fd42e9a6.png")
          .setTimestamp()
          .setFooter("From transport.opendata.ch");

          for (let i = 0; i < (body.connections[0].sections.length); i++) {
            if (body.connections[0].sections[i].walk)
            {
              timeembed.addField(`**#${i + 1} Stop, Walking time :**`, `${body.connections[0].sections[i].walk.duration / 60} minutes`, true)
              timeembed.addField(`Destination:`, `${body.connections[0].sections[i].arrival.station.name}`, true)
              timeembed.addBlankField()

            } else {
              timeembed.addField(`**#${i + 1} Stop, Transport Category :**`, `${body.connections[0].sections[i].journey.category}`, true)
              timeembed.addField(`Transport Number: :`, `${body.connections[0].sections[i].journey.number}`, true)
              timeembed.addField(`Transport Operator: :`, `${body.connections[0].sections[i].journey.operator}`, true)
              timeembed.addField(`Destination:`, `${body.connections[0].sections[i].journey.to}`, true)
              timeembed.addBlankField()
            }
          }

          message.channel.send(timeembed);
        } else if (!args[0]) {
          let errorembed = new Discord.RichEmbed()
          .setColor("RED")
          .setTitle("**ERROR! :**")
          .addField("**Issue :**", "You havent put any city names! Specify them after `++itinerary`")
          .setTimestamp()
          .setFooter("Usage : ++itinerary <from> <to>");
          message.channel.send(errorembed);
        } else if (!args[1] || args[2]) {
          let errorembed = new Discord.RichEmbed()
          .setColor("RED")
          .setTitle("**ERROR! :**")
          .addField("**Issue :**", "You need to put the name of **2** cities!")
          .setTimestamp()
          .setFooter("Usage : ++itinerary <from> <to>");
          message.channel.send(errorembed);
        } else if (!body.connections[0]) {
          let errorembed = new Discord.RichEmbed()
          .setColor("RED")
          .setTitle("**ERROR! :**")
          .addField("**Issue :**", "One of the name of your cities doesn't exist")
          .setTimestamp()
          .setFooter("Usage : ++itinerary <from> <to>");
          message.channel.send(errorembed);
        }
      }
}
