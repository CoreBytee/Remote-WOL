FROM gcr.io/distroless/static-debian12
COPY ./target/release/wol-relay /usr/local/bin/wol-relay
ENTRYPOINT ["/usr/local/bin/wol-relay"]
