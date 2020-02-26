package travelogues.intertextuality.ner

import edu.stanford.nlp.pipeline.{CoreDocument, StanfordCoreNLP}
import edu.stanford.nlp.util.StringUtils
import edu.stanford.nlp.ling.{CoreAnnotations, CoreLabel}
import org.slf4j.LoggerFactory
import play.api.libs.json.Json
import scala.collection.JavaConverters._

/** Runs NER on all .txt files in the given folder. Run the tool via sbt:
  *  
  * `sbt "run [folder]"` e.g.
  * `sbt "run /home/myuser/data/mydocuments" --> don't forget the quotes!
  */
object App {

  private val DEFAULT_SOURCE_FOLDER = "../../../sample-data/two-related"

  private val DEFAULT_DESTINATION_FOLDER = "../../../results/two-related"

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

  /** Shorthand **/
  private def getTag(label: CoreLabel) = label.get(classOf[CoreAnnotations.NamedEntityTagAnnotation])

  def main(args: Array[String]): Unit = {
    
    val sourceFolder = args.headOption.getOrElse(DEFAULT_SOURCE_FOLDER)
    println(s"Reading from folder ${sourceFolder}")

    // Keep track of progress
    var total = 0;
    var ctr = 0;

    try {
      Utils.loadDocuments(sourceFolder).par.map { f => 
        // Each source document gets its own JSON result file
        val filename = f.getName.substring(0, f.getName.lastIndexOf('.'))

        // TODO use commandline arg
        val out = Utils.openOutfile(s"${DEFAULT_DESTINATION_FOLDER}/${filename}.ner.stanford.jsonl")

        val normalizedText = Utils.normalize(Utils.loadText(f))
        val sentences = Utils.splitOnPeriod(normalizedText)

        total += sentences.size

        sentences.map { chunk =>
          
          // NER using Stanford 
          val document = new CoreDocument(chunk)
          pipeline.annotate(document)

          // Loop through tokens and perform some minimal cleanup
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
          if (entities.size > 0) {
            val asJson = Json.obj(
              "sentence" -> chunk,
              "tokens" -> entities.map(e => Json.obj(
                "chars" -> e.chars,
                "tag" -> e.tag,
                "offset" -> e.offset
              )))
            
            out.write(s"${Json.stringify(asJson)}\n")
          }

          ctr += 1
          print(s"Parsed ${ctr} / ${total} chunks\r")
        }

        out.close()
      }
    } catch { 
      case e: NotFoundException => println(s"Folder not found: ${sourceFolder}")
      case e: Throwable => 
        println(s"There was an error: ${e.getMessage}")
        e.printStackTrace
    }
  }

}
