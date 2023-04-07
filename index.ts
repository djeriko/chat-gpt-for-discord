import { Client, GatewayIntentBits } from "discord.js"
import axios from "axios"

const client = new Client({ intents: [GatewayIntentBits.Guilds] })

client.on("ready", () => {
  console.log(`Logged in as ${client?.user?.tag}`)
})

client.on("message", async (message) => {
  if (message.author.bot) return

  const text = message.content

  const response = await axios.post(
    "https://api.openai.com/v1/engines/davinci-codex/completions",
    {
      prompt: text,
      max_tokens: 50,
      n: 1,
      stop: "\n",
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  )

  const result = response.data.choices[0].text.trim()

  message.channel.send(result)
})

client.login(process.env.DISCORD_BOT_TOKEN)
