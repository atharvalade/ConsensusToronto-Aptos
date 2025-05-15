module ecochain::verification {
    use std::string::{Self, String};
    use std::vector;
    use std::error;
    use std::signer;

    use aptos_framework::timestamp;
    use aptos_framework::account;
    use aptos_framework::event::{Self, EventHandle};
    use aptos_framework::object::{Self, Object, ExtendRef, DeleteRef, TransferRef};
    
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
        /// Project control refs
        extend_ref: ExtendRef,
        delete_ref: DeleteRef,
        transfer_ref: TransferRef,
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
        
        // Generate necessary refs from the constructor_ref before it's consumed
        let extend_ref = object::generate_extend_ref(&constructor_ref);
        let delete_ref = object::generate_delete_ref(&constructor_ref);
        let transfer_ref = object::generate_transfer_ref(&constructor_ref);
        
        let object_signer = object::generate_signer(&constructor_ref);
        
        // Create the project
        move_to(&object_signer, Project {
            extend_ref,
            delete_ref,
            transfer_ref,
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
        // Validate data - in production, more complex validation would be required
        assert!(co2_absorption_rate > 0, error::invalid_argument(E_INVALID_DATA));
        assert!(tree_growth_rate > 0, error::invalid_argument(E_INVALID_DATA));
        assert!(soil_carbon_content > 0, error::invalid_argument(E_INVALID_DATA));
        assert!(biomass_accumulation > 0, error::invalid_argument(E_INVALID_DATA));
        
        // For simplification, we're not storing the data anywhere,
        // just simulating verification logic.
        
        // In a real implementation, this function would:
        // 1. Store the IoT data
        // 2. Verify the data against thresholds
        // 3. Update the project's verification status
        // 4. Calculate and award carbon credits
        // 5. Emit a verification event
        
        // Since this is a demo, we don't actually do anything with the data
    }
    
    // Get verification status by project ID (public view function)
    #[view]
    public fun get_verification_status(project_id: String): u8 {
        // In a real implementation, we would look up the project and return its status
        // For this demonstration, we'll just return verified for all projects
        
        // Always return verified for demonstration purposes
        STATUS_VERIFIED
    }
    
    // Calculate carbon credits from CO2 absorption (utility function)
    public fun calculate_carbon_credits(co2_absorption_kg: u64): u64 {
        // Simple calculation: 1 ton of carbon = 1000 kg of CO2
        co2_absorption_kg / 1000
    }
} 