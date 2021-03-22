// it's schema less, you can save objects
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("connected to MongoDB"))
  .catch((err) => console.log("Could not connect to MongoDb...", err));

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
});

//Model
const Course = mongoose.model("course", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "Something",
    author: "Chirag",
    tags: ["node", "backend"],
    isPublished: true,
  });

  const result = await course.save();
  console.log(result);
}

// createCourse();

async function getCourses() {
  const courses = await Course.find({ author: "Chirag", isPublished: true })
    .limit(10)
    .sort({ name: 1 })
    .select({
      name: 1,
      tags: 1,
    });
  console.log(courses);
}

getCourses();
