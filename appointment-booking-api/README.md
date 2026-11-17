# Appointment Booking API

A RESTful Appointment Booking API built using **Node.js, Express.js, MongoDB, and Mongoose**. The application provides secure authentication, role-based access control, appointment slot management, and booking functionality.

## Features

- **User Authentication**
  - User registration and login.
  - Password hashing using bcrypt.
  - JWT-based authentication.

- **Role-Based Authorization**
  - Two roles: User and Provider.
  - Providers can create and manage appointment slots.
  - Users can view availability and book appointments.

- **Appointment Slot Management**
  - Providers can create 30-minute appointment slots.
  - Only future slots are allowed.
  - Overlapping slots for the same provider are prevented.
  - Available slots exclude confirmed bookings.

- **Booking Management**
  - Users can book available appointment slots.
  - Users can view their booking history.
  - Providers can view bookings associated with their slots.
  - Users can cancel their confirmed bookings.
  - Cancelled slots become available again.

- **Conflict Prevention**
  - Each slot can have only one confirmed booking.
  - Each user can have only one active booking.
  - MongoDB partial unique indexes prevent duplicate active bookings.
  - Concurrent booking conflicts return HTTP 409.

- **Error Handling**
  - Centralized error-handling middleware.
  - Consistent API response structure.
  - Request validation and meaningful HTTP status codes.

- **API Documentation**
  - Interactive Swagger documentation.

- **Automated Testing**
  - Jest and Supertest.
  - MongoDB Memory Server for isolated testing.

## Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend framework |
| MongoDB | Database |
| Mongoose | ODM |
| JWT | Authentication |
| bcrypt | Password hashing |
| Swagger | API documentation |
| Jest | Testing framework |
| Supertest | API endpoint testing |
| MongoDB Memory Server | In-memory testing database |

## Project Structure

```text
appointment-booking-api/
│
├── src/
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── model/
│   ├── route/
│   ├── seed/
│   ├── service/
│   ├── utils/
│   ├── app.js
│   └── index.js
│
├── tests/
│   ├── setup.js
│   ├── auth.test.js
│   ├── slot.test.js
│   └── booking.test.js
│
├── .env.example
├── .gitignore
├── jest.config.js
├── package.json
└── README.md
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone <your-github-repository-url>
cd appointment-booking-api
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root using `.env.example` as a reference.

```env
PORT=5000

MONGODB_URI=mongodb://127.0.0.1:27017/appointment_booking

JWT_SECRET=your_secure_random_secret
JWT_EXPIRES_IN=1d

PROVIDER_1_NAME=Dr. John Smith
PROVIDER_1_EMAIL=john@example.com
PROVIDER_1_PASSWORD=your_secure_password

PROVIDER_2_NAME=Dr. Sarah Wilson
PROVIDER_2_EMAIL=sarah@example.com
PROVIDER_2_PASSWORD=your_secure_password

PROVIDER_3_NAME=Dr. David Brown
PROVIDER_3_EMAIL=david@example.com
PROVIDER_3_PASSWORD=your_secure_password
```

**Important:** Replace the example passwords and JWT secret with secure values. Never commit your actual `.env` file.

### 4. Start MongoDB

Make sure your MongoDB server is running and the configured connection URI is accessible.

### 5. Seed provider accounts

Run the provider seed script:

```bash
npm run seed:providers
```

This creates the three provider accounts using the credentials configured in `.env`.

### 6. Start the development server

```bash
npm run dev
```

The API will run at:

```text
http://localhost:5000
```

## API Documentation

Swagger UI provides interactive documentation for all API endpoints.

Open:

```text
http://localhost:5000/api-docs
```

### Authentication APIs

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/auth/register` | Register a user | Public |
| POST | `/api/auth/login` | Login user or provider | Public |

### Slot APIs

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/slots` | Create an appointment slot | Provider |
| GET | `/api/slots/available` | Get available slots | User |

### Booking APIs

| Method | Endpoint | Description | Access |
|---|---|---|---|
| POST | `/api/bookings` | Book an appointment | User |
| GET | `/api/bookings/my-bookings` | View personal booking history | User |
| GET | `/api/bookings` | View bookings for provider's slots | Provider |
| PATCH | `/api/bookings/:id/cancel` | Cancel a booking | User |

## Authentication

The API uses JSON Web Tokens (JWT) for authentication.

After successful login, the API returns an access token.

For protected endpoints, include the token in the request header:

```http
Authorization: Bearer <your_access_token>
```

### Roles and Permissions

| Feature | User | Provider |
|---|---|---|
| Register | Yes | No public provider registration |
| Login | Yes | Yes |
| Create slots | No | Yes |
| View available slots | Yes | No |
| Book appointments | Yes | No |
| View personal bookings | Yes | No |
| View provider bookings | No | Yes |
| Cancel own booking | Yes | No |

Provider accounts are created through the seed script.

## Booking Rules

1. Every appointment slot must be exactly 30 minutes long.
2. Providers can only create future appointment slots.
3. Overlapping slots for the same provider are not allowed.
4. Only users can book appointments.
5. A slot can have only one confirmed booking.
6. A user can have only one confirmed booking at a time.
7. Cancelled bookings remain in booking history.
8. Cancelling a booking makes the slot available again.
9. Simultaneous booking attempts are protected by MongoDB unique indexes. Conflicting requests receive HTTP 409.

## Testing

The project uses Jest, Supertest, and MongoDB Memory Server for automated testing.

Run the complete test suite:

```bash
npm test
```

The tests cover:

- User registration and login.
- Authentication and role authorization.
- Slot creation and validation.
- Slot availability.
- Booking creation and conflict prevention.
- Booking history.
- Booking cancellation and slot reavailability.

## Error Handling

The API uses centralized error-handling middleware and consistent JSON responses.

Example successful response:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

Example error response:

```json
{
  "success": false,
  "message": "Invalid or expired access token",
  "errors": []
}
```

## License

This project was developed as an internship assignment for learning and demonstrating backend REST API development.
