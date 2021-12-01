/* let store = {
    user: { name: "Joe" },
    apod: '',
    rovers: [],
    activeTab: ''
} */

let store = Immutable.Map({
    user: Immutable.Map({ name: "Joe" }),
    apod: '',
    rovers: Immutable.List([]),
    activeTab: ''
})


// add our markup to the page
const root = document.getElementById('root')

const updateStore = (oldState, newState) => {
    store = oldState.merge(newState)
    render(root, store.toJS())
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    let { rovers, apod } = state

    return `
        <header>
            <h1>Mars Rover Dashboard</h1>
        </header>
        <main>
            <a id="top"></a>
            <section>
                ${Rovers(store, Tabs)}
            </section>
            <a href="#top">Back to top</a>
        </main>
        <footer></footer>
    `
}

// listening for load event because page should load before any JS is called
window.addEventListener('load', () => {
    getRovers(store)
})

// ------------------------------------------------------  COMPONENTS

// Tabs for rover content
const Tabs = (store) => {
    const { rovers, activeTab } = store.toJS()
    return rovers.map((r) => (`
            <div id="${r.name}" class="${r.name == activeTab ? 'tabcontent active' : 'tabcontent'}">
                <h3>Name: ${r.name}</h3>
                <ul>
                    <li>Launch date: <b>${r.launch_date}</b></li>
                    <li>Landing date: <b>${r.landing_date}</b></li>
                    <li>Status: <b>${r.status}</b></li>
                </ul>
                <h3>Latest Images</h3> 
                <div class="container">
                    ${r.latest_photos.reduce((p, c) => {
                        return p += `
                        <div class="items photos">
                            <img src="${c}" />
                        </div>
                        `
                    }, '')}
                </div>
            </div>
            `)).reduce((p,c) => p += c)
}

// Render rovers to DOM
const Rovers = (store, tabs) => {
    const { rovers } = store.toJS()
    let returnHTML = `
    <div class="tab">
        ${rovers.reduce((p, c) => {
            return p += `<button class="${c.name == store.activeTab ? 'tablinks active' : 'tablinks'}" onclick="updateStore(store, { activeTab: '${c.name}' })">${c.name}</button>`
        }, '')}
    </div>
    `
    returnHTML += tabs(store)

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

    fetch(`${window.location.origin}/apod`)
        .then(res => res.json())
        .then(apod => updateStore(store, { apod }))

    return data
}

const getRovers = (state) => {
    let { rovers } = state
    fetch(`${window.location.origin}/rovers`)
        .then(res => res.json())
        .then(rovers => updateStore(store, { rovers: rovers.rovers }))
}
