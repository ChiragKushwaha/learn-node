// it's schema less, you can save objects
// mongoimport --db mongo-exercises --collection courses --file exercise-data.json --jsonArray

const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("connected to MongoDB"))
  .catch((err) => console.log("Could not connect to MongoDb...", err));

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    // match: /pattern/
  },
  category: {
    type: String,
    required: true,
    enum: ["web", "mobile", "network"],
    lowercase: true,
    trim: true, //remove extra space
  },
  author: String,
  tags: {
    type: Array,
    validate: {
      isAsync: true,
      validator: function (v, callback) {
        setTimeout(() => {
          const result = v && v.length > 0;
          callback(result);
        }, 4000);
        // return v && v.length > 0;
      },
      message: "A course should have atleast one tag",
    },
  },
  date: { type: Date, default: Date.now },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function () {
      return this.isPublished;
    },
    min: 10,
    max: 200,
    get: (v) => Math.round(v), // when we read the property value from the database it is called
    set: (v) => Math.round(v), // when we set the value it is called
  },
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

  try {
    // await course.validate();
    //  course.validate((error)=>{
    //    if(error){
    //      console.log(error);
    //    }
    //  });
    const result = await course.save();
    console.log(result);
  } catch (ex) {
    ex.errors.map((e) => console.log(ex.errors[e].message));
    // console.log(ex);
  }
}

// createCourse();

async function getCourses() {
  // eq (equal)
  // ne (not equal)
  // gt (greater than)
  // gte (greater than or equal to)
  // lt (less than)
  // lte (less than or equal to)
  // in
  // nin (not in)

  // or
  // and

  const pageNumber = 2;
  const pageSize = 10;

  const courses = await Course.find({ author: "Chirag", isPublished: true })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    // .find({ price: { $gte: 10, $lte: 20 } })
    // .find({ orice: { $in: [10, 15, 20] } })
    // .find()
    // .or([{ author: "Chirag" }, { isPublished: true }])
    // .and([])
    // Starts with Chirag
    // .find({ author: /^Chirag/ })
    // .find({ author: /Kushwaha$/i })
    // .find({ author: /.*Chirag.*/i })
    .limit(10)
    .sort({ name: 1 })
    // .sort('name') <-- ascending
    // .sort('-name') <-- descending
    .count();
  // .select({
  //   name: 1,
  //   tags: 1,
  // })
  // .select('name author')
  console.log(courses);
}

getCourses();

async function updateCourse(id) {
  // query first approach
  // const course = await Course.findById(id);
  // if (!course) return;
  // if (course.isPublished) return;
  // course.isPublished = true;
  // course.author = "Chirag";
  // course.set({
  //   isPublished: true,
  //   author: "Chirag",
  // });
  // const result = await course.save();
  // console.log(result);

  // second approach
  // const result = await Course.update(
  const course = await Course.findByIdAndUpdate(
    id,
    {
      $set: {
        author: "Chirag",
        isPublished: false,
      },
    },
    { new: true } // returns object after updating it
  );

  console.log(course);
}

updateCourse("some id");

async function removeCourse(id) {
  // .deleteMany
  // const result = await Course.deleteOne({ _id: id });
  const course = await Course.findByIdAndRemove(id);
  console.log(course);
}

removeCourse("some id");
