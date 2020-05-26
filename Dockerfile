# use initial image 
FROM debian:latest



# set application environment variables
ENV APP_LISTEN_ADDR=":8080"
ENV METRICS_LISTEN_ADDR=":8181"
ENV PVP_SIMULATOR_ROOT="/app/"
ENV BOLTDB="/app/boltDB/"
ENV NODE_LIMIT="1400000"

RUN apt-get update && apt-get install -y ca-certificates && update-ca-certificates
RUN mkdir /app/
RUN mkdir /app/boltDB/
RUN mkdir /app/logs/

ADD pvpSimulator /app/
ADD interface/build /app/interface/build
ADD bases /app/bases
# Create WORKDIR (working directory) for app


# expose port to host system
EXPOSE 8080
EXPOSE 8181

# set working directory
WORKDIR /app/

RUN chmod +x /app/pvpSimulator
# run a command with no arguments on container start
ENTRYPOINT ["/app/pvpSimulator"]
