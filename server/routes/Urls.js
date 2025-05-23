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
} = require("../controllers/ManageUrl")

router.get("/urls", auth, getAllUrlOfUser);
router.put("/suspend", auth, suspendUrl);
router.delete("/delete/:urlId", auth, deleteUrl);
router.delete("/bulk-delete", auth, deleteBulkUrls);
router.put("/activate", auth, activateUrl);
router.put("/edit/:urlId", auth, updateShortenedUrl);

module.exports = router