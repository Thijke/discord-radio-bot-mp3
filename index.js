const { Client, Intents } = require("discord.js")
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require("@discordjs/voice");

const client = new Client({
    shards: "auto",
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_VOICE_STATES
    ],
})

client.login("TOKEN HERE"); // your bot tokens

const Channels = ["voice channel id here"]; //if u want multiple channels i multiple servers: const Channels = ["voice channel id here", "second one"]; u can add more if u want.

client.on("ready", async () => {
    for(const channelId of Channels){
        joinChannel(channelId);   
        await new Promise(res => setTimeout(() => res(2), 500))
    }

    function joinChannel(channelId) {
        client.channels.fetch(channelId).then(channel => {
            const VoiceConnection = joinVoiceChannel({
                channelId: channel.id,
                guildId: channel.guild.id,
                adapterCreator: channel.guild.voiceAdapterCreator
            });
            const resource = createAudioResource("https://25233.live.streamtheworld.com/SLAM_MP3_SC", { //the audio source needs to be an mp3 extention
                inlineVolume: true
            });
            resource.volume.setVolume(0.2);
            const player = createAudioPlayer()
            VoiceConnection.subscribe(player);
            player.play(resource);
            player.on("idle", () => {
                try{
                    player.stop()
                } catch (e) { }
                try{
                    VoiceConnection.destroy()
                } catch (e) { }
                joinChannel(channel.id)
            })
        }).catch(console.error)
    }

    client.user.setActivity("Slam! | by thijke#1234", {
        type: "LISTENING",
      });

      console.log(`Joined channel and started playing`)
      
})

client.on("voiceStateUpdate", async (oldState, newState) => {
    if(newState.channelId && newState.channel.type === "GUILD_STAGE_VOICE" && newState.guild.me.voice.suppress) {
        try{
            await newState.guild.me.voice.setSuppressed(false)
        }catch (e) {

        }
    }
})