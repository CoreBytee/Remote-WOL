FROM --platform=$BUILDPLATFORM alpine:latest AS builder
WORKDIR /app
COPY ./target/release/wol-relay /app/wol-relay
RUN chmod +x /app/wol-relay

FROM --platform=$TARGETPLATFORM alpine:latest
WORKDIR /app
COPY --from=builder /app/wol-relay /app/wol-relay
ENTRYPOINT ["/app/wol-relay"]
