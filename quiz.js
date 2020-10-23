//api url
url= `http://acnhapi.com/v1/villagers` //${randomVillagerNumber}

//canvas image creation
let canvas = document.querySelector('#canvas')
let context = canvas.getContext('2d')
let image = new Image()

//buttons
let answer_buttons = document.getElementById('answer_buttons')
let result = document.getElementById('result')
let next_button = document.getElementById('next')
let buttons_array = []
let correctAnswersButton = document.querySelector('#correct-answer')
let wrongAnswerButtons = document.querySelectorAll('.wrong-answer')

let count = 1;
let score = 0;
let scores = []

let names = []

function random(data){
    let keys = Object.keys(data);
    return data[keys[keys.length * Math.random() << 0]]
}

function shuffle(array) {
    let j, x, i;
    for (i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = array[i];
        array[i] = array[j];
        array[j] = x;
    }
    return array;
}

function set_up(data){
    image.addEventListener('load', function (){
        context.drawImage(image,(canvas.width-image.width)/2, (canvas.height-image.height)/2)
    })

    let villager = random(data)
    let correctVillagerName = villager.name["name-USen"]
    image.src = villager["image_uri"]
    console.log(correctVillagerName)
    names.push(correctVillagerName)

    for(let i=0; i<3; i++){
        names.push(random(data).name["name-USen"])
    }
    shuffle(names)
    names.forEach(function (n){
        console.log(n)
        buttons = document.createElement('button')
        buttons.innerHTML = n
        buttons.id = n
        buttons_array.push(buttons)
    })
}


//call api
fetch(url)
    .then( (response) => {
        // response is all the things from the server
        console.log(response) // logging response to check if working
        // extract JSON
        return response.json()
    })
    .then( function(data) { //after extracting object from API loop through it for info
        let villager = random(data)
        let correctVillagerName = villager.name["name-USen"]
        set_up(data)
        buttons_array.forEach(function (button){
            if(button.innerHTML === correctVillagerName){
                button.id = 'correct-answer'
            }
            else{
                button.class = 'wrong-answer'
            }
            answer_buttons.appendChild(button)
            button.addEventListener('click', function (){

            })

            next_button.addEventListener('click', function (){
                count++
                console.log(score)
                if (count < 10){
                    result.innerHTML = ''
                    names = []
                    buttons_array = []
                    answer_buttons.innerHTML = ''
                    set_up(data)
                }
                else {
                    let container = document.getElementById('container')
                    document.body.removeChild(container)
                    result.innerHTML = `SCORE = ${score}`
                }
            })
        })



    }) //if issues connecting to API error displays
    .catch( error => {
        console.log(error)
        alert('ERROR')
    })
