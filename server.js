const express = require("express")
const session = require("express-session")
const app = express()

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))

const PORT = 3000
app.listen(PORT, () => {
  console.log("The is server up and running");
})

app.get("/pokemons", async (req, res) => {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/pokemon")
    const response_JSON = await response.json()
    res.json(response_JSON.results)

  } catch (error) {

    res.status(500).json({
      "error": "Failed to fetch Pokemon Data"
    })
  }

})

app.use(express.static('public'))

const validUsers = [
  { "username": "ash", "password": "pikachu" },
  { "username": "misty", "password": "starmie" },
  { "username": "brock", "password": "onix" },
]


app.use(express.json())
app.post("/api/login", (req, res) => {
  const username = req.body.username
  const password = req.body.password


  const userFound = validUsers.find(aUser => aUser.username == username && aUser.password == password)


  if (userFound) {
    // logged successfully
    req.session.user = {}
    req.session.user.username = username
    req.session.user.pokemonsArray = []

    res.json({
      "message": "Login successful"
    })
  }
  else
    res.status(401).json({
      "error": "Invalid credentials"
    })
})


// how to protect the next two routes

isAuthenticated = function (req, res, next) {
  if (!req.session.user)
    return res.status(401).json({
      "error": "Unauthorized"
    })


  next()
}


app.use(isAuthenticated) // apply this middle for all the following routes

app.post("/api/favorite", (req, res) => {
  if (!req.session.user.pokemonsArray.includes(req.body.pokemon))
    req.session.user.pokemonsArray.push(req.body.pokemon)
  res.json({
    "message": "Added to favorites",
    "favorite": req.session.user.pokemonsArray
  })
})

app.get("/api/favorites", (req, res) => {

  res.json(req.session.user.pokemonsArray)
})
