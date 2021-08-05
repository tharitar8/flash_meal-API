const express = require('express')
const passport = require('passport')
const RecipeList = require('./../models/recipe')
const { handle404, requireOwnership } = require('../../lib/custom_errors')
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', {session: false})
const router = express.Router()

// INDEX
// GET /recipesList
router.get('/recipeslist', requireToken, (req, res, next) => {
  RecipeList.find({'owner': req.user.id})
    .then(recipeslist => {
      return recipeslist.map(recipeslist => recipeslist.toObject())
    })
    .then(recipeslist => res.status(200).json({ recipeslist }))
    .catch(next)
})
// SHOW
// GET /recipeslist/5a7db6c74d55bc51bdf39793
router.get('/recipeslist/:id', requireToken, (req, res, next) => {
  RecipeList.findById(req.params.id)
    .then(handle404)
    .then((recipelist) => res.status(200).json({ recipelist: recipelist.toObject() }))
    .catch(next)
})
// CREATE
// POST /examples
router.post('/recipeslist', requireToken, (req, res, next) => {
  console.log(req.body)
  req.body.recipelist.owner = req.user._id
  const recipelistData = req.body.recipelist
  RecipeList.create(recipelistData)
    .then((recipelist) => {
      res.status(201).json({ recipelist: recipelist.toObject() })
    })
    .catch(next)
})
// UPDATE
// PATCH /recipeslist/5a7db6c74d55bc51bdf39793
router.patch('/recipeslist/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.recipelist.owner
  RecipeList.findById(req.params.id)
    .then(handle404)
    .then(recipelist => {
      requireOwnership(req, recipelist)
      return recipelist.updateOne(req.body.recipelist)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})
// DESTROY
// DELETE /recipeslist/5a7db6c74d55bc51bdf39793
router.delete('/recipeslist/:id', requireToken, (req, res, next) => {
  RecipeList.findById(req.params.id)
    .then(handle404)
    .then(recipelist => {
      requireOwnership(req, recipelist)
      recipelist.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
