import { tweetsData } from './data.js'

const tweetInput = document.getElementById('tweet-input')
const tweetBtn = document.getElementById('tweet-btn')

tweetBtn.addEventListener('click', function () {

    console.log(tweetInput.value)
    tweetInput.value = ""

})

document.addEventListener('click', function (e) {
    if (e.target.dataset.like) {
        let tweetId = e.target.dataset.like
        handleLikeClick(tweetId)
    }
    if (e.target.dataset.retweet) {
        let tweetId = e.target.dataset.retweet
        handleRetweetClick(tweetId)
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

    render()
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