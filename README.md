# School Payment and Dashboard Application

A microservice for managing school payments and transactions.

## Features

- User Authentication (JWT)
- Payment Gateway Integration
- Transaction Management
- Webhook Processing
- MongoDB Integration

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Payment Gateway credentials

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb+srv://gskabdwal:zjIRtNfo7Kq8gTRW@cluster0.ujezrol.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET=ghfrsyu7643jbh87r3fbjkd
   JWT_EXPIRES_IN=24h
   PAYMENT_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cnVzdGVlSWQiOiI2NWIwZTU1MmRkMzE5NTBhOWI0MWM1YmEiLCJJbmRleE9mQXBpS2V5Ijo2LCJpYXQiOjE3MTE2MjIyNzAsImV4cCI6MTc0MzE3OTg3MH0.Rye77Dp59GGxwCmwWekJHRj6edXWJnff9finjMhxKuw
   PG_KEY=edvtest01
   SCHOOL_ID=65b0e6293e9f76a9694d84b4
   BASE_URL=http://localhost:3000
   ```

4. Start the server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/me` - Get current user

### Payments
- POST `/api/payments/create-payment` - Create new payment
- GET `/api/payments/status/:collect_request_id` - Check payment status
- POST `/api/payments/callback` - Payment callback

### Transactions
- GET `/api/transactions` - Get all transactions
- GET `/api/transactions/school/:schoolId` - Get school transactions
- GET `/api/transactions/status/:custom_order_id` - Get transaction status

### Webhook
- POST `/api/webhook` - Process payment notifications

## Testing

Use Postman to test the API endpoints. Import the provided Postman collection.

## Security

- JWT Authentication
- Request validation
- Error handling
- Secure environment variables

## Error Handling

The API uses consistent error responses:
```json
{
  "message": "Error message"
}
```

## Logging

- Morgan for HTTP request logging
- Custom logging for payment and webhook events

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request 