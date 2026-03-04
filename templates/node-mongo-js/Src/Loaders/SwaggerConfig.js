import path from "path";
import swaggerJSDoc from "swagger-jsdoc";
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Ground Booking Application",
            version: "1.0.1",
            description: `<p>This application allows users to book grounds easily and access many other features, such as managing profiles, viewing available grounds, and making reservations. The API provides endpoints for user authentication, profile management, ground bookings, and more.</p> \n\n [Postman Documentor](https://documenter.getpostman.com/view/17557433/2sA3sAh7df) \n\n[Requirement Docs](https://docs.google.com/document/d/1n7bzTNohrv8ZuYZSmbqD71makD4r9SdsopXZGm-GGnc/edit#heading=h.nsgtuplyiujm) \n\n[Figma Design File](https://www.figma.com/design/xJCOGRa4bKMapYYGystLwl/Codeintelli-Ground-Booking-App?node-id=696-23686&t=TxG8eRvGO6LkBoOx-0)\n\n[Backend Repository](https://github.com/CodeintelliTech/BE-Ground-Booking) \n\n[Frontend Repository](https://github.com/CodeintelliTech/FE-GroundBooking.git) \n\n[Estimation Sheet](https://docs.google.com/spreadsheets/d/1CS11xpMEfq7VxjnDEBLPJMdWIiKfbbqhv-ZP4HxojZs/edit?usp=sharing)`,
        },
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                BearerAuth: [],
            },
        ],
        servers: [
            {
                url: "https://booking.wpzone.fun", // Replace with your base URL
            },
            {
                url: "http://localhost:9461", // Replace with your base URL
            },
        ],
    },
    apis: [path.resolve(__dirname, "../Routes/*.js")], // Path to the API docs
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default swaggerDocs;
