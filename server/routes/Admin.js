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
  router.get("/get-global-variables", auth, getGlobalVariables)
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
  router.get("/get-panel-options", getAllPanelOptions)  
  router.delete("/delete-panel-options/:id", auth, isAdmin, deletePanelOption);

//Category Routes
  const {
      createCategory,
  } = require("../controllers/Category")

  router.post("/createCategory", auth, isAdmin, createCategory)

//manage users
  const {
    getAllUsers,
    suspendUsers,
    activateUsers,
    deleteUsers,
  } = require("../controllers/ManageUser")

  router.get("/getAllUsers", auth, isAdmin, getAllUsers);
  router.put("/suspendUsers", auth, isAdmin, suspendUsers);
  router.put("/activateUsers", auth, isAdmin, activateUsers);
  router.delete("/deleteUsers", auth, isAdmin, deleteUsers);

module.exports = router