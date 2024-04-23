const express = require("express")
const router = express.Router();

const {
    getGlobalVariables,
    updateGlobalVariables,
    deleteSelectedDomains,
    deleteSelectedWords,
    addBlockedDomainsWords,
  } = require("../controllers/Global")
  
  const { auth, isAdmin } = require("../middlewares/auth")

  //Global var routes
  router.get("/get-global-variables", auth, isAdmin, getGlobalVariables)
  router.put("/update-global-variables", auth, isAdmin, updateGlobalVariables)  
  router.delete("/delete-blocked-domains", auth, isAdmin, deleteSelectedDomains)  
  router.delete("/delete-blocked-words", auth, isAdmin, deleteSelectedWords)  
  router.post("/add-new-domains-words", auth, isAdmin, addBlockedDomainsWords)  

  //Panel oprions routes 
const {
    addPanelOption,
    deletePanelOption,
    getAllPanelOptions,
} = require("../controllers/Panel")

router.post("/add-panel-options", auth, isAdmin, addPanelOption)
router.get("/get-panel-options", auth, isAdmin, getAllPanelOptions)  
router.delete("/delete-panel-options/:id", auth, isAdmin, deletePanelOption);

//Crete Category
const {
    createCategory,
} = require("../controllers/Category")

router.post("/createCategory", auth, isAdmin, createCategory)


module.exports = router