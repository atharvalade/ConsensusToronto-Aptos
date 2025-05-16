# EcoChain Technical Architecture

## System Overview

EcoChain is built as a multi-layered system that combines blockchain technology with IoT integration and a user-friendly frontend. The architecture consists of three main components:

1. **Smart Contracts (Aptos/Move)**
2. **Backend Services**
3. **Frontend Application**

```
+---------------------+     +---------------------+     +---------------------+
|                     |     |                     |     |                     |
|  Frontend (Next.js) |<--->| Backend Services   |<--->| Aptos Blockchain    |
|                     |     |                     |     |                     |
+---------------------+     +---------------------+     +---------------------+
                                    ^
                                    |
                                    v
                            +---------------------+
                            |                     |
                            |  IoT Sensor Network |
                            |                     |
                            +---------------------+
```

## Smart Contracts (Aptos/Move)

The blockchain layer is built on Aptos using the Move language and consists of two main modules:

### 1. Verification Module (`verification.move`)

This module handles the verification of carbon offset projects using IoT sensor data:

- **Data Structures**:
  - `Project`: Stores project metadata (ID, name, location, description, type)
  - `SensorData`: Tracks IoT readings (CO2 absorption, tree growth, soil carbon, etc.)
  - `VerificationStatus`: Maintains the current verification state of a project

- **Key Functions**:
  - `create_project`: Registers a new carbon offset project with metadata
  - `submit_sensor_data`: Records IoT sensor readings with location and timestamp
  - `verify_project`: Evaluates sensor data against thresholds to determine project validity
  - `get_verification_status`: View function to check a project's current status

### 2. Marketplace Module (`marketplace.move`)

This module manages the tokenization and trading of carbon credits:

- **Data Structures**:
  - `CarbonCredit`: Represents a tokenized carbon credit with project ID and offset amount
  - `Listing`: Contains information about credits available for sale
  - `Portfolio`: Tracks a user's owned and retired carbon credits

- **Key Functions**:
  - `mint_carbon_credit`: Creates new tokens based on verified project data
  - `list_for_sale`: Makes credits available on the marketplace with a price
  - `purchase_credit`: Handles the transaction between buyer and seller
  - `retire_credit`: Permanently removes credits from circulation after use

## Backend Services

### 1. IoT Data Integration

- **Sensor Network Management**: Handles connection to various IoT device types (air quality, soil sensors, etc.)
- **Data Preprocessing**: Cleans and normalizes raw sensor data before submission
- **Cryptographic Verification**: Creates hash signatures of sensor data for blockchain submission

### 2. API Services

- **Project Registry API**: Manages project metadata and provides data to the frontend
- **Blockchain Interface**: Abstracts blockchain interactions for easier frontend integration
- **Analytics Engine**: Processes verification data to generate insights and reports

## Frontend Application (Next.js)

### 1. Core Components

- **WalletConnector**: Integrates with Aptos wallets (Petra, Martian, Pontem)
- **ProjectExplorer**: Displays verified carbon projects with filtering capabilities
- **Marketplace**: Interface for buying, selling, and retiring carbon credits
- **VerificationDashboard**: Visualizes real-time IoT data and verification status

### 2. User Flows

- **Project Verification**: Allows project owners to submit and monitor verification status
- **Carbon Credit Trading**: Enables users to buy, sell, and manage their carbon credits
- **Retirement Process**: Provides a mechanism to permanently retire credits for offsetting

## IoT Sensor Integration

### 1. Sensor Types

- **Air Quality Sensors**: Measure ambient CO2, methane, and other greenhouse gases
- **Soil Carbon Sensors**: Monitor carbon sequestration in soil
- **Biomass Monitors**: Track growth rates of vegetation in reforestation projects
- **Energy Output Meters**: Measure renewable energy generation for energy projects

### 2. Data Verification

- **Location Stamping**: GPS coordinates ensure sensors are in the claimed location
- **Timestamp Verification**: Ensures readings are current and continuous
- **Data Hash**: Creates a cryptographic fingerprint of the raw data for integrity
- **Anomaly Detection**: Identifies suspicious patterns that might indicate tampering

## Deployment Architecture

The application is deployed on Aptos Testnet with the following components:

- **Smart Contracts**: Deployed on Aptos Testnet with gas-optimized operations
- **Backend**: Node.js services for IoT integration and data processing
- **Frontend**: Next.js application hosted on Vercel with serverless functions
- **Database**: MongoDB for storing project metadata and IoT readings (off-chain data)

## Security Considerations

- **Multi-signature Requirements**: Critical operations require multiple approvals
- **Threshold-based Verification**: Projects must meet minimum criteria across multiple data points
- **Time-locked Operations**: Sensitive actions have cooling periods
- **Audit Trail**: All verifications and transactions maintain a complete history

## Future Extensions

- **Oracle Integration**: Connect with Chainlink or similar oracles for external data
- **Satellite Verification**: Add satellite imagery analysis for visual verification
- **AI-based Verification**: Implement machine learning for advanced pattern recognition
- **Cross-chain Bridge**: Enable interoperability with other blockchain carbon markets 