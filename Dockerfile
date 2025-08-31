# Claude's Buns 🍑 - Distroless Docker Image
# Run Claude Code without Node.js or OS distro - just Bun!

FROM ubuntu:22.04 as builder

# Install dependencies for Bun
RUN apt-get update && apt-get install -y \
    ca-certificates \
    curl \
    unzip \
    && rm -rf /var/lib/apt/lists/*

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:${PATH}"

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY src/ ./src/

# Build the application
RUN bun run build

# Production stage - distroless
FROM gcr.io/distroless/cc-debian11:nonroot

# Copy Bun binary from builder
COPY --from=builder /root/.bun/bin/bun /usr/local/bin/bun

# Copy built application
COPY --from=builder --chown=nonroot:nonroot /app/dist/ /app/dist/
COPY --from=builder --chown=nonroot:nonroot /app/node_modules/ /app/node_modules/
COPY --from=builder --chown=nonroot:nonroot /app/package.json /app/

# Set working directory
WORKDIR /app

# Set up environment
ENV NODE_ENV=production
ENV PATH="/usr/local/bin:$PATH"

# Default command
ENTRYPOINT ["/usr/local/bin/bun", "run", "dist/index.js"]
CMD ["--help"]

# Labels for metadata
LABEL org.opencontainers.image.title="Claude's Buns 🍑"
LABEL org.opencontainers.image.description="Run Claude Code without Node.js - just Bun!"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.authors="Claude's Buns Team"
LABEL org.opencontainers.image.url="https://github.com/your-username/claudes-buns"
LABEL org.opencontainers.image.source="https://github.com/your-username/claudes-buns"
LABEL org.opencontainers.image.vendor="Claude's Buns 🍑"
LABEL org.opencontainers.image.licenses="MIT"