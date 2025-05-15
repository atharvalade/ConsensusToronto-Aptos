# EcoChain Carbon Credit Verification Platform - Deployment Guide

This guide provides step-by-step instructions for deploying the EcoChain carbon credit verification platform on the Aptos blockchain testnet.

## Prerequisites

Before you begin, ensure you have the following:

1. **Aptos CLI**: Used to deploy and interact with Move modules
   ```bash
   curl -fsSL "https://aptos.dev/scripts/install_cli.py" | python3
   ```

2. **Node.js and npm**: Required for running the IoT data generator and marketplace initialization scripts
   ```bash
   # Install via NVM (recommended)
   curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
   nvm install 16
   nvm use 16
   ```

3. **Aptos Wallet**: Create an account on Aptos testnet using the CLI
   ```bash
   aptos init --network testnet
   ```

4. **Testnet Tokens**: Fund your testnet account
   ```bash
   aptos account fund-with-faucet --account default
   ```

## Deployment Process

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/ecochain-aptos.git
cd ecochain-aptos
```

### Step 2: Deploy Smart Contracts

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Make the deployment script executable:
   ```bash
   chmod +x aptos_deploy.sh
   ```

3. Deploy contracts using the deployment script:
   ```bash
   ./aptos_deploy.sh 0x123...your_address
   ```

   This script will:
   - Update the `ecochain` address in `Move.toml` to your account address
   - Compile the Move contracts
   - Publish them to Aptos testnet
   - Create a test project
   - Submit sample IoT data for verification

### Step 3: Initialize the Marketplace

1. Make the marketplace initialization script executable:
   ```bash
   chmod +x marketplace_init.js
   ```

2. Run the script to generate marketplace initialization commands:
   ```bash
   node marketplace_init.js
   ```

3. Update the address in the generated scripts:
   ```bash
   cd marketplace_scripts
   # Replace YOUR_ADDRESS with your Aptos account address
   sed -i '' 's/YOUR_ADDRESS/0x123...your_address/g' *.sh
   ```

4. Run the initialization scripts:
   ```bash
   chmod +x initialize_all.sh
   ./initialize_all.sh
   ```

### Step 4: Generate IoT Sensor Data

1. Make the IoT data generator executable:
   ```bash
   chmod +x generate_iot_data.js
   ```

2. Generate IoT data for all projects:
   ```bash
   node generate_iot_data.js
   ```

3. Update your address in the verification scripts:
   ```bash
   cd scripts
   # Replace YOUR_ADDRESS with your Aptos account address
   sed -i '' 's/YOUR_ADDRESS/0x123...your_address/g' *.sh
   ```

4. Run verification for individual projects or all projects:
   ```bash
   chmod +x verify_all.sh
   ./verify_all.sh
   ```

### Step 5: Frontend Integration

1. Install required dependencies in your frontend project:
   ```bash
   cd frontend
   npm install aptos @aptos-labs/wallet-adapter-react petra-plugin-wallet-adapter @martianwallet/aptos-wallet-adapter
   ```

2. Create an API endpoint to expose project data:
   ```bash
   mkdir -p pages/api
   ```

3. Create `pages/api/projects.js`:
   ```javascript
   import path from 'path';
   import fs from 'fs';

   export default function handler(req, res) {
     const projectsPath = path.join(process.cwd(), '../backend/project_data.json');
     const projectData = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
     res.status(200).json(projectData);
   }
   ```

4. Add your contract address to environment variables:
   ```bash
   echo "NEXT_PUBLIC_APTOS_NODE_URL=https://fullnode.testnet.aptoslabs.com/v1" > .env.local
   echo "NEXT_PUBLIC_CONTRACT_ADDRESS=0x123...your_address" >> .env.local
   ```

5. Follow the examples in `frontend_integration.js` to:
   - Add wallet connection to your app
   - Integrate with the verification and marketplace contracts
   - Display verified projects with blockchain data

## Verifying Deployment

1. Check your contract on Aptos Explorer:
   ```
   https://explorer.aptoslabs.com/account/YOUR_ADDRESS?network=testnet
   ```

2. View project verification status using the Aptos CLI:
   ```bash
   aptos move view --function-id YOUR_ADDRESS::verification::get_verification_status \
     --args string:"RF-2023-089" \
     --profile default
   ```

3. View marketplace statistics:
   ```bash
   aptos move view --function-id YOUR_ADDRESS::marketplace::get_total_credits_sold \
     --profile default
   ```

## Production Deployment Considerations

For production deployment, consider these additional steps:

1. **Deploy to Aptos Mainnet**: Modify the deployment process to use the Aptos mainnet
   ```bash
   aptos init --network mainnet
   ```

2. **Security Audits**: Have the smart contracts audited by a reputable security firm

3. **Frontend Hosting**: Deploy the Next.js frontend to a service like Vercel or AWS Amplify

4. **Real-time IoT Integration**: Connect with actual IoT sensors instead of synthetic data

5. **Wallet Integration Testing**: Thoroughly test with real Aptos wallets like Petra and Martian

## Troubleshooting

1. **Transaction Failure**: Ensure you have sufficient gas (testnet APT)
   ```bash
   aptos account fund-with-faucet --account default
   ```

2. **Contract Not Found**: Verify your contract was published successfully
   ```bash
   aptos account list --query modules --account YOUR_ADDRESS
   ```

3. **Verification Issues**: Check the project ID exists and IoT data meets criteria
   ```bash
   aptos move view --function-id YOUR_ADDRESS::verification::get_verification_status --args string:"RF-2023-089"
   ```

4. **Frontend Connection**: Verify the contract address in your environment variables matches the deployed contract address

## Need Help?

If you encounter any issues during deployment:

1. Check the Aptos documentation: https://aptos.dev/
2. Visit the Aptos Discord community
3. Review the Move language documentation for debugging contract issues 