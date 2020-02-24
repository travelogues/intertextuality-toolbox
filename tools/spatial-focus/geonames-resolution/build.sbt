name := "geonames-resolution"

organization := "ait.ac.at"

version := "0.1"

scalaVersion := "2.12.10"

ensimeIgnoreScalaMismatch in ThisBuild := true

libraryDependencies ++= Seq(
  "com.typesafe.play" %% "play-json" % "2.8.1",
  "ch.qos.logback" % "logback-classic" % "1.2.3"
)