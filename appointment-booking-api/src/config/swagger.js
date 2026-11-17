
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Appointment Booking API",
      version: "1.0.0",
      description:
        "REST API for appointment booking with user authentication, provider management, slot availability, and booking management.",
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Enter your JWT access token",
        },
      },
    },
  },

  apis: ["./src/route/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
