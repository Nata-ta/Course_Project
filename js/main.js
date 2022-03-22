document.querySelector('.more-button').addEventListener('click', function () {
    document.querySelector('.list-container').classList.toggle('active');
});

var mybutton = document.getElementById("myBtn");

window.onscroll = function () { scrollFunction() };

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        mybutton.style.display = "block";
    } else {
        mybutton.style.display = "none";
    }
}

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}

let postForm = document.querySelector('.allNews');
let postContainer = document.querySelector('.posts__body');
let loadPostsBtn = postForm.querySelector('._loadPostsBtn');

// task made by using localStorage

let posts = [];

class Post {
    constructor(author, body, img, likes, id, date, comments) {

        this.author = author;
        this.body = body;
        this.img = img ? img : '';
        this.likes = likes ? likes : 0;
        this.id = id ? id : new Date().getTime();
        this.date = date ? date : new Date().toLocaleString();
        this.comments = comments;

        this.addLike = this.addLike.bind(this);
        this.render();
    }

    addLike() {
        this.likes++;

        const like = document.querySelector(`[data-id="${this.id}"] .posts__likes`);
        like.innerHTML = this.likes;

        posts.forEach(post => {
            if (post.id === this.id) {
                post.likes = this.likes;
            }
        });

        localStorage.setItem('posts', JSON.stringify(posts));
    }

    renderComments = (element) => {

        let allComments = this.comments;

        if (allComments !== undefined) {
            allComments.forEach(comment => {
                let commentContainer = element.querySelector('.posts__form-body');

                let item = document.createElement('div');
                item.dataset.id = this.id;
                item.classList.add('posts__news');

                item.innerHTML = `
                    <div class="posts__comment-body">
                        <div class="posts__comment-wrap">
                            <h4 class="posts__comment-author">${comment.userName}</h4>
                            <p class="posts__comment-date">${comment.commentDate}</p>
                        </div>
                        <p class="posts__comment-descr">${comment.commentText}</p>
                    </div>
                `;

                commentContainer.appendChild(item);

                return;
            });

        }
    }

    render = () => {
        let comments = [];

        if (this.comments !== undefined) {
            this.comments.forEach(comment => {
                comments.push(comment);

                return;
            });
        }

        let element = document.createElement('div');
        element.dataset.id = this.id;
        element.classList.add('posts__news');

        element.innerHTML = `
            <div class="posts__wrap">
                <h3 class="title posts__title">${this.author}</h3>
                <p class="posts__date">${this.date}</p>
            </div>
            <div class="posts__img-box"></div>
            <div class="posts__body-info">
                <div class="posts__descr-body">
                    <p class="posts__descr">${this.body}</p>
                    <div class="posts__descr-item">
                        <button class="posts__likes-btn"><span class="posts__likes">${this.likes}</span></button>
                        <button class="posts__comm-btn"><span class="posts__comm">${comments.length}</span></button>
                    </div>
                </div>
            </div>
        `;

        if (this.img) {
            let imgBox = element.querySelector('.posts__img-box');
            imgBox.style.width = '100%';
            imgBox.style.margin = '0 0 30px';
            let image = document.createElement('img');
            image.src = `${this.img}`;
            image.classList.add('posts__img');

            imgBox.appendChild(image);
        }

        let likeBtn = element.querySelector('.posts__likes-btn');
        likeBtn.addEventListener('click', this.addLike);

        let block = document.createElement('div');
        block.classList.add('posts__comment');

        block.innerHTML = `
            <form class="commentSubmit">
                <h3 class="title posts__comment-title">Comments</h3>
                <div class="posts__form-body">


                </div>
                <div class="posts__authorForm">
                    <label for="nameAuthor" class="posts__form-author">Author</label>
                    <input type="text" class="posts__form-authorControl" id="nameAuthor" name="authorName">
                </div>
                <div class="posts__comment-textForm">
                    <label for="commentText" class="posts__comment-label">New comment</label>
                    <textarea class="posts__comment-text" id="commentText" rows="3" name="commText"></textarea>
                </div>
                <button class="btn btn-submit posts__comment-btn" type="submit">Send post</button>
            </form>
        `;

        element.appendChild(block);

        let commentBtn = element.querySelector('.posts__comm-btn');
        commentBtn.addEventListener('click', function (e) {
            block.classList.toggle('posts__comment-show');

        });

        if (this.commetns !== null) {
            this.renderComments(element);
        };

        let commentContainer = element.querySelector('.posts__form-body');

        let commentSubmit = element.querySelector('.commentSubmit');

        const onFormCommentSubmit = (e) => {
            e.preventDefault();

            let userName = commentSubmit.authorName.value;
            let commentText = commentSubmit.commText.value;
            let commentDate = new Date().toLocaleString();

            let commentsData = {
                userName,
                commentDate,
                commentText
            };

            comments.push(commentsData);

            let item = document.createElement('div');
            item.dataset.id = this.id;
            item.classList.add('posts__news');

            comments.forEach(comment => {
                item.innerHTML = `
                    <div class="posts__comment-body">
                        <div class="posts__comment-wrap">
                            <h4 class="posts__comment-author">${comment.userName}</h4>
                            <p class="posts__comment-date">${comment.commentDate}</p>
                        </div>
                        <p class="posts__comment-descr">${comment.commentText}</p>
                    </div>
                `;
            });

            posts.forEach(post => {
                if (post.id === this.id) {
                    post.comments = comments;
                }
            });

            localStorage.setItem('posts', JSON.stringify(posts));

            commentContainer.appendChild(item);

            let postCommCounter = element.querySelector('.posts__comm');
            postCommCounter.innerHTML = `${comments.length}`;

            commentSubmit.reset();
        }

        commentSubmit.addEventListener('submit', onFormCommentSubmit);

        postContainer.appendChild(element);
    }
}

