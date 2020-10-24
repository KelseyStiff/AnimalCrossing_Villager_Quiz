//container holds canvas/image, & answer buttons
let container = document.getElementById('container')

//shows user if the got question right, only after answer button is clicked
let result = document.getElementById('result')

//the api url
url= `http://acnhapi.com/v1/villagers` //${randomVillagerNumber}

//keep track of users score
let score
//keep track of question number
let question_number = 1;
//keep track of if user got correct answer
let correct = false

//canvas & image initialization to hold villager image for question
let canvas = document.querySelector('#canvas')
let context = canvas.getContext('2d')
let image = new Image()

//container to hold all answer buttons
let answer_buttons = document.getElementById('answer_buttons')
//array to hold names of villagers - to populate answer buttons
let names = []
//array to hold answer buttons
let buttons_array = []

let next_button = document.getElementById('next')

//disable next button until image in canvas loads
next_button.disabled = true

//div holding score & try again button
let end_game = document.getElementById('end-game')
let score_placeHolder = document.getElementById('score')
let try_again_button = document.getElementById('try_again')
//div is hidden until user answers 10 questions
end_game.hidden = true

//call the game function when page loads to start
game()

//this function holds the entire game
//populates the question & answers by calling generate_question function,
// next button functionality, displays score & try again button functionality.
function game(){
    score = 0;
    generate_question()
    next_button.addEventListener('click', function (){

        //keeping track of question number
        question_number++

        //only allow 10 questions
        if (question_number < 10){

            //when next button is clicked clear previous question & answers
            result.innerHTML = ''
            names = []
            buttons_array = []
            answer_buttons.innerHTML = ''

            //as described below - this function will call the api & generate the question
            //(villager image,names, answers button creation)
            //when the next button is clicked a new question will populate
            generate_question()
        }
        else {
            //once the user reaches 10 questions, div holding questions is removed
            document.body.removeChild(container)

            //the div(end-game) holding the score & try again button is populated
            end_game.hidden = false

            //score is populated
            score_placeHolder.innerHTML = `SCORE \n ${score}/10`

            //try again button is populated
            try_again_button.innerHTML = 'Try Again!'
            try_again_button.addEventListener('click', function (){

                //once clicked page will reload
                location.reload()

            })//end of try again button even listener
        }
    })//end of next button event listener

}//end of game function

function generate_question(){
    fetch(url)
        .then( (response) => {
            console.log(response) // logging response from the server
            // extract JSON
            return response.json()
        })
        .then( function(data) { //after extracting object from API loop through it for info

            //creates villager image in canvas
            image.addEventListener('load', function (){
                context.drawImage(image,(canvas.width-image.width)/2, (canvas.height-image.height)/2)
                //enable next button once image loads
                next_button.disabled = false
            })//end of image event listener

            //holds random individual villager from api data
            let villager = random(data)

            //set image in canvas to villager image from api
            image.src = villager["image_uri"]

            //holds same villager name that matches villager image
            let correctVillagerName = villager.name["name-USen"]

            //adds correct name to names array
            names.push(correctVillagerName)

            //logging the correct name in the console for easier testing
            console.log(correctVillagerName)

            //loop to add 3 more random names to names array
            for(let i=0; i<3; i++){
                names.push(random(data).name["name-USen"])
            }//end of for loop
            //change names array order so each correct answer isn't same button every question
            shuffle(names)

            //loop through names array to access each name
            names.forEach(function (villager_name){
                //create a button to hold each name / answer
                let buttons = document.createElement('button')
                buttons.innerHTML = villager_name

                //add buttons to an array
                buttons_array.push(buttons)

                //loop through buttons array to mark which button is correct answer vs incorrect
                //and track each individual button
                buttons_array.forEach(function (button){
                    //the correct answer gets an id of correct-answer
                    if(button.innerHTML === correctVillagerName){
                        button.id = 'correct-answer'
                    }
                    else{
                        //the wrong answers all get the class wrong-answer
                        button.class = 'wrong-answer'
                    }//end of if else

                    //all answer buttons & their attributes are added to their container
                    //and populated on the page
                    answer_buttons.appendChild(button)

                    button.addEventListener('click', function (){
                        //when an answer button is clicked all other buttons will disable
                        let buttons_to_disable = answer_buttons.getElementsByTagName('button')
                        //loops through buttons and disables all buttons so
                        //only one click / guess is allowed per question
                        // *this code is referenced from stack overflow*
                        for (let i = 0; i < buttons_to_disable.length; i++) {
                            buttons_to_disable[i].disabled = true
                        }// end of for loop

                        // if the button clicked is the correct answer, the button will turn green
                        //result place holder shows the user they got it correct
                        //correct boolean is set to true to keep track of score
                        if (button.id === 'correct-answer'){
                            button.style.background = '#9EEF7A'
                            result.innerHTML = 'CORRECT!'
                            correct = true;
                        }
                        else {
                            //if the button clicked is wrong answer, the button will turn red, the result
                            //holder will display the correct answer
                            button.style.background = '#E38686'
                            result.innerHTML = `WRONG.<br> This is ${correctVillagerName}!`
                        }//end of if else
                    })//end of button event listener
                })//end of buttons array for each
            })//end of names array for each
        }) //if issues connecting to API error displays
        .catch( error => {
            console.log(error)
            alert('ERROR, VIEW CONSOLE FOR MORE DETAILS')
        })

    //if the user got the answer correct a point is added to score
    if(correct === true){
        score++
        //sets correct back to false before next question
        correct = false
    }//end of if

} //end of generate_question function

//this function pulls a random key from the api
//allows a random villagers data to be retrieved
function random(data){
    let keys = Object.keys(data);
    return data[keys[keys.length * Math.random() << 0]]
} //end of random function

//this function shuffles an array
//it is used to shuffle an array of villager names in order to populate buttons in different order
//** functions code is mostly pulled from stack overflow**
function shuffle(array) {
    let j, x, i;
    for (i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = array[i];
        array[i] = array[j];
        array[j] = x;
    }
    return array;
} //end of shuffle function








