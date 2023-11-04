FROM jelastic/maven:3.8.6-openjdk-20.ea-b24 AS javabuild
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
COPY src/main src/main
RUN mvn clean package -DskipTests

FROM openjdk:20-jdk-slim
COPY --from=javabuild /target/*.jar browsergames.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","browsergames.jar"]