# Multi-stage build Dockerfile for wol-relay
# Supports both linux/amd64 and linux/arm64

FROM debian:12-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Create non-root user
RUN useradd -m -u 1000 wol-relay

WORKDIR /app

# Copy binaries directory (will be populated by docker-build action)
COPY ./binaries /binaries

# Copy the appropriate binary based on target architecture
ARG TARGETARCH
RUN if [ "$TARGETARCH" = "amd64" ]; then \
    cp /binaries/amd64/wol-relay /app/wol-relay; \
    elif [ "$TARGETARCH" = "arm64" ]; then \
    cp /binaries/arm64/wol-relay /app/wol-relay; \
    else \
    echo "Unsupported architecture: $TARGETARCH" && exit 1; \
    fi && \
    chmod +x /app/wol-relay

# Change ownership to non-root user
RUN chown -R wol-relay:wol-relay /app

USER wol-relay

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD /app/wol-relay --version || exit 1

ENTRYPOINT ["/app/wol-relay"]
