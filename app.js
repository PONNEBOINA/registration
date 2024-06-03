const express = require('express')
const sqlite3 = require('sqlite3')
const {open} = require('sqlite')
const path = require('path')
const app = express()
const bcrypt = require('bcrypt')
const dbpath = path.join(__dirname, 'userDate.db')
let db = null
app.use(express.json())

const initializeserver = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server running at http://localhost:3000')
    })
  } catch (e) {
    consoel.log(`DB error:${e.message}`)
    process.exit(1)
  }
}
initializeserver()
module.exports = app

//registration

app.post('/register', async (request, response) => {
  const {username, name, password, gender, location} = request.body
  const hashedpassword = await bcrypt.hash(password, 10)
  const selectuserquary = `SELECT * FROM user WHERE username = '${username}`
  const dbuser = await db.get(selectuserquary)
  if (dbuser === undefined) {
    const createuserQuery = `
        INSERT INTO
         user(username,name,password,gender,location)
        VALUES (
            '${username}',
            '${name}'.
            '${hashedpassword}',
            '${gender}',
            '${location}'      
        )`
    await db.run(createuserQuery)
    response.status(200)
    response.send('User created successfully')
  } else {
    response.status(400)
    respone.send('User already exists')
  }
})
