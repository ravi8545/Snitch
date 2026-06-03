import app from "./src/app.js";
import connectDB from "./src/config/db.js";



const startServer = async () => {
    try {
        await connectDB();
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        }   
        );
    } catch (error) {
        console.error("Failed to connect to the database", error);
        process.exit(1);
    }
};

startServer();

