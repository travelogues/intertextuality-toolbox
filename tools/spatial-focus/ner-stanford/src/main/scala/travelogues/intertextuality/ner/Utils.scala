package travelogues.intertextuality.ner

import java.io.File
import scala.io.Source

final case class NotFoundException(private val msg: String = "") 
  extends Exception(msg)

object Utils {

  /** Load all txts from a folder **/
  def loadDocuments(folder: String) = {
    val dir = new File(folder)
    if (dir.exists && dir.isDirectory) {
      dir.listFiles.filter{ f => 
        f.isFile && f.getName.endsWith(".txt")
      }.toList
    } else {
      throw new NotFoundException
    }
  }

  /** txt file to string **/
  def loadText(f: File) =
    Source.fromFile(f).getLines().mkString("\n")

  /** Minimal normalization - remove line break backslashes, line breaks, interpunctuation **/
  def normalize(text: String) = 
    text.replaceAll("/", " ")
        .replaceAll("\\-\\\\n", "")
        .replaceAll("[,.!?:;]\\\\n", "")
        .replaceAll("\\n", "")

  /** Split on period and remove empty lines **/
  def splitOnPeriod(text: String) = text.split("\\.").map(_.trim).filter(_.length > 0)

}