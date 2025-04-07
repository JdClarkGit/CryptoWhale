mod config;
mod db;
mod solana;
mod websocket;
mod routes;

#[tokio::main]
async fn main() {
    config::load_env();
    let _db_pool = db::create_db_pool().await;
    let _solana_client = solana::create_solana_client();

    // Start WebSocket server in a separate task
    tokio::spawn(async {
        websocket::start_websocket_server().await;
    });

    println!("Backend is running!");
    println!("WebSocket server running on ws://127.0.0.1:8081");
    println!("REST API running on http://127.0.0.1:3030");
    
    // Start the REST API server
    let api = routes::routes();
    
    // Keep the main thread running until Ctrl+C is received
    let (_, server) = warp::serve(api)
        .bind_with_graceful_shutdown(([127, 0, 0, 1], 3030), async {
            tokio::signal::ctrl_c().await.unwrap();
            println!("Shutting down...");
        });
    
    // Run the server
    server.await;
}
