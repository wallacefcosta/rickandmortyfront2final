const section = document.getElementById('container')
const pagination = document.getElementById('pagination')

async function listCharacters(page) {
    const response = await axios.get(`https://rickandmortyapi.com/api/character/?page=${page}`)
    console.log(response.data)
    return response.data 
}

function groupThePages(pages, group){
    const groupPages = []
    let qtd = group -1

    for(let i = 1; i <= pages; i+=group){
        let array = []
        for(let j = i; j <= i + qtd; j++){
            if(j === pages + 1){
                break
            }
            array.push(j)
        }
        
        groupPages.push(array)
    }
    return groupPages
}

async function nameEpisode(episode) {
    const response = await axios.get(`${episode}`)
    console.log(response.data.name)
    return response.data.name
}

async function renderCard(page) {
    const character = await listCharacters (page)
    const allPromisse = character.results.map( async (character) => {
        const lastEpisode = character.episode.length - 1
        const episode = character.episode [lastEpisode]
        const getEpisode = await nameEpisode (episode)
        return {character, getEpisode}
    })
    
    const resolveAllPromisse = Promise.all(allPromisse)
    const data = await resolveAllPromisse

    cardTemplate(data)
    
    return character.info.pages
}

function cardTemplate(data){
    section.innerHTML = ""
    data.map(async (item, index)=> {
        const {image, name, status, species, location} = item.character
        const {episode} = item
        // const [episod]} = item 
        // console.log(getEpisode)
       
            section.innerHTML += `

            <div class="card">
            <figure class="card__image">
                <img class="card__image-content" src=${image}>
            </figure>
            <div class="card__content">
                <h3 class="card_title color-green">${name}</h3>
                <div class="card__features color-black">
                    <p class="card_status">${cardStatus(status)}<span class="card_status_seperate">-</span></p>
                    <p class="card_species"> ${species} </p>
                </div>
                <p class="card_location_info color-black">Última localização conhecida</p>
                <p class="card_location color-gray">${location.name}</p>
                <p class="card_episode_info color-black">Vista a ultima vez em:</p>
                <p class="card_episode color-gray">${episode}</p>
            </div>
        </div>
        ${index % 2 !== 0 && index !== 19? `<span class="divisor"></span>`: ``}
        
        `
        
    })
}

function cardStatus(status){

    switch (status) {
        case "Alive":
            return  `<span class="circle circle__green"></span> Alive`
        case "Dead":
            return `<span class="circle circle__red"></span> Dead`
        default:
            return `<span class="circle circle__gray"></span> Unknown`
    }

}

let counter = 0

async function renderBtn () {
    const numOfPages = await renderCard(1)
    const groupBtn = groupThePages(numOfPages, 5)
    const btnPrev = document.createElement("button")
    const btnContainer = document.createElement("div")
    const btnNext = document.createElement("button")
    const containerPages = document.createElement("div")
    
    btnPrev.classList.add(`btnPrev`)
    btnContainer.classList.add(`btnContainer`)
    btnNext.classList.add(`btnNext`)

    btnPrev.innerText = 'Anterior'
    btnNext.innerText = 'Próxima'

    containerPages.appendChild(btnPrev)
    containerPages.appendChild(btnContainer)
    containerPages.appendChild(btnNext)
    pagination.appendChild(containerPages)
    

    createBtns(counter, btnContainer, groupBtn)

    btnPrev.addEventListener("click", (e)=>{
        //console.log(e.target)
        console.log(counter)
        if(counter >= 1){
            counter--
        }
     
        btnContainer.innerHTML = ""
        createBtns(counter, btnContainer, groupBtn)
    
    })
    
    btnNext.addEventListener("click", (e)=>{
    
        console.log(counter)
        if(counter < groupBtn.length - 1){
            counter++
        }
     
        btnContainer.innerHTML = ""
        createBtns(counter, btnContainer, groupBtn)
        //console.log(arrayBtns[0])
    })
}

renderBtn()

function createBtns(counter, btns, groupBtn) {
    let array = []
    for(let i = 0; i < groupBtn[counter].length; i++){
        const btn = document.createElement("button")
        
        btn.setAttribute("id", `${groupBtn[counter][i]}`)
        btn.innerText = `${groupBtn[counter][i]}`
        btn.classList.add("controller__btn--length")
        btns.appendChild(btn)
        array.push(btn)

        btn.addEventListener("click", (e)=>{
            
            for(let i = 0; i < array.length; i++){
                array[i].removeAttribute("disabled")
                 
            }

            let btnCurrent = document.getElementById(`${e.target.id}`)
            
            btnCurrent.setAttribute("disabled", true)
           
            console.log(btnCurrent)
            renderCard(groupBtn[counter][i])
        })
    }

    return true
}


async function infoGerais () {
    const infoGerais = document.getElementById(`infoGerais`)
    const character = await axios.get("https://rickandmortyapi.com/api/character")
    const episode = await axios.get("https://rickandmortyapi.com/api/location")
    const location = await axios.get("https://rickandmortyapi.com/api/location")

    const personages = document.createElement('p')
    personages.innerText = `PERSONAGENS: ${character.data.info.count}`
    
    const episodes = document.createElement('p')
    episodes.innerText = `EPISÓDIOS: ${episode.data.info.count}`
    
    const localizacoes = document.createElement('p')
    localizacoes.innerText = `LOCALIZAÇÕES: ${location.data.info.count}`

    infoGerais.appendChild(personages)
    infoGerais.appendChild(episodes)
    infoGerais.appendChild(localizacoes)
}

infoGerais()

async function pesquise () {
    try {
    const search = document.getElementById('search').value
    const character = await axios.get(`https://rickandmortyapi.com/api/character/?name=${search}`
    )

    const allPromisse = character.data.results.map( async (character) => {
        const lastEpisode = character.episode.length - 1
        const episode = character.episode [lastEpisode]
        const getEpisode = await nameEpisode (episode)
        return {character, getEpisode}
    })
    
    const resolveAllPromisse = Promise.all(allPromisse)
    const data = await resolveAllPromisse

    cardTemplate(data)
    
    } catch {
        section.innerHTML = "Personagem não encontrado!"
    }    

}

const searchIcon = document.getElementById('lupa')

searchIcon.addEventListener (`click`, () => {
    pesquise()
  
})