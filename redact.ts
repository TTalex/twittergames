import { Client } from "twitter-api-sdk";
import wordsFr from './words'
import wordsEn from './words_en'
const twitterClient = new Client(process?.env?.twitterToken || "")

const get = async(lang: "fr"|"en") => {
    let words = wordsFr
    if (lang === "en")
        words = wordsEn
    const randomWord = words[Math.floor(Math.random() * words.length)]
    const simplifiedWord = randomWord.replace(/é|è|ê|ë/g,"e").replace(/à|â|ä/g,"a").replace(/û|ü/g,"u").replace(/î|ï/g,"i")
    const recentSearch = await twitterClient.tweets.tweetsRecentSearch({
        query: randomWord + " -is:retweet lang:" + lang,
        "tweet.fields": ["created_at", "public_metrics"],
        expansions: ["author_id"],
        "user.fields": ["name", "username", "profile_image_url"]
      })
      if (recentSearch?.data) {
          const tweets = recentSearch.data.map(_tweet => {
              let tweet = {..._tweet}
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
          return {
              data: tweets,
              rawdata: recentSearch.data,
              answer: randomWord,
              includes: recentSearch.includes
          }
      }
}

export default {get}
