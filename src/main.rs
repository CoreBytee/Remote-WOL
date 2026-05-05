use std::{net::Ipv4Addr, str::FromStr};

use axum::{Router, extract::Query, http::Response, routing::get};
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
    dotenv().unwrap();

    // ENV Checks
    get_password();
    get_mac_address();

    let port = std::env::var("WEBSERVER_PORT").expect("WEBSERVER_PORT env var is not set!");
    let host = format!("0.0.0.0:{}", port);

    let router = Router::new()
        .route("/", get(index_route))
        .route("/api/check_password", get(password_check_route))
        .route("/api/send_packet", get(send_packet_route));

    let listener = tokio::net::TcpListener::bind(host).await.unwrap();

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
struct PasswordCheckQuery {
    password: String,
}

async fn password_check_route(query: Query<PasswordCheckQuery>) -> Response<String> {
    let password = get_password();
    let ok = password == query.password;
    let status = if ok { 200 } else { 403 };
    let body = ok.to_string();

    return Response::builder().status(status).body(body).unwrap();
}

#[derive(Deserialize)]
struct SendPacketQuery {
    password: String,
}

async fn send_packet_route(query: Query<SendPacketQuery>) -> Response<String> {
    let password = get_password();
    let ok = password == query.password;

    if ok {
        let mac_address = get_mac_address();
        let ok = wol::send_magic_packet(mac_address, None, (Ipv4Addr::BROADCAST, 9).into()).is_ok();
        let status = if ok { 200 } else { 500 };

        return Response::builder()
            .status(status)
            .body("".to_string())
            .unwrap();
    } else {
        return Response::builder()
            .status(403)
            .body("Incorrect password".to_string())
            .unwrap();
    }
}
