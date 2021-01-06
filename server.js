const express = require("express");
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
const fs = require("fs");

const app = express();
app.use(expressLayouts);
app.use(express.static(path.join(__dirname, "./public")));
app.use("/charts", express.static(path.join(__dirname, "./public")));

app.set("layout", "./layouts/full-width");
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.render("index", { title: "D3 Data Visualization" });
});

app.get("/about", (req, res) => {
  res.render("about", {
    title: "D3 Data Visualization",
    layout: "./layouts/sidebar",
  });
});

app.get("/charts", (req, res) => {
  fs.readdir("./public/scripts", (err, files) => {
    const fnames = Array(files.length)
      .fill(0)
      .map((_, idx) => idx + 1);
    res.render("charts", {
      title: "D3 Data Visualization",
      layout: "./layouts/full-width",
      cardInfo: fnames.map((x) => ({
        link: `/charts/${x}`,
        title: `Chart ${x}`,
        subtitle: "D3 for visualization",
        desc:
          "These D3 plots are made following the book 'Fullstack D3 and data visualization' by Amelia Wattenberger.",
      })),
    });
  });
});

app.get("/charts/:id", (req, res) => {
  res.render("single-chart", {
    title: "D3 Visualization",
    chartID: `chart-${req.params.id}`,
    chartSource: `chart-${req.params.id}.js`,
    layout: "./layouts/chart",
  });
});

// Serving the app
app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running at http://localhost:${process.env.PORT || 3000}`);
});
