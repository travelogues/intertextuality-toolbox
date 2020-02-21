package travelogues.intertextuality.ner

import edu.stanford.nlp.pipeline.{CoreDocument, StanfordCoreNLP}
import edu.stanford.nlp.util.StringUtils
import edu.stanford.nlp.ling.{CoreAnnotations, CoreLabel}
import java.io.File
import org.slf4j.LoggerFactory
import scala.collection.JavaConverters._
import scala.io.Source

object App {

  private val log = LoggerFactory.getLogger(this.getClass)

  private lazy val props = {
    val props = StringUtils.argsToProperties(Seq("-props", "StanfordCoreNLP-german.properties"):_*)
    props.setProperty("annotators", "tokenize,ssplit,pos,lemma,ner")
    props
  }

  private lazy val pipeline = {
    log.info("Initializing NER pipeline")
    val pipeline = new StanfordCoreNLP(props)
    log.info("Pipeline initialized")
    pipeline
  }

  def loadDocuments(folder: String) = {
    val dir = new File(folder)
    if (dir.exists && dir.isDirectory) {
      dir.listFiles.filter{ f => 
        f.isFile && f.getName.endsWith(".txt")
      }.toList
    } else {
      List.empty[File]
    }
  }

  def loadText(f: File) =
    Source.fromFile(f).getLines().mkString("\n")

  def normalize(text: String) = 
    text.replaceAll("/", " ")
        .replaceAll("\\-\\\\n", "")
        .replaceAll("[,.!?:;]\\\\n", "")
        .replaceAll("\\n", "")

  def split(text: String) = text.split("\\.").map(_.trim).filter(_.length > 0)

  def main(args: Array[String]): Unit = {
    val FOLDER = "../../../sample-data/two-related"

    loadDocuments(FOLDER).map { f => 

      val normalizedText = normalize(loadText(f))

      split(normalizedText).par.map { chunk => 
        val document = new CoreDocument(chunk)
        pipeline.annotate(document)

        def getTag(label: CoreLabel) = label.get(classOf[CoreAnnotations.NamedEntityTagAnnotation])

        val tokens = document.tokens().asScala.foldLeft(Seq.empty[Entity]) { (result, token) =>
          val entity = Entity.fromToken(token)

          result.headOption match {
            case Some(prev) if prev.tag == entity.tag =>
              // Append to previous phrase if entity tag is the same
              prev.append(entity) +: result.tail


            case _ =>
              // Either this is the first token or a new phrase
              entity +: result
          }
        }

        val entities = tokens.filter(_.tag != "O")
        if (entities.size > 0)
          println(entities)
      }
    }
  }

}

