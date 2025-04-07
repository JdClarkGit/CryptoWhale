use tokio::net::TcpListener;
use tokio_tungstenite::accept_async;
use futures_util::{StreamExt, SinkExt};

pub async fn start_websocket_server() {
    let listener = TcpListener::bind("127.0.0.1:8081").await.unwrap();
    println!("WebSocket server running on ws://127.0.0.1:8081");

    while let Ok((stream, _)) = listener.accept().await {
        tokio::spawn(async move {
            let ws_stream = accept_async(stream).await.unwrap();
            let (mut write, mut read) = ws_stream.split();

            while let Some(Ok(msg)) = read.next().await {
                println!("Received: {}", msg);
                write.send(msg).await.unwrap();
            }
        });
    }
}
