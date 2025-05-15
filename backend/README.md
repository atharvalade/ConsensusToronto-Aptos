# EcoChain Aptos Backend

This folder contains the Move smart contracts for the EcoChain platform that run on the Aptos blockchain.

## Smart Contracts

The main contracts include:

- `verification.move`: Handles carbon credit project verification using IoT sensor data

## Deployment Guide

### Prerequisites

1. Install the Aptos CLI:
   ```
   curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
   ```

2. Create a new account on Aptos testnet:
   ```
   aptos init --network testnet
   ```

3. Fund your account with testnet tokens from the faucet:
   ```
   aptos account fund-with-faucet --account <your-address>
   ```

### Deploy the Smart Contract

1. Navigate to the `move` directory:
   ```
   cd backend/move
   ```

2. Update the `ecochain` address in `Move.toml` to your own address.

3. Compile the contract:
   ```
   aptos move compile
   ```

4. Publish the contract to Aptos testnet:
   ```
   aptos move publish --named-addresses ecochain=<your-address>
   ```

## Interacting with the Contract

### Creating a Project

```bash
aptos move run \
  --function-id <your-address>::verification::create_project \
  --args string:"RF-2023-089" string:"Amazon Rainforest Conservation" string:"Brazil" \
  string:"This project focuses on conserving and restoring the Amazon rainforest" \
  string:"reforestation" u64:12450 u64:1845
```

### Submitting IoT Sensor Data for Verification

```bash
aptos move run \
  --function-id <your-address>::verification::submit_sensor_data \
  --args string:"RF-2023-089" string:"3.4653° S" string:"73.8078° W" \
  u64:4280 u64:87 u64:523 u64:2140 \
  hex:"7f2c38e5d3b95a4a0c8f19167d8c5b7d9d2e898432c6f37a12cf42bc198f2d8e"
```

### Checking Verification Status

To check the verification status of a project, you can use the Aptos Explorer to call the view function:

```
get_verification_status(string:"RF-2023-089")
```

## IoT Sensor Data Format

When submitting sensor data for verification, the following parameters are used:

- `project_id`: Unique identifier for the project
- `latitude`/`longitude`: Location coordinates of the sensor
- `co2_absorption_rate`: CO2 absorption in kg/day
- `tree_growth_rate`: Tree growth in mm/month
- `soil_carbon_content`: Soil carbon percentage (multiplied by 100, e.g., 523 = 5.23%)
- `biomass_accumulation`: Biomass accumulation in kg/hectare
- `data_hash`: Cryptographic hash of the raw sensor data for integrity verification

## Verification Process

1. IoT sensors collect environmental data from carbon offset projects
2. Data is submitted to the smart contract for verification
3. Smart contract validates the data and measures against thresholds
4. If verified, carbon credits are awarded based on CO2 absorption rates
5. A verification event is emitted and recorded on the blockchain
6. Projects with verified status can be listed and traded on the marketplace

## Integration with Frontend

The frontend interfaces with these contracts using the Aptos SDK. The verification page displays verified projects and their blockchain data.

## Wallet Integration

To interact with these contracts from the frontend, users will need an Aptos wallet like:

- [Petra Wallet](https://petra.app/)
- [Martian Wallet](https://martianwallet.xyz/)
- [Pontem Wallet](https://pontem.network/) 