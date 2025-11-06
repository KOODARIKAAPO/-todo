import { expect } from "chai"
import app from "./index.js"
import { pool } from "./helper/db.js"
import { initializeTestDb, insertTestUser, getToken } from "./helper/test.js"
import 'dotenv/config'

let server

before(async () => {
  const port = process.env.PORT || 3001
  server = await new Promise((resolve) => {
    const listener = app.listen(port, () => resolve(listener))
  })
})

after(async () => {
  if (server?.listening) {
    await new Promise((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()))
    })
  }
  await pool.end()
})

describe("Testing basic database functionality", () => {
  let token = null
  const testUser = { email: "foo@foo.com", password: "password123" }

  before(async () => {
    await initializeTestDb()
    token = getToken(testUser.email)
  })

  it("should get all tasks", async () => {
    const response = await fetch("http://localhost:3001/")
    const data = await response.json()

    expect(response.status).to.equal(200)
    expect(data).to.be.an("array").that.is.not.empty
    expect(data[0]).to.include.all.keys(["id", "description"])
  })

  it("should create a new task", async () => {
    const newTask = { description: "Test task" }

    const response = await fetch("http://localhost:3001/create", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: token, // ei "Bearer "
      },
      body: JSON.stringify({ task: newTask }),
    })

    const data = await response.json()
    expect(response.status).to.equal(201)
    expect(data).to.include.all.keys(["id", "description"])
    expect(data.description).to.equal(newTask.description)
  })

  it("should delete task", async () => {
    // luodaan ensin poistettava task
    const createRes = await fetch("http://localhost:3001/create", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ task: { description: "To be deleted" } }),
    })
    const created = await createRes.json()
    expect(createRes.status).to.equal(201)

    const delRes = await fetch(`http://localhost:3001/delete/${created.id}`, {
      method: "delete",
      headers: { Authorization: token },
    })
    const delData = await delRes.json()

    expect(delRes.status).to.equal(200)
    expect(delData.deleted).to.equal(true)
    expect(delData.id).to.equal(created.id)
  })

  it("should not create a new task without description", async () => {
    const response = await fetch("http://localhost:3001/create", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ task: {} }),
    })

    const data = await response.json()
    expect(response.status).to.equal(400)
    expect(data).to.have.property("error")
  })
})

describe("Testing user management", () => {
  const user = { email: "foo2@test.com", password: "password123" }

  before(async () => {
    // alustetaan kanta ja lisätään käyttäjä signin-testiä varten
    await initializeTestDb()
    await insertTestUser(user)
  })

  it("should sign up", async () => {
    const newUser = { email: "foo3@test.com", password: "password123" }

    const response = await fetch("http://localhost:3001/user/signup", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user: newUser }),
    })

    const data = await response.json()
    expect(response.status).to.equal(201)
    expect(data).to.include.all.keys(["id", "email"])
    expect(data.email).to.equal(newUser.email)
  })

  it("should log in", async () => {
    const response = await fetch("http://localhost:3001/user/signin", {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user }),
    })

    const data = await response.json()
    expect(response.status).to.equal(200)
    expect(data).to.include.all.keys(["id", "email", "token"])
    expect(data.email).to.equal(user.email)
  })
})
