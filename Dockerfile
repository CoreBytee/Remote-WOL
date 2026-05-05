FROM alpine:3.22
COPY ./wol-relay /app/wol-relay
ENTRYPOINT ["/app/wol-relay"]
