FROM rust:latest as builder
WORKDIR /app
COPY . .
RUN cargo build --release

FROM alpine:3.22
COPY --from=builder /app/target/release/wol-relay /app/wol-relay
ENTRYPOINT ["/app/wol-relay"]
