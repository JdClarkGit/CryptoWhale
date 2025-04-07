use dotenv::dotenv;
use std::env;

pub fn load_env() {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let solana_rpc_url = env::var("SOLANA_RPC_URL").expect("SOLANA_RPC_URL must be set");
    println!("Database URL: {}", database_url);
    println!("Solana RPC URL: {}", solana_rpc_url);
}
