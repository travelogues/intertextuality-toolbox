name := "stanford-ner-trial"

organization := "ait.ac.at"

version := "0.1"

scalaVersion := "2.11.11"

ensimeIgnoreScalaMismatch in ThisBuild := true

mainClass in (Compile, packageBin) := Some("travelogues.ner.RunNER")

libraryDependencies ++= Seq(
  "edu.stanford.nlp" % "stanford-corenlp" % "3.9.1",
  "edu.stanford.nlp" % "stanford-corenlp" % "3.9.1" classifier "models",
  "edu.stanford.nlp" % "stanford-corenlp" % "3.9.1" classifier "models-german",
  "ch.qos.logback" % "logback-classic" % "1.2.3"
)