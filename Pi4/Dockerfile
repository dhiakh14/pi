FROM eclipse-temurin:21-jdk
EXPOSE 8089

# Copier le JAR généré par Maven dans l'image Docker
COPY target/KhalfaouiMohamedDhia-1.0.jar KhalfaouiMohamedDhia-1.0.jar

# Correction du nom du fichier JAR dans l'ENTRYPOINT
ENTRYPOINT ["java", "-jar", "KhalfaouiMohamedDhia-1.0.jar"]