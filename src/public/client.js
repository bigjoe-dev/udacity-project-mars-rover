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
    render(root, store)
}

const render = async (root, state) => {
    root.innerHTML = App(state)
}


// create content
const App = (state) => {
    return `
        <header>
            <h1>Mars Rover Dashboard</h1>
        </header>
        <main>
            <a id="top"></a>
            <section>
                ${Rovers(state, Tabs)}
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
const Tabs = (state) => {
    const { rovers, activeTab } = state.toJS()
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

// Return HTML for rovers
const Rovers = (state, tabs) => {
    const { rovers } = state.toJS()
    let returnHTML = `
    <div class="tab">
        ${rovers.reduce((p, c) => {
            return p += `<button class="${c.name == state.activeTab ? 'tablinks active' : 'tablinks'}" onclick="updateStore(store, { activeTab: '${c.name}' })">${c.name}</button>`
        }, '')}
    </div>
    `
    returnHTML += tabs(state)

    return returnHTML
}

// ------------------------------------------------------  API CALLS
const getRovers = (state) => {
    fetch(`${window.location.origin}/rovers`)
        .then(res => res.json())
        .then(rovers => updateStore(state, { rovers: rovers.rovers }))
}
