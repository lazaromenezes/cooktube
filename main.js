let recipes = []

const ID_REGEX = /\?v=([\w-]+)/
const EMBED_TEMPLATE = 'https://www.youtube.com/embed/{id}?autoplay=0&controls=1&end=0&loop=0&mute=0&start=0'

const CARD_TEMPLATE = `
<div class='card'>
  <h2 class='card-header'>{name}</h2>
  <div class='card-content'>
    <iframe allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share; fullscreen" loading="eager" referrerpolicy="strict-origin-when-cross-origin" src="{url}" class='cooktube-video' title="{name}"></iframe>
  </div>
  <div class='card-footer'>
    Categorias: {categories}
  </div>
</div>
`

function formatString(template, object) {
  let finalString = template
  for(const property in object){
    const tag = new RegExp(`{${property}}`, 'g')
    finalString = finalString.replace(tag, object[property])
  }
  return finalString
}

function youtubeToEmbed(url) {
  const id = url.match(ID_REGEX)[1]
  return formatString(EMBED_TEMPLATE, {id})
}

async function loadRecipes(content) {
  const rawData = await content.text()
  recipes = rawData
    .trim()
    .split('\n')
    .map((line, idx) => {
      const raw = line.split(';')
      return {
        id: idx,
        name: raw[0],
        url: youtubeToEmbed(raw[1]),
        categories: raw[2].split(','),
      }
    }) 
}

function addRecipeElement(container, recipe) {
  const item = document.createElement('li')
  item.innerHTML = formatString(CARD_TEMPLATE, recipe)
  container.appendChild(item)
}

function renderRecipes() {
  const container = document.getElementById("recipe-list")
  recipes.forEach((recipe) => addRecipeElement(container, recipe))
}

export default async function startCookTube() {
  const content = await fetch('./data.csv')
  await loadRecipes(content)
  renderRecipes()
}

