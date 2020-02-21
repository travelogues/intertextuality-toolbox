package travelogues.intertextuality.ner

import edu.stanford.nlp.ling.{CoreAnnotations, CoreLabel}

case class Entity(chars: String, tag: String, offset: Int) {

  def append(entity: Entity) = 
    Entity(s"${chars} ${entity.chars}", tag, offset)

}

object Entity {

  def fromToken(token: CoreLabel) = Entity(
    token.get(classOf[CoreAnnotations.TextAnnotation]),
    token.get(classOf[CoreAnnotations.NamedEntityTagAnnotation]),
    token.beginPosition)

}
