import { Wildcard } from "./Wildcard";
import { WildcardList } from "./WildcardList";

export const wildcards = new WildcardList<', - * /' | ', - * ? / L W' | ', - * ? L #'>([
  new Wildcard(', - * /'),
  new Wildcard(', - * ? / L W'),
  new Wildcard(', - * ? L #'),
]);