const onFormSubmit = (e) => {
    e.preventDefault();

    let newPost = new Post(e.target.author.value, e.target.text.value, e.target.image.value);

    posts.unshift(newPost);

    let jsonPost = JSON.stringify(posts);

    localStorage.setItem('posts', jsonPost);

    postForm.reset();
}

postForm.addEventListener('submit', onFormSubmit);

const GetSavedPosts = () => {
    let data = localStorage.getItem('posts');

    if (data !== null) {
        posts = JSON.parse(data);
        return posts;
    }

    return null;
}

let postsFromStorage = GetSavedPosts();

if (postsFromStorage !== null) {
    postsFromStorage.forEach(function (post) {
        new Post(post.author, post.body, post.img, post.likes, post.id, post.date, post.comments);
    })
}

// task made by using json-server


// let url = 'http://localhost:3000/posts';

// const renderComment = (data) => {

//     let allComments = data.comments;

//     allComments.forEach(comment => {
//         let commentContainer = document.querySelector(`[data-id="${data.id}"] .posts__form-body`);

//         let item = document.createElement('div');
//         item.dataset.id = data.id;
//         item.classList.add('posts__news');

//         item.innerHTML = `
//             <div class="posts__comment-body">
//                 <div class="posts__comment-wrap">
//                     <h4 class="posts__comment-author">${comment.userName}</h4>
//                     <p class="posts__comment-date">${comment.commentDate}</p>
//                 </div>
//                 <p class="posts__comment-descr">${comment.commentText}</p>
//             </div>
//         `;

//         commentContainer.appendChild(item);

//         return;
//     });
// };

// const renderePost = (data) => {
//     let comments = [];

//     if (data.comments !== null) {
//         data.comments.forEach(comment => {
//             comments.push(comment);

//             return;
//         });
//     };

//     let element = document.createElement('div');
//     element.dataset.id = data.id;
//     element.classList.add('posts__news');

//     element.innerHTML = `
//         <div class="posts__wrap">
//             <h3 class="title posts__title">${data.author}</h3>
//             <p class="posts__date">${data.date}</p>
//         </div>
//         <div class="posts__img-box"></div>
//         <div class="posts__body-info">
//             <div class="posts__descr-body">
//                 <p class="posts__descr">${data.body}</p>
//                 <div class="posts__descr-item">
//                     <button class="posts__likes-btn"><span class="posts__likes">${data.likes}</span></button>
//                     <button class="posts__comm-btn"><span class="posts__comm">${comments.length}</span></button>
//                 </div>
//             </div>
//         </div>
//     `;

