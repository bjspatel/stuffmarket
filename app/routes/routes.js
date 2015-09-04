module.exports = function(express, app, passport) {
	var config = require("../../config/development.json"),
        restController = require("../controllers/rest/rest")(passport),
		router = express.Router();

	//Process rest routes
    router.post("/api/v1/signup", restController.authentication.signup);
	router.post("/api/v1/signin", restController.authentication.signin);
	router.post("/api/v1/signout", restController.authentication.signout);
    // router.post("/api/v1/fb-signin", restController.authentication.fbSignin);

    router.get("/api/v1/user", restController.user.sendAll);
	router.get("/api/v1/user/range", restController.user.sendRange);
	router.get("/api/v1/user/myprofile", restController.user.sendMyProfile);
	router.get("/api/v1/user/myoffers", restController.user.sendMyOffers);
	router.get("/api/v1/user/:userId", restController.user.sendOne);
	router.put("/api/v1/user/:userId", restController.user.sendUpdate);
	router.delete("/api/v1/user", restController.user.sendDeleteAll);

	router.get("/api/v1/item", restController.item.sendAll);
	router.get("/api/v1/item/:itemId", restController.item.sendOne);
	router.post("/api/v1/item", restController.item.sendAdd);
	router.put("/api/v1/item/:itemId", restController.item.sendUpdate);

	router.get("/api/v1/category", restController.category.sendAll);
	router.get("/api/v1/category/:categoryId", restController.category.sendOne);
	router.post("/api/v1/category", restController.category.sendAdd);
	router.put("/api/v1/category/:categoryId", restController.category.sendUpdate);

	router.get("/api/v1/offerActive", restController.offerActive.sendAll);
	router.get("/api/v1/offerActive/range", restController.offerActive.sendRange);
	router.get("/api/v1/offerActive/:offerActiveId/bid", restController.offerActive.sendBid);
	router.get("/api/v1/offerActive/:offerActiveId", restController.offerActive.sendOne);
	router.post("/api/v1/offerActive", restController.offerActive.sendAdd);
	router.post("/api/v1/offerActive/:offerActiveId/archive", restController.offerArchive.sendArchive);
	router.put("/api/v1/offerActive/:offerActiveId", restController.offerActive.sendUpdate);
	router.delete("/api/v1/offerActive", restController.offerActive.sendDeleteAll);

	router.get("/api/v1/offerArchive", restController.offerArchive.sendAll);
	router.get("/api/v1/offerArchive/:offerArchiveId", restController.offerArchive.sendOne);
	router.put("/api/v1/offerArchive/:offerArchiveId", restController.offerArchive.sendUpdate);

    // router.get("/api/v1/company/:id/broker", restController.broker.sendBrokerData);
    // router.get("/api/v1/broker/:id", restController.broker.sendBrokerData);
    //
	// router.get("/api/v1/company/:id/agent", restController.agent.sendAgentData);
    // router.get("/api/v1/agent/:id", restController.agent.sendAgentData);
	// router.post("/api/v1/agent", restController.agent.inviteAgent);
    //
	// router.get("/api/v1/onboardingPlan", restController.onboardingplan.sendOnboardingPlanData);
	// router.get("/api/v1/onboardingPlan/:id", restController.onboardingplan.sendOnboardingPlanData);

	app.use(router);
};

function isLoggedIn(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	} else {
		res.status(404).end("Authentication required");
	}
}
