use std::{net::Ipv4Addr, str::FromStr};

use axum::{
    Json, Router,
    http::Response,
    routing::{get, post},
};
use dotenv::dotenv;
use serde::Deserialize;
use wol::MacAddress;

fn get_password() -> String {
    return std::env::var("WEBSERVER_PASSWORD").expect("WEBSERVER_PASSWORD env var is not set!");
}

fn get_mac_address() -> MacAddress {
    let mac_address_raw =
        std::env::var("TARGET_MAC_ADDRESS").expect("TARGET_MAC_ADDRESS env var is not set!");
    let mac_address =
        MacAddress::from_str(mac_address_raw.as_str()).expect("Unable to parse mac address!");
    return mac_address;
}

#[tokio::main]
async fn main() {
    println!("Starting wol-relay");
    dotenv().ok();

    // ENV Checks
    get_password();
    get_mac_address();

    let port = std::env::var("WEBSERVER_PORT").expect("WEBSERVER_PORT env var is not set!");
    let host = format!("0.0.0.0:{}", port);

    let router = Router::new()
        .route("/", get(index_route))
        .route("/api/check_password", post(password_check_route))
        .route("/api/send_packet", post(send_packet_route));

    let listener = tokio::net::TcpListener::bind(host.clone())
        .await
        .expect(format!("Failed to bind to {host}").as_str());

    println!("Webserver listening on {host}");

    axum::serve(listener, router)
        .await
        .expect("Failed to start Axum server");
}

async fn index_route() -> Response<String> {
    return Response::builder()
        .status(200)
        .header("content-type", "text/html")
        .body(include_str!("./index.html").to_string())
        .unwrap();
}

#[derive(Deserialize)]
struct PasswordCheckJson {
    password: String,
}

async fn password_check_route(data: Json<PasswordCheckJson>) -> Response<String> {
    let password = get_password();
    let ok = password == data.password;
    let status = if ok { 200 } else { 403 };
    let body = ok.to_string();

    return Response::builder().status(status).body(body).unwrap();
}

#[derive(Deserialize)]
struct SendPacketJson {
    password: String,
}

async fn send_packet_route(data: Json<SendPacketJson>) -> Response<String> {
    let password = get_password();
    let ok = password == data.password;

    if ok {
        println!("Sending magic packet");
        let mac_address = get_mac_address();

        match wol::send_magic_packet(mac_address, None, (Ipv4Addr::BROADCAST, 9).into()) {
            Ok(()) => {
                return Response::builder()
                    .status(200)
                    .body("".to_string())
                    .unwrap();
            }
            Err(err) => {
                eprintln!("Failed to send magic packet: {err}");
                return Response::builder()
                    .status(500)
                    .body("Failed to send magic packet".to_string())
                    .unwrap();
            }
        }
    } else {
        return Response::builder()
            .status(403)
            .body("Incorrect password".to_string())
            .unwrap();
    }
}