//     if (data.img) {
//         let imgBox = element.querySelector('.posts__img-box');
//         imgBox.style.width = '100%';
//         imgBox.style.margin = '0 0 30px';
//         let image = document.createElement('img');
//         image.src = `${data.img}`;
//         image.classList.add('posts__img');

//         imgBox.appendChild(image);
//     };

//     let likeBtn = element.querySelector('.posts__likes-btn');
//     likeBtn.addEventListener('click', function (e) {

//         data.likes++;

//         const like = document.querySelector(`[data-id="${data.id}"] .posts__likes`);
//         like.innerHTML = `${data.likes}`;

//         let allLikes = data.likes;

//         fetch(`${url}/${data.id}`, {
//             method: "PATCH",
//             body: JSON.stringify({
//                 likes: allLikes
//             }),
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         });
//     });

//     postContainer.appendChild(element);

//     let block = document.createElement('div');
//     block.classList.add('posts__comment');

//     block.innerHTML = `
//         <form class="commentSubmit">
//             <h3 class="title posts__comment-title">Comments</h3>
//             <div class="posts__form-body"></div>
//             <div class="posts__authorForm">
//                 <label for="nameAuthor" class="posts__form-author">Author</label>
//                 <input type="text" class="posts__form-authorControl" id="nameAuthor" name="authorName">
//             </div>
//             <div class="posts__comment-textForm">
//                 <label for="commentText" class="posts__comment-label">New comment</label>
//                 <textarea class="posts__comment-text" id="commentText" rows="3" name="commText"></textarea>
//             </div>
//             <button class="btn btn-submit posts__comment-btn" type="submit">Send post</button>
//         </form>
//     `;

//     element.appendChild(block);

//     let commentBtn = element.querySelector('.posts__comm-btn');
//     commentBtn.addEventListener('click', function (e) {
//         block.classList.toggle('posts__comment-show');
//     });

//     let commentContainer = element.querySelector('.posts__form-body');

//     let commentSubmit = element.querySelector('.commentSubmit');

//     const onFormCommentSubmit = (e) => {
//         e.preventDefault();

//         let userName = commentSubmit.authorName.value;
//         let commentText = commentSubmit.commText.value;
//         let commentDate = new Date().toLocaleString();

//         let commentsData = {
//             userName,
//             commentDate,
//             commentText
//         };

//         let item = document.createElement('div');
//         item.dataset.id = data.id;
//         item.classList.add('posts__news');

//         item.innerHTML = `
//             <div class="posts__comment-body">
//                 <div class="posts__comment-wrap">
//                     <h4 class="posts__comment-author">${userName}</h4>
//                     <p class="posts__comment-date">${commentDate}</p>
//                 </div>
//                 <p class="posts__comment-descr">${commentText}</p>
//             </div>
//         `;

//         commentContainer.appendChild(item);

//         comments.push(commentsData);

//         fetch(`${url}/${data.id}`, {
//             method: "PATCH",
//             body: JSON.stringify({
//                 comments: comments
//             }),
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         });

//         let postCommCounter = element.querySelector('.posts__comm');
//         postCommCounter.innerHTML = `${comments.length}`;

//         commentSubmit.reset();
//     };

//     commentSubmit.addEventListener('submit', onFormCommentSubmit);
// };

// postForm.addEventListener('submit', function () {
//     let data = {
//         author: postForm.author.value,
//         body: postForm.text.value,
//         img: postForm.image.value,
//         likes: 0,
//         id: new Date().getTime(),
//         date: new Date().toLocaleString(),
//         comments: []
//     };

//     let jsonData = JSON.stringify(data);

//     fetch(url, {
//         method: "POST",
//         body: jsonData,
//         headers: {
//             "Content-Type": "application/json"
//         }
//     });

//     renderePost(data);
// });

// fetch(url)
//     .then(res => res.json())
//     .then(res => {
//         res.forEach(item => {
//             if (item !== null) {
//                 renderePost(item);
//                 renderComment(item);
//             }
//         })
//     });