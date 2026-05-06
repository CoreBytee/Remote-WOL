FROM debian:bookworm-slim
COPY ./target/release/wol-relay /app/wol-relay
ENTRYPOINT [ "/app/wol-relay" ]
