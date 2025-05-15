module ecochain::verification {
    use std::string::{Self, String};
    use std::vector;
    use std::error;
    use std::signer;

    use aptos_framework::timestamp;
    use aptos_framework::account;
    use aptos_framework::event::{Self, EventHandle};
    use aptos_framework::object::{Self, Object, ConstructorRef, ExtendRef, DeleteRef};
    
    /// Errors
    const E_NOT_AUTHORIZED: u64 = 1;
    const E_ALREADY_VERIFIED: u64 = 2;
    const E_INVALID_DATA: u64 = 3;
    const E_MIN_THRESHOLD_NOT_MET: u64 = 4;
    const E_PROJECT_DOES_NOT_EXIST: u64 = 5;

    /// Verification statuses
    const STATUS_PENDING: u8 = 0;
    const STATUS_VERIFIED: u8 = 1;
    const STATUS_REJECTED: u8 = 2;

    // Minimum CO2 absorption rate in kg/day to be verified
    const MIN_CO2_ABSORPTION: u64 = 2;
    
    #[resource_group_member(group = aptos_framework::object::ObjectGroup)]
    /// Stores project information
    struct Project has key {
        /// The constructor reference
        constructor_ref: ConstructorRef,
        /// The project ID
        id: String,
        /// Project name
        name: String,
        /// Project location
        location: String,
        /// Project description
        description: String,
        /// Project category (e.g., "reforestation", "renewable", "methane", etc.)
        category: String,
        /// Project creator
        creator: address,
        /// Project creation timestamp
        creation_time: u64,
        /// Verification status 
        verification_status: u8,
        /// Verified carbon credits (tons)
        carbon_credits: u64,
        /// Project supporters (list of addresses that have invested in the project)
        supporters: vector<address>,
        /// Total carbon credits available for sale
        available_credits: u64,
        /// Price per credit in USD cents
        price_per_credit: u64,
        /// Transaction events
        verification_events: EventHandle<VerificationEvent>,
    }

    /// Event emitted when a verification occurs
    struct VerificationEvent has drop, store {
        project_id: String,
        verifier: address,
        timestamp: u64,
        status: u8,
        carbon_credits: u64
    }

    /// IoT sensor data for verification
    struct SensorData has drop, copy, store {
        /// Project ID
        project_id: String,
        /// Latitude of sensor
        latitude: String,
        /// Longitude of sensor
        longitude: String,
        /// CO2 absorption rate (kg/day)
        co2_absorption_rate: u64,
        /// Tree growth rate (mm/month)
        tree_growth_rate: u64,
        /// Soil carbon content (percentage x 100, e.g. 523 = 5.23%)
        soil_carbon_content: u64,
        /// Biomass accumulation (kg/hectare)
        biomass_accumulation: u64,
        /// Timestamp when data was collected
        timestamp: u64,
        /// Data hash for integrity verification
        data_hash: vector<u8>
    }

    /// Creates a new project
    public entry fun create_project(
        account: &signer,
        id: String,
        name: String,
        location: String,
        description: String,
        category: String,
        available_credits: u64,
        price_per_credit: u64
    ) {
        let creator_addr = signer::address_of(account);
        
        // Create a new object
        let constructor_ref = object::create_object(creator_addr);
        let object_signer = object::generate_signer(&constructor_ref);
        
        // Create the project
        move_to(&object_signer, Project {
            constructor_ref,
            id,
            name,
            location,
            description,
            category,
            creator: creator_addr,
            creation_time: timestamp::now_seconds(),
            verification_status: STATUS_PENDING,
            carbon_credits: 0,
            supporters: vector::empty<address>(),
            available_credits,
            price_per_credit,
            verification_events: account::new_event_handle<VerificationEvent>(&object_signer),
        });
    }

    /// Submit IoT sensor data for verification
    public entry fun submit_sensor_data(
        _account: &signer,
        project_id: String,
        latitude: String,
        longitude: String,
        co2_absorption_rate: u64,
        tree_growth_rate: u64,
        soil_carbon_content: u64,
        biomass_accumulation: u64,
        data_hash: vector<u8>
    ) {
        // In a real implementation, we would store this data in a table or another structure
        // For this demonstration, we'll just verify it directly
        
        // Validate data - in production, more complex validation would be required
        assert!(co2_absorption_rate > 0, error::invalid_argument(E_INVALID_DATA));
        assert!(tree_growth_rate > 0, error::invalid_argument(E_INVALID_DATA));
        assert!(soil_carbon_content > 0, error::invalid_argument(E_INVALID_DATA));
        assert!(biomass_accumulation > 0, error::invalid_argument(E_INVALID_DATA));
        
        // Create sensor data
        let sensor_data = SensorData {
            project_id,
            latitude,
            longitude,
            co2_absorption_rate,
            tree_growth_rate,
            soil_carbon_content,
            biomass_accumulation,
            timestamp: timestamp::now_seconds(),
            data_hash
        };
        
        // Verify the data 
        verify_sensor_data(sensor_data);
    }
    
    /// Verify sensor data and update project status
    fun verify_sensor_data(sensor_data: SensorData) {
        // Check if the CO2 absorption rate meets the minimum threshold
        if (sensor_data.co2_absorption_rate < MIN_CO2_ABSORPTION) {
            // Not enough CO2 absorption, reject verification
            reject_verification(sensor_data.project_id);
        } else {
            // Calculate carbon credits based on CO2 absorption rate
            // Simple calculation: 1 ton of carbon = 1000 kg of CO2
            let carbon_credits = sensor_data.co2_absorption_rate / 1000;
            
            // If less than 1 ton, provide at least 1 credit
            if (carbon_credits == 0) {
                carbon_credits = 1;
            }
            
            // Approve verification and award carbon credits
            approve_verification(sensor_data.project_id, carbon_credits);
        }
    }
    
    /// Approve verification and award carbon credits
    fun approve_verification(project_id: String, carbon_credits: u64) {
        // Find the project and update its status
        // In a real implementation, we would look up the project object 
        // For simplicity in this demo, we'll assume it exists and verify it
        
        // This would typically fetch the project and update it
        // For demonstration purposes, we're just showing the logic
        
        // Emit an event for the verification
        emit_verification_event(project_id, @ecochain, STATUS_VERIFIED, carbon_credits);
    }
    
    /// Reject verification
    fun reject_verification(project_id: String) {
        // Emit an event for the verification rejection
        emit_verification_event(project_id, @ecochain, STATUS_REJECTED, 0);
    }
    
    /// Emit a verification event
    fun emit_verification_event(
        project_id: String,
        verifier: address,
        status: u8,
        carbon_credits: u64
    ) {
        // In a real implementation, we would look up the project and emit an event
        // For this demonstration, we just show the event structure
        
        let event = VerificationEvent {
            project_id,
            verifier,
            timestamp: timestamp::now_seconds(),
            status,
            carbon_credits
        };
        
        // In a complete implementation, we would add:
        // event::emit_event(&mut project.verification_events, event);
        
        // For now, we just create the event but don't emit it
        // This is a simplification for the demonstration
        _ = event;
    }
    
    /// Get verification status by project ID (public view function)
    #[view]
    public fun get_verification_status(project_id: String): u8 {
        // In a real implementation, we would look up the project and return its status
        // For this demonstration, we'll just return verified for all projects
        
        // Always return verified for demonstration purposes
        STATUS_VERIFIED
    }
    
    /// Calculate carbon credits from CO2 absorption (utility function)
    fun calculate_carbon_credits(co2_absorption_kg: u64): u64 {
        // Simple calculation: 1 ton of carbon = 1000 kg of CO2
        co2_absorption_kg / 1000
    }
} 