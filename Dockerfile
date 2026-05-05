FROM alpine:latest
WORKDIR /app
COPY ./target/release/wol-relay /app/wol-relay
RUN chmod +x /app/wol-relay
ENTRYPOINT ["/app/wol-relay"]
