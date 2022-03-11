let fields = document.querySelectorAll('.field__file');
Array.prototype.forEach.call(fields, function (input) {
    let label = input.nextElementSibling,
        labelVal = label.querySelector('.field__file-fake').innerText;

    input.addEventListener('change', function (e) {
        let countFiles = '';
        if (this.files && this.files.length >= 1)
            countFiles = this.files.length;

        if (countFiles)
            label.querySelector('.field__file-fake').innerText = 'Choosen file: ' + countFiles;
        else
            label.querySelector('.field__file-fake').innerText = labelVal;
    });
});

let postForm = document.querySelector('.allNews');
let postContainer = document.querySelector('.posts__body');
let loadPostsBtn = postForm.querySelector('._loadPostsBtn');

class Comment {
    constructor(name, body) {
        this.name = name;
        this.body = body;
    }
}

let posts = [];

class Post {
    constructor(author, body, img, likes, id, date) {

        this.author = author;
        this.body = body;
        this.img = img ? img : '';
        this.likes = likes ? likes : 0;
        this.id = id ? id : new Date().getTime();
        this.date = date ? date : new Date().toLocaleString();


        this.addLike = this.addLike.bind(this);
        this.render();
    }

    // addComment(elem) {
    //     let block = document.createElement('div');
    //     block.classList.add('posts__comment');

    //     block.innerHTML = `
    //         <div class="posts__authorForm">
    //             <label for="nameAuthor" class="posts__form-author">Author</label>
    //             <input type="text" class="posts__form-authorControl" id="nameAuthor" name="authorName">
    //         </div>
    //          <div class="posts__comment-textForm">
    //              <label for="commentText" class="posts__comment-label">New comment</label>
    //              <textarea class="posts__comment-text" id="commentText" rows="3"></textarea>
    //          </div>
    //          <button class="btn btn-submit posts__comment-btn" type="submit">Send post</button>
    //         `;

    //     element.appendChild(block);
    // }

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

    render = () => {
        let element = document.createElement('div');
        element.dataset.id = this.id;
        element.classList.add('posts__news');

        element.innerHTML = `
            <div class="posts__wrap">
                <h3 class="title posts__title">${this.author}</h3>
                <p class="posts__date">${this.date}</p>
            </div>
            <div class="posts__body-info">
                <div class="posts__img-box"></div>
                <div class="posts__descr-body">
                    <p class="posts__descr">${this.body}</p>
                    <div class="posts__descr-item">
                        <button class="posts__likes-btn"><span class="posts__likes">${this.likes}</span></button>
                        <button class="posts__comm-btn"><span class="posts__comm"></span></button>
                    </div>
                </div>
            </div>
        `;

        if (this.img) {
            let imgBox = element.querySelector('.posts__img-box');
            let image = document.createElement('img');
            image.src = `${this.img}`;
            image.classList.add('posts__img');

            imgBox.appendChild(image);
        }

        let likeBtn = element.querySelector('.posts__likes-btn');
        likeBtn.addEventListener('click', this.addLike);

        let commentBtn = element.querySelector('.posts__comm-btn');
        commentBtn.addEventListener('clik', function (e) { })

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
        new Post(post.author, post.body, post.img, post.likes, post.id, post.date);
    })
}

// let url = 'http://localhost:3000/posts';

// // const renderNewPost = (e) => {
// //     e.preventDefault();

// //     let newPost = new Post(e.target.author.value, e.target.text.value, e.target.image.value);

// //     posts.unshift(newPost);

// //     postForm.reset();
// // }

// function formSubmit() {
//     e.preventDefault();

//     let newPost = new Post(e.target.author.value, e.target.text.value);

//     posts.unshift(newPost);

//     posts.forEach(function (post) {
//         let data = {
//             author: post.author,
//             body: post.body,
//             likes: post.likes,
//             id: post.id,
//             date: post.date,
//             img: post.img
//         };

//         let jsonData = JSON.stringify(data);

//         fetch(url, {
//             method: "POST",
//             body: jsonData,
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         });
//     })

//     postForm.reset();

// }

// postForm.addEventListener('submit', formSubmit);

// fetch(url)
//     .then((res) => {
//         return res.json();
//     })
//     .then((data) => {
//         data.forEach(el => {
//             let item = document.createElement('li');
//             item.innerText = el.newToDo;

//             list.appendChild(item);
//         })
//     });