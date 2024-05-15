//routes for Manage-urls page and download-report section

const express = require("express")
const router = express.Router()

const { auth, isAdmin } = require("../middlewares/auth")

const {
    getAllUrlOfUser,
    suspendUrl,
    deleteUrl,
    deleteBulkUrls,
    activateUrl,
    updateShortenedUrl,
} = require("../controllers/Manage-url")

router.get("/urls", auth, getAllUrlOfUser);
router.put("/suspend/:urlId", auth, suspendUrl);
router.delete("/delete/:urlId", auth, deleteUrl);
router.delete("/bulk-delete", auth, deleteBulkUrls);
router.put("/activate/:urlId", auth, activateUrl);
router.put("/edit/:urlId", auth, updateShortenedUrl);

module.exports = router