let store = {
    user: { name: "Joe" },
    apod: '',
    rovers: [],
    activeTab: ''
}

// add our markup to the page
const root = document.getElementById('root')

const updateStore = (store, newState) => {
    store = Object.assign(store, newState)
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { rovers, apod } = state

    return `
        <header></header>
        <main>
            ${Greeting(store.user.name)}
            <section>
                ${Rovers(rovers)}
            </section>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    getRovers(store)
    console.log('store:', store)
    render(root, store)
})

// ------------------------------------------------------  COMPONENTS

// Pure function that renders conditional information -- THIS IS JUST AN EXAMPLE, you can delete it.
const Greeting = (name) => {
    if (name) {
        return `
            <h1>Welcome, ${name}!</h1>
        `
    }

    return `
        <h1>Hello!</h1>
    `
}

// Render rovers to DOM
const Rovers = (rovers) => {
    let returnHTML = `
    <div class="tab">
        ${rovers.reduce((p, c) => {
            return p += `<button class="tablinks" onclick="updateStore(store, { activeTab: '${c.name}' })">${c.name}</button>`
        }, '')}
    </div>
    `
    rovers.map((r) => returnHTML += (`
    <div id="${r.name}" class="${r.name == store.activeTab ? 'tabcontent active' : 'tabcontent'}">
        <p>Latest Images</p> 
        <div class="grid">
            ${r.latest_photos.reduce((p, c) => {
                return p += `<img src="${c}" />`
            }, '')}
        </div>
    </div>
    `))
    return returnHTML
}

// Example of a pure function that renders infomation requested from the backend
const ImageOfTheDay = (apod) => {

    // If image does not already exist, or it is not from today -- request it again
    const today = new Date()
    const photodate = new Date(apod.date)
    console.log(photodate.getDate(), today.getDate());

    console.log(photodate.getDate() === today.getDate());
    if (!apod || apod.date === today.getDate() ) {
        getImageOfTheDay(store)
    }
    // check if the photo of the day is actually type video!
    if (apod.media_type === "video") {
        return (`
            <p>See today's featured video <a href="${apod.url}">here</a></p>
            <p>${apod.title}</p>
            <p>${apod.explanation}</p>
        `)
    } else {
        return (`
            <img src="${apod.image.url}" height="350px" width="100%" />
            <p>${apod.image.explanation}</p>
        `)
    }
}

// ------------------------------------------------------  API CALLS

// Example API call
const getImageOfTheDay = (state) => {
    let { apod } = state

    fetch(`http://localhost:3000/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))

    return data
}

const getRovers = (state) => {
    let { rovers } = state

    fetch(`http://localhost:3000/rovers`)
        .then(res => res.json())
        .then(rovers => updateStore(store, { rovers: rovers.rovers }))
}
