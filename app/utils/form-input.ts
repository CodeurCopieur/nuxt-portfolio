const SQL_PAYLOAD =
  /(?<![A-Za-zÀ-ÿ])'\s*(or|and)\b|'(?:--|#)|(?:^|\s)--|\/\*|\*\/|\bunion\b[\s\S]{0,80}\bselect\b|\b(?:drop|truncate|alter)\s+(?:table|database)\b|\binsert\s+into\b|\bdelete\s+from\b|\bupdate\s+\w+\s+set\b|\b(?:exec|execute)\s*\(|\bxp_cmdshell\b|(?:\bor\b|\band\b)\s+\d+\s*=\s*\d+/i

const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/

/** Vrai si le texte ressemble à une charge SQL ou contient un caractère de contrôle. */
export function containsSqlPayload(value: string) {
  return CONTROL_CHARS.test(value) || SQL_PAYLOAD.test(value)
}
