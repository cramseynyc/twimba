import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

const tweetInput = document.getElementById('tweet-input')

document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
    else if(e.target.dataset.comment){
        handleCommentBtnClick(e.target.dataset.comment)
    }
    else if(e.target.dataset.delete){
        hadnleDeleteTweetClick(e.target.dataset.delete)
    }
    else if(e.target.dataset.dltcmnt){
        handleDeleteCommentClick(e.target.dataset.dltcmnt, e.target.dataset.replydlt)
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleTweetBtnClick(){

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba`,
            profilePic: `images/scrimbalogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function handleCommentBtnClick(tweetId){
    const targetTweetObj = tweetsData.filter((tweet)=>{
        return tweetId === tweet.uuid
    })[0]
    
    let textComments = document.getElementById(`comments-${tweetId}`).value
    if(textComments){
        targetTweetObj.replies.unshift({
            handle: '@Scrimba',
            profilePic: `images/scrimbalogo.png`,
            tweetText: textComments,
            replyId: uuidv4()
        })
        render()
        textComments = ''
        document.getElementById(`replies-${tweetId}`).classList.remove('hidden')
    } 
}

function hadnleDeleteTweetClick(tweetId){
    const targetTweetObj = tweetsData.filter((tweet)=>{
        return tweetId === tweet.uuid
    })[0]
    
    if(targetTweetObj.handle === '@Scrimba'){
        const findIndex = tweetsData.findIndex((tweet)=>{
            return tweet.uuid === targetTweetObj.uuid
        })
        
        tweetsData.splice(findIndex, 1)
        render()
    }
}

function handleDeleteCommentClick(tweetId, replyId, replyHandle){
    const targetTweetObj = tweetsData.filter((tweet)=>{
        return tweet.uuid === tweetId
    })[0]
    
    const indexToDelete = targetTweetObj.replies.findIndex((reply) => reply.replyId === replyId)
    
    if(targetTweetObj.replies[indexToDelete].handle === '@Scrimba'){
         targetTweetObj.replies.splice(indexToDelete, 1)
    }
    
    render()
    document.getElementById(`replies-${tweetId}`).classList.remove('hidden')
}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
                <div class="tweet-reply">
                    <div class="tweet-inner">
                        <img src="${reply.profilePic}" class="profile-pic">
                            <div>
                                <p class="handle" data-rplyhandle="${reply.handle}">${reply.handle}</p>
                                <p class="tweet-text">${reply.tweetText}</p>
                                <i class="fa-solid fa-trash" data-dltcmnt="${tweet.uuid}" data-replydlt="${reply.replyId}"></i>
                        </div>
                    </div>
                </div>
                `
            })
        }
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text" >${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-sharp fa-solid fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                    <i class="fa-solid fa-trash ${retweetIconClass}"
                    data-delete="${tweet.uuid}"
                    ></i>
            </div>   
        </div>            
    </div>
    <div id="replies-${tweet.uuid}" class='hidden'>
    
    <div class="tweet-comment">
        <img src='images/scrimbalogo.png' class='profile-pic'/>
        <div class='tweet-comment-inner'>
            <p class="handle">@Scrimba</p>
            <textarea id='comments-${tweet.uuid}' placeholder="type comment here..." class="tweet-text tweet-comment-textarea"></textarea>
            <button class="comment-btn" data-comment="${tweet.uuid}">Comment</button>
        </div>
    </div>
        ${repliesHtml}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

