#!/usr/bin/env node

/**
 * IoT Data Generator for EcoChain Carbon Credit Verification
 * 
 * This script generates synthetic IoT sensor data for carbon credit projects
 * in a format suitable for submission to the Aptos blockchain verification contract.
 */

const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Load project data
const projectData = JSON.parse(fs.readFileSync(path.join(__dirname, 'project_data.json'), 'utf8'));

/**
 * Generate a deterministic but random-looking hash from input data
 */
function generateHash(data) {
  return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
}

/**
 * Generate IoT sensor data for a specific project
 */
function generateIoTData(project) {
  console.log(`Generating IoT data for project: ${project.title} (${project.id})`);
  
  const now = new Date();
  const timestamp = Math.floor(now.getTime() / 1000);
  
  let sensorData;
  
  switch(project.category) {
    case 'reforestation':
      sensorData = {
        project_id: project.id,
        latitude: project.coordinates.latitude,
        longitude: project.coordinates.longitude,
        timestamp,
        readings: {
          co2_absorption_rate: project.sensor_data.co2_absorption_rate,
          tree_growth_rate: project.sensor_data.tree_growth_rate,
          soil_carbon_content: project.sensor_data.soil_carbon_content,
          biomass_accumulation: project.sensor_data.biomass_accumulation,
          humidity: project.sensor_data.humidity,
          temperature: project.sensor_data.temperature,
          rainfall: project.sensor_data.rainfall
        }
      };
      break;
      
    case 'renewable':
      if (project.title.includes('Solar')) {
        sensorData = {
          project_id: project.id,
          latitude: project.coordinates.latitude,
          longitude: project.coordinates.longitude,
          timestamp,
          readings: {
            co2_displacement: project.sensor_data.co2_displacement,
            energy_production: project.sensor_data.energy_production,
            peak_output: project.sensor_data.peak_output,
            operational_hours: project.sensor_data.operational_hours,
            solar_irradiance: project.sensor_data.solar_irradiance,
            panel_efficiency: project.sensor_data.panel_efficiency,
            temperature: project.sensor_data.temperature
          }
        };
      } else {
        sensorData = {
          project_id: project.id,
          latitude: project.coordinates.latitude,
          longitude: project.coordinates.longitude,
          timestamp,
          readings: {
            co2_displacement: project.sensor_data.co2_displacement,
            energy_production: project.sensor_data.energy_production,
            wind_speed: project.sensor_data.wind_speed,
            turbine_efficiency: project.sensor_data.turbine_efficiency,
            operational_hours: project.sensor_data.operational_hours,
            temperature: project.sensor_data.temperature,
            humidity: project.sensor_data.humidity
          }
        };
      }
      break;
      
    case 'methane':
      sensorData = {
        project_id: project.id,
        latitude: project.coordinates.latitude,
        longitude: project.coordinates.longitude,
        timestamp,
        readings: {
          methane_capture_rate: project.sensor_data.methane_capture_rate,
          methane_concentration: project.sensor_data.methane_concentration,
          gas_purity: project.sensor_data.gas_purity,
          energy_production: project.sensor_data.energy_production,
          pressure: project.sensor_data.pressure,
          temperature: project.sensor_data.temperature,
          flow_rate: project.sensor_data.flow_rate
        }
      };
      break;
      
    case 'marine':
      sensorData = {
        project_id: project.id,
        latitude: project.coordinates.latitude,
        longitude: project.coordinates.longitude,
        timestamp,
        readings: {
          carbon_sequestration: project.sensor_data.carbon_sequestration,
          mangrove_density: project.sensor_data.mangrove_density,
          water_quality: project.sensor_data.water_quality,
          biodiversity_index: project.sensor_data.biodiversity_index,
          water_temperature: project.sensor_data.water_temperature,
          salinity: project.sensor_data.salinity,
          ph_level: project.sensor_data.ph_level
        }
      };
      break;
      
    default:
      sensorData = {
        project_id: project.id,
        latitude: project.coordinates.latitude,
        longitude: project.coordinates.longitude,
        timestamp,
        readings: {
          co2_absorption_rate: 3000 + Math.floor(Math.random() * 2000),
          temperature: 20 + Math.floor(Math.random() * 10),
          humidity: 50 + Math.floor(Math.random() * 30)
        }
      };
  }
  
  // Generate data hash
  const dataHash = generateHash(sensorData);
  sensorData.data_hash = dataHash;
  
  // Generate Aptos command for verification
  const aptosCommand = generateAptosCommand(project, sensorData);
  
  // Write to file
  const outputFileName = `iot_data_${project.id.replace(/-/g, '_')}.json`;
  fs.writeFileSync(
    path.join(__dirname, 'iot_data', outputFileName),
    JSON.stringify(sensorData, null, 2)
  );
  
  // Write Aptos command to file
  const commandFileName = `verify_${project.id.replace(/-/g, '_')}.sh`;
  fs.writeFileSync(
    path.join(__dirname, 'scripts', commandFileName),
    aptosCommand + '\n'
  );
  
  console.log(`Data written to iot_data/${outputFileName}`);
  console.log(`Verification command written to scripts/${commandFileName}`);
  console.log('---');
  
  return { sensorData, aptosCommand };
}

