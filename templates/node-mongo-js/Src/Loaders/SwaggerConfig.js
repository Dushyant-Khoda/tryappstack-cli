import path from "path";
import swaggerJSDoc from "swagger-jsdoc";
const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Node API (MongoDB + JavaScript)",
            version: "1.0.0",
            description: `<p>This API provides endpoints for user authentication, profile management, ground bookings, and more.</p> \n\n [Postman Documentor]() \n\n[Requirement Docs]() \n\n[Figma Design File]()\n\n[Backend Repository]() \n\n[Frontend Repository]() \n\n[Estimation Sheet]()`,
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
                url: "http://localhost:9461", // Replace with your base URL
            },
        ],
    },
    apis: [path.resolve(__dirname, "../Routes/*.js")], // Path to the API docs
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);

export default swaggerDocs;
