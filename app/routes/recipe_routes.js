const express = require('express')
const passport = require('passport')
const Recipe = require('./../models/recipe')
const { handle404, requireOwnership } = require('../../lib/custom_errors')
const removeBlanks = require('../../lib/remove_blank_fields')
const requireToken = passport.authenticate('bearer', {session: false})
const router = express.Router()

// INDEX
// GET /recipesList
router.get('/recipes', requireToken, (req, res, next) => {
  Recipe.find({'owner': req.user.id})
    .then(recipes => {
      return recipes.map(recipes => recipes.toObject())
    })
    .then(recipes => res.status(200).json({ recipes }))
    .catch(next)
})
// SHOW
// GET /recipes/5a7db6c74d55bc51bdf39793
router.get('/recipes/:id', requireToken, (req, res, next) => {
  Recipe.findById(req.params.id)
    .then(handle404)
    .then((recipe) => res.status(200).json({ recipe: recipe.toObject() }))
    .catch(next)
})
// CREATE
// POST /examples
router.post('/recipes', requireToken, (req, res, next) => {
  // console.log(req.body)
  const recipeData = req.body.recipe
  recipeData.owner = req.user._id
  Recipe.create(recipeData)
    .then(recipe => res.status(201).json({ recipe }))
    .catch(next)
})
// UPDATE
// PATCH /recipes/5a7db6c74d55bc51bdf39793
router.patch('/recipes/:id', requireToken, removeBlanks, (req, res, next) => {
  delete req.body.recipe.owner
  Recipe.findById(req.params.id)
    .then(handle404)
    .then(recipe => {
      requireOwnership(req, recipe)
      return recipe.updateOne(req.body.recipe)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})
// DESTROY
// DELETE /recipe/5a7db6c74d55bc51bdf39793
router.delete('/recipes/:id', requireToken, (req, res, next) => {
  Recipe.findById(req.params.id)
    .then(handle404)
    .then(recipe => {
      requireOwnership(req, recipe)
      recipe.deleteOne()
    })
    .then(() => res.sendStatus(204))
    .catch(next)
})

module.exports = router
