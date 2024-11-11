require("dotenv").config();
const mongoose = require("mongoose");

// Definisikan skema untuk model Person
const personSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: Number,
  favoriteFoods: [String],
});

// Buat model Person
const Person = mongoose.model("Person", personSchema);

// Fungsi untuk menyimpan orang baru
const createAndSavePerson = async () => {
  const person = new Person({
    name: "Bill",
    age: 5,
    favoriteFoods: ["Chicken"],
  });
  return await person.save();
};

// Fungsi untuk menyimpan banyak orang
const createManyPeople = async (arrayOfPeople) => {
  try {
    const people = await Person.insertMany(arrayOfPeople);
    return people;
  } catch (err) {
    throw err;
  }
};

// Fungsi untuk mencari orang berdasarkan nama
const findPeopleByName = async (personName) => {
  try {
    const people = await Person.find({ name: personName });
    return people;
  } catch (err) {
    throw err;
  }
};

// Fungsi untuk mencari satu orang berdasarkan makanan favorit
const findOneByFood = async (food) => {
  try {
    const person = await Person.findOne({ favoriteFoods: food });
    return person;
  } catch (err) {
    throw err;
  }
};

// Fungsi untuk mencari orang berdasarkan ID
const findPersonById = async (personId) => {
  try {
    const person = await Person.findById(personId);
    if (!person) {
      throw new Error("Person not found");
    }
    return person;
  } catch (err) {
    throw err;
  }
};

// Fungsi untuk menambahkan makanan favorit dan menyimpan perubahan
const findEditThenSave = async (personId) => {
  const foodToAdd = "hamburger";
  try {
    const person = await Person.findById(personId);
    if (!person) {
      throw new Error("Person not found");
    }
    person.favoriteFoods.push(foodToAdd);
    const updatedPerson = await person.save();
    return updatedPerson;
  } catch (err) {
    throw err;
  }
};

// Fungsi untuk memperbarui usia seseorang berdasarkan nama
const findAndUpdate = async (personName) => {
  const ageToSet = 20;
  try {
    const updatedPerson = await Person.findOneAndUpdate(
      { name: personName },
      { age: ageToSet },
      { new: true }
    );
    return updatedPerson;
  } catch (err) {
    throw err;
  }
};

// Fungsi untuk menghapus orang berdasarkan ID
const removeById = async (personId) => {
  try {
    const result = await Person.findByIdAndDelete(personId);
    return result;
  } catch (err) {
    throw err;
  }
};

// Fungsi untuk menghapus banyak orang
const removeManyPeople = async () => {
  const namesToRemove = "Mary"; // Menggunakan string jika hanya satu nama
  try {
    const result = await Person.deleteMany({ name: namesToRemove });
    console.log(`Deleted: ${result.deletedCount} person(s)`);
    return result;
  } catch (err) {
    throw err;
  }
};

// Fungsi untuk melakukan query dengan chaining
const queryChain = async () => {
  const foodToSearch = "burrito";
  try {
    const data = await Person.find({ favoriteFoods: foodToSearch })
      .sort("name")
      .limit(2)
      .select(["name", "favoriteFoods"])
      .exec();
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

// Fungsi utama untuk menghubungkan ke database dan melakukan operasi
async function startApp() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connection success!");

    // Contoh memanggil fungsi untuk menyimpan orang
    const savedPerson = await createAndSavePerson();
    console.log("Saved person:", savedPerson);

    // Panggil fungsi lainnya sesuai kebutuhan
  } catch (err) {
    console.error("Connection error:", err);
  }
}

// Jalankan aplikasi
startApp();

// Ekspor fungsi untuk digunakan di tempat lain
exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
