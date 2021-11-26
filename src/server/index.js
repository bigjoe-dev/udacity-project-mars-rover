require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

// Add moment for time format
const moment = require('moment')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))

// Functions
const getRoversInfo = (array) => {
    return array.map((r) => {
        return {
            name: r.name, 
            landing_date: r.landing_date,
            launch_date: r.launch_date,
            status: r.status
        }
    })
}

const getMostRecent = async (rover) => {
    try {
        const images = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/latest_photos?api_key=${process.env.API_KEY}`)
        .then(async res => {
            const resJSON = await res.json()
                return resJSON 
        })
        return images
    } catch (err) {
        console.log('error:', err)
    }
}


// your API calls

// example API call
app.get('/apod', async (req, res) => {
    try {
        let image = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.API_KEY}`)
            .then(res => res.json())
        res.send({ image })
    } catch (err) {
        console.log('error:', err);
    }
})

// Endpoint to get rovers
app.get('/rovers', async (req, res) => {
    try {
        const rovers = await fetch(`https://api.nasa.gov/mars-photos/api/v1/rovers?api_key=${process.env.API_KEY}`)
            .then(async res => {
                const roversJSON = await res.json()
                return getRoversInfo(roversJSON.rovers)
            })
        res.send({rovers})
    } catch (err) {
        console.log('error:', err)
    }
})

// Endpoint to get images based on rover name
app.get('/rover-images', async (req, res) => {
    const rover = req.query.rover
    const images = await getMostRecent(rover)

    res.send(images.latest_photos.map((p) => p.img_src ))
})



app.listen(port, () => console.log(`Example app listening on port ${port}!`))