const express = require("express");

const db = require("../data/db");

const router = express.Router()

let Post = {
    title: "", // String, required
    contents: "", // String, required
    created_at: Date.now(), // Date, defaults to current date
    updated_at: Date.now() // Date, defaults to current date
}

let comment = {
    text: "", // String, required
    post_id: "", // Integer, required, must match the id of a post entry in the database
    created_at: Date.now(), // Date, defaults to current date
    updated_at: Date.now() // Date, defaults to current date
}

router.get("/", (req, res) => {
    db.find()
    .then(posts => {
            res.status(200).json(posts);
    })
    .catch(error => {
        res.status(500).json({error: "The posts information could not be retrieved."}).end()
    })
})

router.get("/:id", (req, res) => {
    const id = req.params.id
    db.findById(id)
    .then(post => {
        if (!post.id) {
            res.status(404).json({error: "The post with the specified ID does not exist."})
        } else {
            res.status(200).json(post);
        }
    })
    .catch(error => {
        res.status(500).json({error: "The posts information could not be retrieved."}).end()
    })
})

router.get("/:id/comments", (req, res) => {
    const id = req.params.id
    db.findPostComments(id)
    .then(comment => {
        if (comment.length === 0) {
            res.status(404).json({error: "The comment with the specified ID does not exist."})
        } else {
            res.status(200).json(comment);
        }
    })
    .catch(error => {
        res.status(500).json({error: "The comment information could not be retrieved."}).end()
    })
})

router.post("/", (req, res) => {
    Post.title = req.body.title,
    Post.contents = req.body.contents
    db.insert(Post)
    .then(post => {
        if(req.body.contents.length==0 || req.body.title.length==0){
            res.status(404).json({errorMessage: "Please provide title and contents for the post."})
        } else {
            res.status(200).json({post: post})
        }
    }).catch(error => {
        res.status(500).json({error: "The posts information could not be retrieved."}).end()
    })
})

router.post("/:id/comments", (req, res) => {
    comment.text = req.body.text,
    comment.post_id = req.body.post_id
    const id = req.params.id
    db.insertComment(comment)
    .then(comment => {
        if(req.body.post_id == (id)){
            res.status(201).json(comment)
        } else if(req.body.text = 0) {
            res.status(400).json({errorMessage: "Please provide text for the comment."})
        } else {
            res.status(404).json({message: "The post with the specified ID does not exist."})
        }
    }).catch(error => {
        res.status(500).json({error: "The posts information could not be retrieved."}).end()
    })
})

router.put("/:id", (req, res) => {
    const id = req.params.id
    let postToUpdate = {
        title: req.body.title,
        contents: req.body.contents,
        id: id
    }
    db.update(id, postToUpdate)
    .then(post => {
        res.status(200).json(postToUpdate)
    })
})

router.delete("/:id", (req, res) => {
    const id = req.params.id
    db.remove(id)
    .then(post => {
        if (post) {
            res.status(200).json(`succesfully deleted post ${id}`);
        } else {
            res.status(404).json({error: "The post with the specified ID does not exist."})
        }
    })
})

module.exports = router;