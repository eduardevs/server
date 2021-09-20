const router = require("express").Router();
const Snippet = require("../models/snippetModel");
const auth = require("../middleware/auth");
// router.get("/test", (req, res) => {
//     // console.log("test");
//     res.send("Hello");
// });

router.get("/", auth, async (req, res) => {
  try {
    //     const token = req.cookies.token;
    // console.log(token);
    // console.log(req.user);

    const snippets = await Snippet.find({ user: req.user });
    res.json(snippets);
  } catch (err) {
    // console.log(err);
    res.status(500).send();
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { title, description, code } = req.body;
    // console.log(code);

    // VALIDATION
    if (!description && !code) {
      return res.status(400).json({
        errorMessage: "You need to enter at least a description or some code.",
      });
    }

    // we utilise a constructor to create an object, and parse getting the data in the object
    const newSnippet = new Snippet({
      title,
      description,
      code,
      user: req.user,
    });
    // to save in the DB
    const savedSnippet = await newSnippet.save();

    res.json(savedSnippet);
  } catch (err) {
    // console.log(err);
    res.status(500).send();
  }
});

router.put("/:id", auth, async (req, res) => {
  try {
    const { title, description, code } = req.body;
    const snippetId = req.params.id;

    // validation
    if (!description && !code) {
      return res.status(400).json({
        errorMessage: "You need to enter at least a description or some code.",
      });
    }

    if (!snippetId)
      return res.status(400).json({
        errorMessage: "Snippet id not given. Please contact the developer.",
      });

    const originalSnippet = await Snippet.findById(snippetId);
    if (!originalSnippet)
      return res.status(400).json({
        errorMessage:
          "No snippet with this ID was found. Please contact the developer.",
      });

    if (originalSnippet.user.toString() !== req.user)
      return res.status(401).json({ errorMessage: "Unauthorized." });

    originalSnippet.title = title;
    originalSnippet.description = description;
    originalSnippet.code = code;

    const savedSnippet = await originalSnippet.save();
    res.json(savedSnippet);
  } catch (err) {
    // console.log(err);
    res.status(500).send();
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const snippetId = req.params.id;
    //  console.log(snippetId)
    if (!snippetId)
      return res.status(400).json({
        errorMessage: "Snippet id not given. Please contact the developer.",
      });

    const existingSnippet = await Snippet.findById(snippetId);
    if (!existingSnippet)
      return res.status(400).json({
        errorMessage:
          "No snippet with this ID was not found. Please contact the developer.",
      });

    if (existingSnippet.user.toString() !== req.user)
      return res.status(401).json({ errorMessage: "Unauthorized." });

    await existingSnippet.delete();

    res.json(existingSnippet);
  } catch (err) {
    // console.log(err);
    res.status(500).send();
  }
});

module.exports = router;
