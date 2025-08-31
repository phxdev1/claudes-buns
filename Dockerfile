# Claude's Buns 🍑 - Multi-stage Alpine Build
# Run Claude Code without Node.js - just Bun!

FROM alpine:3.18 as builder

# Install dependencies for Bun
RUN apk add --no-cache \
    ca-certificates \
    curl \
    unzip \
    bash

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash && \
    source /root/.bashrc
ENV PATH="/root/.bun/bin:${PATH}"

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install

# Copy source code
COPY src/ ./src/

# Build the application
RUN bun run build

# Production stage - minimal Alpine
FROM alpine:3.18

# Install minimal runtime dependencies (including bash for shell commands)
RUN apk add --no-cache ca-certificates bash

# Create non-root user
RUN adduser -D -s /bin/sh -u 1001 claude

# Copy Bun binary from builder
COPY --from=builder /root/.bun/bin/bun /usr/local/bin/bun

# Copy built application
COPY --from=builder --chown=claude:claude /app/dist/ /app/dist/
COPY --from=builder --chown=claude:claude /app/node_modules/ /app/node_modules/
COPY --from=builder --chown=claude:claude /app/package.json /app/

# Set working directory and user
WORKDIR /app
USER claude

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