FROM alpine:3.22

# Copy the compiled binary from the build context
COPY ./target/release/wol-relay /app/wol-relay

# Set the entrypoint
ENTRYPOINT ["/app/wol-relay"]
