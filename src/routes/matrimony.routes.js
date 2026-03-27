import * as matrimonyController from "../controllers/matrimony.controller";
export default async function matrimonyRoutes(app) {
    // POST: Create Profile
    app.post("/create-profile", matrimonyController.createProfile);
}
