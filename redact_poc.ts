import { Client } from "twitter-api-sdk";
import words from './words'
import readline from 'readline';

const main = async() => {
    const rl = readline.createInterface(process.stdin, process.stdout);

    const randomWord = words[Math.floor(Math.random() * words.length)]
    const simplifiedWord = randomWord.replace(/é|è|ê|ë/g,"e").replace(/à|â|ä/g,"a").replace(/û|ü/g,"u").replace(/î|ï/g,"i")
    const twitterClient = new Client(process?.env?.twitterToken || "")
    const recentSearch = await twitterClient.tweets.tweetsRecentSearch({
        query: randomWord + " -is:retweet lang:fr",
        "tweet.fields": ["created_at", "public_metrics"],
        expansions: ["author_id"],
        "user.fields": ["name", "username", "profile_image_url"]

      })
      if (recentSearch?.data) {
          const tweets = recentSearch.data.map(tweet => {
              let simplifiedTweet = tweet.text.toLowerCase().replace(/é|è|ê|ë/g,"e").replace(/à|â|ä/g,"a").replace(/û|ü/g,"u").replace(/î|ï/g,"i")
              let matchIndex = simplifiedTweet.match(simplifiedWord)?.index
              while (matchIndex !== undefined) {
                  const matchedWord = tweet.text.slice(matchIndex, matchIndex + simplifiedWord.length)
                  tweet.text = tweet.text.replace(matchedWord, "█".repeat(randomWord.length))
                  simplifiedTweet = tweet.text.toLowerCase().replace(/é|è|ê|ë/g,"e").replace(/à|â|ä/g,"a").replace(/û|ü/g,"u").replace(/î|ï/g,"i")
                  matchIndex = simplifiedTweet.match(simplifiedWord)?.index
              }
              return tweet
          })
          console.log(tweets)

          rl.question(`What is the word? ${randomWord.length} letters\n`, answer => {
              if (answer == randomWord) {
                  console.log("yay !")
              } else {
                  console.log("No, it was", randomWord)
              }
              process.exit()
          })
      }
}

main()
