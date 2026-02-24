FROM --platform=linux/amd64 reactnativecommunity/react-native-android:v20.1

# Dependencies
# Install Node 22 to match the template engine requirement
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash \
    && . ~/.nvm/nvm.sh \
    && nvm install 22 \
    && nvm use 22

ENV PATH="/root/.nvm/versions/node/v22.14.0/bin:${PATH}"

# Add ruby for fastlane (optional but good practice)
RUN apt-get update && apt-get install -y ruby-full

WORKDIR /workspace

# Project templates to be copied
COPY templates/rn-project-template/ /workspace/rn-project-template/
COPY templates/rn-project-template/package.json /workspace/rn-project-template/package.json

# Warm base node modules cache (optional optimization)
# RUN cd /workspace/rn-project-template && npm install --no-audit

# Script to be run when the container starts
COPY scripts/docker-entrypoint.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
