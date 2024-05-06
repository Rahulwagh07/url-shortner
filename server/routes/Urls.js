//routes for Manage-urls page and download-report section

const express = require("express")
const router = express.Router()

const { auth, isAdmin } = require("../middlewares/auth")

// const {
//     getAllUrl,
//     suspendUrl,
//     deleteUrl,
//     deleteBulkUrls,
// } = require("../controllers/Manage-url")

// router.get("/urls", auth, getAllUrl);
// router.put("/suspend/:urlId", auth, suspendUrl);
// router.delete("/delete/:urlId", auth, deleteUrl);
// router.delete("/bulk-delete", auth, deleteBulkUrls);

module.exports = router