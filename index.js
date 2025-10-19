import { tweetsData as initialTweetsData } from './data.js'
import { v4 as uuidv4} from 'https://jspm.dev/uuid'

let tweetsData = JSON.parse(localStorage.getItem("tweetsData")) || initialTweetsData;



document.addEventListener('click', function (e) {
    if (e.target.dataset.like) {
        let tweetId = e.target.dataset.like
        handleLikeClick(tweetId)
    }
    if (e.target.dataset.retweet) {
        let tweetId = e.target.dataset.retweet
        handleRetweetClick(tweetId)
    }
    if (e.target.dataset.reply){
        let tweetId = e.target.dataset.reply
        handleReplyClick(tweetId)
    }
    if (e.target.id == "tweet-btn"){
        handleTweetBtnClick()
    }
    if (e.target.classList.contains('myreply-button')){
        let tweetId = e.target.dataset.tweetid
        handleMyReplyBtnClick(tweetId)
    }
})





function handleLikeClick(tweetId) {

    const targetTweetObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked === false) {
        targetTweetObj.likes++
    } else {
        targetTweetObj.likes--
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked

    localStorage.setItem("tweetsData", JSON.stringify(tweetsData))

    render()

}


function handleRetweetClick(tweetId) {

    const targetTweetObj = tweetsData.filter(function (tweet) {
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isRetweeted) {
        targetTweetObj.retweets--
    } else {
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted

    localStorage.setItem("tweetsData", JSON.stringify(tweetsData))

    render()
}


function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle("hidden")
}


function handleMyReplyBtnClick(tweetId){
    //get the reply textarea for the specific tweet
    const replyInput = document.getElementById(`reply-input-${tweetId}`)
    
    if (!replyInput.value){
        console.log("you must enter a valid reply")
        return
    }
    
    //find the tweet (full xrisimi praktiki)
    const targetTweet = tweetsData.find(tweet => tweet.uuid === tweetId)
    
    if (targetTweet) {
        //create the new reply object
        const newReply = {
            handle: `@OGTwink`,
            profilePic: `images/literallyme.jpeg`,
            tweetText: replyInput.value,
            uuid: uuidv4()
        }
        
        //add the reply to the target tweet's replies array
        targetTweet.replies.unshift(newReply)
        
        replyInput.value = ''

        localStorage.setItem("tweetsData", JSON.stringify(tweetsData))
        
        render()
    }
}




//handle new tweets manually inputed by user
function handleTweetBtnClick(){
    
    const tweetInput = document.getElementById(`tweet-input`)

    if (!tweetInput.value){
        console.log("you must enter a valid string")
    } else{
        let newTweet = {
        handle: `@OGTwink`,
        profilePic: `images/literallyme.jpeg`,
        likes: 0,
        retweets: 0,
        tweetText: `${tweetInput.value}`,
        replies: [],
        isLiked: false,
        isRetweeted: false,
        uuid: uuidv4(),
    }

    
    
    //push  them into the array and make them appear in the screen
    tweetsData.unshift(newTweet)
    tweetInput.value = ''

    localStorage.setItem("tweetsData", JSON.stringify(tweetsData))
    
    render()
    }
    
}




function getFeedHtml() {
    let feedHtml = ``
        
    
    
    tweetsData.forEach(function (tweet) {

        //conditional css class switches for likes and retweets
        let likedClass = ''
        let retweetedClass = ''
        if (tweet.isLiked) {
            likedClass = "liked"
        }
        if (tweet.isRetweeted) {
            retweetedClass = "retweeted"
        }


        
        
        //handle tweet replies
        let repliesHTML = ""
    
        let myReply = `
                <div class="myreply" id="myreply">
                    <img src="images/literallyme.jpeg" class="profile-pic">
                    <textarea placeholder="ekfrasou elefthera omorfopaido" class="reply-input" id="reply-input-${tweet.uuid}"></textarea>
                    <button class="myreply-button" id="myreply-button" data-tweetid="${tweet.uuid}">Twink</button>
                </div>`

        if (tweet.replies.length > 0) {

            tweet.replies.forEach(function(reply){
                repliesHTML += `
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                        <div>
                            <p class="handle">${reply.handle}</p>
                            <p class="tweet-text">${reply.tweetText}</p>
                        </div>
                    </div>
                </div>
                `
            })


        }


        
        feedHtml +=
            `
            <div class="tweet">
                <div class="tweet-inner">
                    <img src="${tweet.profilePic}" class="profile-pic">
                    <div>
                        <p class="handle">${tweet.handle}</p>
                        <p class="tweet-text">${tweet.tweetText}</p>
                        <div class="tweet-details">
                            <span class="tweet-detail">
                                <i class="fa-regular fa-comment-dots" data-reply="${tweet.uuid}"></i>
                                ${tweet.replies.length}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-heart ${likedClass}" data-like="${tweet.uuid}"></i>
                                ${tweet.likes}
                            </span>
                            <span class="tweet-detail">
                                <i class="fa-solid fa-retweet ${retweetedClass}" data-retweet="${tweet.uuid}"></i>
                                ${tweet.retweets}
                            </span>
                        </div>   
                    </div>                 
                </div>
                

                
                <div id="replies-${tweet.uuid}">
                    ${myReply}
                    
                    ${repliesHTML} 
                </div>
                
            </div>
        `
    })
    return feedHtml
}

function render() {
    document.getElementById('feed').innerHTML = getFeedHtml()
}


render()