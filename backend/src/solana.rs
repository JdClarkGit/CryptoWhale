use solana_client::rpc_client::RpcClient;

pub fn create_solana_client() -> RpcClient {
    let solana_rpc_url = std::env::var("SOLANA_RPC_URL").expect("SOLANA_RPC_URL must be set");
    RpcClient::new(solana_rpc_url)
}
