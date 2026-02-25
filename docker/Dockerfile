FROM --platform=linux/amd64 reactnativecommunity/react-native-android:v20.1

# Install Node 22 system-wide (NOT via nvm) so it's available to all subprocesses including Gradle
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs

# Copy Zscaler Root CA certificate (required for corporate networks with SSL inspection)
COPY docker/certs/Zscaler_Root_CA.cer /usr/local/share/ca-certificates/Zscaler_Root_CA.crt

# Import Zscaler cert into system trust store AND Java truststore
RUN update-ca-certificates \
    && JAVA_CACERTS=$(find /usr/lib/jvm -name cacerts -path "*/security/*" | head -1) \
    && if [ -n "$JAVA_CACERTS" ]; then \
         keytool -importcert \
           -alias zscaler-root \
           -keystore "$JAVA_CACERTS" \
           -file /usr/local/share/ca-certificates/Zscaler_Root_CA.crt \
           -storepass changeit \
           -noprompt; \
       fi

# Verify node/npx are globally accessible
RUN node --version && npx --version

WORKDIR /workspace

# Project template
COPY templates/rn-project-template/ /workspace/rn-project-template/

# Entrypoint script
COPY scripts/docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]


