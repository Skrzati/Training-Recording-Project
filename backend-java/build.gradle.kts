plugins {
	java
	id("org.springframework.boot") version "4.0.0"
	id("io.spring.dependency-management") version "1.1.7"
}

group = "pl.MateuszJ"
version = "0.0.1-SNAPSHOT"
description = "App helping to see your progress in training"

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(25)
	}
}

repositories {
	mavenCentral()
}

dependencies {
    // Existing dependencies
    implementation("org.springframework.boot:spring-boot-starter-webmvc")
    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.projectlombok:lombok")
    implementation("org.springframework.boot:spring-boot-starter-security")

    // JJWT Dependencies (using version 0.11.5 as seen in the image)
    val jjwtVersion = "0.11.5"
    implementation("io.jsonwebtoken:jjwt-api:$jjwtVersion") // For the API
    runtimeOnly("io.jsonwebtoken:jjwt-impl:$jjwtVersion") // For the implementation
    runtimeOnly("io.jsonwebtoken:jjwt-jackson:$jjwtVersion") // For JSON processing (Jackson)

    // Existing Test and Runtime dependencies
    testImplementation("org.springframework.boot:spring-boot-starter-webmvc-test")
    testImplementation("org.springframework.security:spring-security-test")
    "developmentOnly"("org.springframework.boot:spring-boot-devtools")
    runtimeOnly("org.postgresql:postgresql")
    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

tasks.withType<Test> {
	useJUnitPlatform()
}
