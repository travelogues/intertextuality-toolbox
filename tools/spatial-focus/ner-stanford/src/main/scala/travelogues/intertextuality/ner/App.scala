package travelogues.intertextuality.ner

import edu.stanford.nlp.pipeline.{CoreDocument, StanfordCoreNLP}
import edu.stanford.nlp.util.StringUtils
import edu.stanford.nlp.ling.{CoreAnnotations, CoreLabel}
import org.slf4j.LoggerFactory
import scala.collection.JavaConverters._

object App {

  // TODO replace with CLI arg
  private val SOURCE_FOLDER = "../../../sample-data/two-related"

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
    Utils.loadDocuments(SOURCE_FOLDER).par.map { f => 
      val normalizedText = Utils.normalize(Utils.loadText(f))

      Utils.splitOnPeriod(normalizedText).par.map { chunk =>
        
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

        // TODO write to file
        if (entities.size > 0)
          println(entities)

        /*
          {
            "sentence": "...",
            "tokens": [
              { "chars": "...", "label": "....", "offset": 123 }
            ]
          }
        */
      }
    }
  }

}