const Home = require("../models/home");
const fs = require("fs");
const path = require("path");

// Show form to add a new home
exports.getAddHome = (req, res, next) => {
  res.render("host/edit-home", {
    pageTitle: "Add Home to Airbnb",
    currentPage: "addHome",
    editing: false,
    isLoggedIn: req.isLoggedIn,
    user: req.user,
  });
};

// Show form to edit a home
exports.getEditHome = (req, res, next) => {
  const homeId = req.params.homeId;
  const editing = req.query.editing === "true";

  Home.findById(homeId).then((home) => {
    if (!home) {
      console.log("Home not found for editing.");
      return res.redirect("/host/host-home-list");
    }

    res.render("host/edit-home", {
      home: home,
      pageTitle: "Edit your Home",
      currentPage: "host-homes",
      editing: editing,
      isLoggedIn: req.isLoggedIn,
      user: req.user,
    });
  });
};

// Show list of all host homes
exports.getHostHomes = (req, res, next) => {
  Home.find().then((registeredHomes) => {
    res.render("host/host-home-list", {
      registeredHomes: registeredHomes,
      pageTitle: "Host Homes List",
      currentPage: "host-homes",
      isLoggedIn: req.isLoggedIn,
      user: req.user,
    });
  });
};

// Add a new home
exports.postAddHome = (req, res, next) => {
  const { houseName, price, location, rating, description } = req.body;
  const photo = req.file ? req.file.path : null;

  const home = new Home({
    houseName,
    price,
    location,
    rating,
    photo,
    description,
  });

  home.save()
    .then(() => {
      console.log("Home Saved successfully");
      res.redirect("/host/host-home-list");
    })
    .catch(err => {
      console.log("Error while saving home: ", err);
    });
};

// Edit an existing home
exports.postEditHome = (req, res, next) => {
  const { id, houseName, price, location, rating, description } = req.body;

  Home.findById(id)
    .then((home) => {
      if (!home) {
        console.log("Home not found");
        return res.redirect("/host/host-home-list");
      }

      home.houseName = houseName;
      home.price = price;
      home.location = location;
      home.rating = rating;
      home.description = description;

      // If new photo uploaded
      if (req.file) {
        // Delete old photo
        if (home.photo && typeof home.photo === "string") {
          const oldPhotoPath = path.join(__dirname, "..", home.photo);
          console.log("Deleting old photo at:", oldPhotoPath);

          fs.unlink(oldPhotoPath, (err) => {
            if (err) {
              console.error("❌ Error deleting old photo:", err.message);
            } else {
              console.log("✅ Old photo deleted successfully.");
            }
          });
        }

        home.photo = req.file.path; // update with new file path
      }

      return home.save();
    })
    .then((result) => {
      console.log("Home updated:", result);
      res.redirect("/host/host-home-list");
    })
    .catch(err => {
      console.log("Error while updating home:", err);
    });
};

// Delete a home and its photo
exports.postDeleteHome = (req, res, next) => {
  const homeId = req.params.homeId;
  console.log("Deleting home:", homeId);

  Home.findByIdAndDelete(homeId)
    .then((home) => {
      if (!home) {
        console.log("Home not found for deletion.");
        return res.redirect("/host/host-home-list");
      }

      // Delete the associated photo file
      if (home.photo && typeof home.photo === "string") {
        const photoPath = path.join(__dirname, "..", home.photo);
        fs.unlink(photoPath, (err) => {
          if (err) {
            console.log("❌ Error deleting photo:", err.message);
          } else {
            console.log("✅ Photo deleted successfully.");
          }
        });
      }

      res.redirect("/host/host-home-list");
    })
    .catch((error) => {
      console.log("Error while deleting home:", error);
    });
};