/**
 * Generate Aptos CLI command for submitting data to the verification contract
 */
function generateAptosCommand(project, sensorData) {
  // Extract the values needed for verification
  let co2Value = 0;
  
  if (project.category === 'reforestation') {
    co2Value = sensorData.readings.co2_absorption_rate;
  } else if (project.category === 'renewable') {
    co2Value = sensorData.readings.co2_displacement;
  } else if (project.category === 'methane') {
    co2Value = sensorData.readings.methane_capture_rate;
  } else if (project.category === 'marine') {
    co2Value = sensorData.readings.carbon_sequestration;
  }
  
  // For simplicity, we'll use placeholder values for other parameters
  // In a real implementation, these would be extracted from the sensor data
  const treeGrowthRate = sensorData.readings.tree_growth_rate || 50;
  const soilCarbonContent = sensorData.readings.soil_carbon_content || 500;
  const biomassAccumulation = sensorData.readings.biomass_accumulation || 2000;
  
  // Format the command
  // Note: YOUR_ADDRESS should be replaced with the actual address when running
  return `aptos move run \\
  --function-id YOUR_ADDRESS::verification::submit_sensor_data \\
  --args string:"${project.id}" string:"${sensorData.latitude}" string:"${sensorData.longitude}" \\
  u64:${co2Value} u64:${treeGrowthRate} u64:${soilCarbonContent} u64:${biomassAccumulation} \\
  hex:"${sensorData.data_hash}" \\
  --max-gas=5000`;
}

/**
 * Main function
 */
function main() {
  // Create output directories if they don't exist
  const iotDataDir = path.join(__dirname, 'iot_data');
  const scriptsDir = path.join(__dirname, 'scripts');
  
  if (!fs.existsSync(iotDataDir)) {
    fs.mkdirSync(iotDataDir);
  }
  
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir);
  }
  
  console.log('EcoChain IoT Data Generator');
  console.log('===========================');
  
  // Generate data for each project
  for (const project of projectData.projects) {
    generateIoTData(project);
  }
  
  // Create the run-all script
  const runAllScript = projectData.projects.map(p => 
    `./verify_${p.id.replace(/-/g, '_')}.sh`
  ).join('\n');
  
  fs.writeFileSync(
    path.join(__dirname, 'scripts', 'verify_all.sh'),
    '#!/bin/bash\n\n' + runAllScript + '\n'
  );
  
  // Make all scripts executable
  fs.chmodSync(path.join(__dirname, 'scripts', 'verify_all.sh'), 0o755);
  
  console.log('\nAll data and scripts generated successfully.');
  console.log('To run the verification for all projects:');
  console.log('1. Update the YOUR_ADDRESS placeholder in the scripts with your actual address');
  console.log('2. Run: cd scripts && ./verify_all.sh');
}

// Run the main function
main(); 