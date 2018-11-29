//set up
let express = require('express')
let app = express();
let bodyParser = require('body-parser')

let databasePosts = null;

//If a client asks for a file,
//look in the public folder. If it's there, give it to them.
app.use(express.static(__dirname + '/public'));

//this lets us read POST data
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

//make an empty list
let posts = [];


//let a client GET the list
function sendPostsList(request, response) {
  response.send(posts);
}
app.get('/posts', sendPostsList);
app.get('/post', function(request, response) {
  let searchId = request.query.id;
  console.log("Searching for post " + searchId);
  let post = posts.find(x => x.id == searchId);
  response.send(post);
});

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

  let post = {};
  post.message = request.body.message;
  post.photo = request.body.photo;
  post.time = new Date();
  post.author = request.body.author;
  post.id = Math.round(Math.random() * 10000);
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
  databasePosts.insert(post);
}
app.post('/posts', saveNewPost);


//listen for connections on port 3000
app.listen(process.env.PORT || 3000);
console.log("Hi! I am listening at http://localhost:3000");

let MongoClient = require('mongodb').MongoClient;
let databaseUrl = 'mongodb://girlcode2018:hats123@ds039331.mlab.com:39331/girlcode2018-term4';
let databaseName = 'girlcode2018-term4';

MongoClient.connect(databaseUrl, {
  useNewUrlParser: true
}, function(err, client) {
  if (err) throw err;
  console.log("yay we connected to the database");
  let database = client.db(databaseName);
  databasePosts = database.collection('posts');
  databasePosts.find({}).toArray(function(err, results) {
    if (err) throw err;
    console.log("Found " + results.length + " results");
    posts = results
  });
});

function answerChosen(request, response) {
  console.log("Post id: " + request.body.postId);
  console.log("Answer number: " + request.body.answerNumber);
  let post = posts.find(x => x.id == request.body.postId);
  let answerNumber = parseInt(request.body.answerNumber);
  if (post.answerCount === undefined) {
    post.answerCount = [0, 0, 0, 0]; //starting values
    post.totalAnswers = 0;
  }
  post.answerCount[answerNumber]++; //increase counter by one
  post.totalAnswers++; //increase counter by one
  databasePosts.update({
    id: post.id
  }, post);
  response.send("ok");
}
app.post("/answerChosen", answerChosen);