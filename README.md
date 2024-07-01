# Number Verification API demo

## Overview

This project integrates [Number Verification
API](https://developer.vonage.com/en/number-verification/overview) to implement
user authentication using the mobile phone connected to mobile network.

## Prerequisites

- A [Vonage Developer Account](https://developer.vonage.com).
- Node.js and npm installed.
- A valid phone number in one of the supported countries (Spain/Germany)

## Getting Started

1. Clone the repository and change directories

2. Install the required packages:
   ```bash
   npm install
   ```

3. Copy the `.env.example` file to `.env` file in the project root and include the following environment variables (all variables are mandatory):
   ```bash
   cp .env.example .env
   ```
   ```bash
    VONAGE_APPLICATION_ID=your_application_id

    JWT=your_jwt_token

    REDIRECT_URI=https://your-server.com/callback
   ```

4. Run the application:
   ```bash
   node app.js
   ```

5. Open the page from the mobile phone that you want to verify. **Important** The phone must be connected to the mobile network. If you are connected to any WiFi network the authentication won't work.

