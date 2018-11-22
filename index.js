//set up
let express = require('express')
let app = express();
let bodyParser = require('body-parser')

//If a client asks for a file,
//look in the public folder. If it's there, give it to them.
app.use(express.static(__dirname + '/public'));

//this lets us read POST data
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//make an empty list
let posts = [];


//let a client GET the list
function sendPostsList(request, response) {
  response.send(posts);
}
app.get('/posts', sendPostsList);

//let a client POST something new
function saveNewPost(request, response) {

  //write it on the command prompt so we can see
  console.log(request.body.message);
  console.log(request.body.photo);
  console.log(request.body.author);
  console.log(request.body.answer1);
  console.log(request.body.answer2);
  console.log(request.body.answer3);
  console.log(request.body.answer4);


let post= {};
post.message = request.body.message;
post.photo = request.body.photo;
post.time = new Date();
post.author = request.body.author;
post.answers = []; //empty list
post.answers.push(request.body.answer1);
post.answers.push(request.body.answer2);
post.answers.push(request.body.answer3);
post.answers.push(request.body.answer4);
if (post.photo === "") {
   post.photo = "https://93546-d-c.ooyala.com/content/images/1131/259836_636x357.jpg"
 }
posts.push(post);
  response.send("thanks for your message. Press back to add another");
}
app.post('/posts', saveNewPost);


//listen for connections on port 3000
app.listen(process.env.PORT || 3000);
console.log("Hi! I am listening at http://localhost:3000");
