const express = require("express")
const router = express.Router();

const {
    getGlobalVariables,
    updateGlobalVariables,
    deleteSelectedDomains,
    deleteSelectedWords,
  } = require("../controllers/Global")
  
  const { auth, isAdmin } = require("../middlewares/auth")
  router.get("/get-global-variables", auth, isAdmin, getGlobalVariables)
  router.put("/update-global-variables", auth, isAdmin, updateGlobalVariables)  
  router.delete("/delete-blocked-domains", auth, isAdmin, deleteSelectedDomains)  
  router.delete("/delete-blocked-words", auth, isAdmin, deleteSelectedWords)  

module.exports = router